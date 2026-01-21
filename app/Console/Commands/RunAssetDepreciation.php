<?php

namespace App\Console\Commands;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RunAssetDepreciation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assets:run-depreciation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hitung dan perbarui nilai aset pada tanggal ulang tahun pembelian (tahun-ke-tahun), serta kirim notifikasi.';

    public function handle(): int
    {
        $today = now()->startOfDay();
        $processed = 0;
        $processedAssets = []; // Collect aset yang diproses untuk summary notification

        // Set cache SEBELUM processing untuk prevent race condition dengan fallback
        $cacheKey = 'depreciation_last_run_' . $today->toDateString();
        Cache::put($cacheKey, now(), now()->endOfDay());

        $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
        $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

        // Query semua aset yang sudah waktunya untuk diupdate
        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(200, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed, &$processedAssets) {
                foreach ($assets as $asset) {
                    $purchaseDate = Carbon::parse($asset->received_date)->startOfDay();

                    // Belum satu tahun sejak pembelian
                    if ($today->lt($purchaseDate->copy()->addYear())) {
                        continue;
                    }

                    // Cari anniversary date berikutnya dari received_date
                    $yearsSincePurchase = $purchaseDate->diffInYears($today);
                    $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase);

                    // Jika hari ini belum sampai anniversary tahun ini, cek anniversary tahun lalu
                    if ($today->lt($nextAnniversary)) {
                        $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase - 1);
                    }

                    // Proses hanya jika:
                    // 1. Belum pernah diproses (last_depreciation_date = null), ATAU
                    // 2. Hari ini sudah melewati anniversary date yang belum diproses
                    $shouldProcess = false;

                    if ($asset->last_depreciation_date === null) {
                        // Belum pernah diproses, proses sekarang
                        $shouldProcess = true;
                    } else {
                        $lastProcessedDate = Carbon::parse($asset->last_depreciation_date)->startOfDay();
                        // FIX: Cek apakah hari ini >= anniversary DAN anniversary > last processed
                        if ($today->gte($nextAnniversary) && $nextAnniversary->gt($lastProcessedDate)) {
                            $shouldProcess = true;
                        }
                    }

                    if (!$shouldProcess) {
                        continue;
                    }

                    $isAppreciating = $asset->is_appreciating;

                    // Hitung umur aset dalam tahun (pro-rata)
                    $ageYears = $this->calculateAgeInYears($purchaseDate, $today);
                    $totalChange = null;

                    // CEK: Apakah aset menggunakan custom rate?
                    if (!empty($asset->custom_depreciation_rate)) {
                        // CUSTOM RATE: Hitung TOTAL berdasarkan persentase × umur
                        $annualRate = ($asset->purchase_price * $asset->custom_depreciation_rate / 100);
                        $totalChange = $annualRate * $ageYears;
                    } else {
                        // FORMULA: Gunakan formula aktif dari database
                        $formula = $isAppreciating ? $activeAppreciationFormula : $activeDepreciationFormula;

                        if (!$formula) {
                            $this->warn("Tidak ada rumus aktif untuk tipe aset {$asset->type}, aset #{$asset->id} dilewati.");
                            continue;
                        }

                        // Evaluasi formula
                        $formulaResult = $this->evaluateExpression($formula->expression, [
                            '{price}' => $asset->purchase_price ?: 0,
                            '{salvage}' => $asset->salvage_value ?: 0,
                            '{life}' => max(1, $asset->useful_life),
                            '{age}' => $ageYears,
                        ]);

                        // Cek apakah formula menggunakan {age} atau tidak
                        $formulaUsesAge = str_contains($formula->expression, '{age}');

                        if ($formulaUsesAge) {
                            // Formula sudah menghitung total
                            $totalChange = $formulaResult;
                        } else {
                            // Formula hanya menghitung per tahun, kalikan dengan umur
                            $totalChange = $formulaResult * $ageYears;
                        }
                    }

                    if ($totalChange === null) {
                        $this->warn("Rumus gagal dievaluasi untuk aset #{$asset->id} ({$asset->name}), dilewati.");
                        continue;
                    }

                    // PENTING: Hitung nilai baru dari HARGA BELI (bukan dari current_book_value)
                    // Ini memastikan nilai selalu akurat berdasarkan umur aset
                    $previousValue = $asset->current_book_value ?? $asset->purchase_price;
                    $delta = abs($totalChange);

                    if ($isAppreciating) {
                        // Appreciation: Harga naik
                        $newValue = $asset->purchase_price + $delta;
                    } else {
                        // Depreciation: Harga turun, tapi tidak boleh di bawah nilai sisa
                        $floor = $asset->salvage_value ?? 0;
                        $newValue = max($floor, $asset->purchase_price - $delta);
                    }

                    $newValue = round($newValue, 2);

                    // Hitung perubahan dari nilai sebelumnya
                    $valueChange = $newValue - $previousValue;
                    $changeSigned = $isAppreciating ? -abs($valueChange) : abs($valueChange);

                    DepreciationHistory::updateOrCreate(
                        ['asset_id' => $asset->id, 'year' => $today->year],
                        [
                            'book_value_start' => $previousValue,
                            'depreciation_value' => $changeSigned,
                            'book_value_end' => $newValue,
                        ]
                    );

                    $asset->forceFill([
                        'current_book_value' => $newValue,
                        'last_depreciation_date' => $nextAnniversary->toDateString(),
                    ])->save();

                    // Collect data untuk summary notification
                    $changeType = $isAppreciating ? 'naik' : 'turun';
                    $processedAssets[] = [
                        'id' => $asset->id,
                        'name' => $asset->name,
                        'code' => $asset->asset_code,
                        'previous' => $previousValue,
                        'current' => $newValue,
                        'change' => $valueChange,
                        'type' => $changeType,
                        'anniversary' => $nextAnniversary->format('d M Y'),
                    ];

                    $this->info("✓ Aset #{$asset->id} ({$asset->name}) - Anniversary {$nextAnniversary->format('d M Y')}: Rp " . number_format($previousValue, 0, ',', '.') . " → Rp " . number_format($newValue, 0, ',', '.') . " (umur: " . round($ageYears, 1) . " tahun)");
                    $processed++;
                }
            });

        if ($processed > 0) {
            $this->info("✓ Depresiasi otomatis selesai. Total {$processed} aset berhasil diperbarui.");

            // Kirim 1 notifikasi summary untuk semua aset yang diproses
            $assetList = collect($processedAssets)->take(5)->map(function ($asset) {
                return "• {$asset['name']} ({$asset['code']}): {$asset['type']} Rp " . number_format(abs($asset['change']), 0, ',', '.');
            })->join("\n");

            $remaining = count($processedAssets) > 5 ? "\n... dan " . (count($processedAssets) - 5) . " aset lainnya" : "";

            NotificationService::notifyAdmins(
                'Perhitungan Otomatis Nilai Aset Selesai',
                "Sistem telah menghitung ulang nilai {$processed} aset pada tanggal anniversary mereka (" . $today->format('d M Y') . ").\n\nRingkasan perubahan:\n{$assetList}{$remaining}\n\nSemua perubahan telah dicatat dalam history.",
                'success',
                [
                    'total_processed' => $processed,
                    'processed_date' => $today->toDateString(),
                    'assets' => $processedAssets,
                ]
            );
        } else {
            $this->info("ℹ Tidak ada aset yang perlu diperbarui hari ini.");
        }

        return Command::SUCCESS;
    }

    /**
     * Hitung age dalam tahun dengan desimal (pro-rata)
     */
    private function calculateAgeInYears(Carbon $receivedDate, Carbon $today): float
    {
        $totalDays = $receivedDate->diffInDays($today);
        return $totalDays / 365.25;
    }

    private function evaluateExpression(string $expression, array $variables): ?float
    {
        $built = str_replace(array_keys($variables), array_values($variables), $expression);

        try {
            // Expression dikontrol admin, bukan input user.
            return (float) eval("return {$built};");
        } catch (\Throwable $e) {
            return null;
        }
    }
}
