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

        $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
        $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

        // Query semua aset yang sudah waktunya untuk diupdate
        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(200, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed) {
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
                    $formula = $isAppreciating ? $activeAppreciationFormula : $activeDepreciationFormula;

                    if (!$formula) {
                        $this->warn("Tidak ada rumus aktif untuk tipe aset {$asset->type}, aset #{$asset->id} dilewati.");
                        continue;
                    }

                    // Hitung age dengan akurasi desimal untuk perhitungan lebih presisi
                    $ageYears = $this->calculateAgeInYears($purchaseDate, $today);
                    $annualChange = $this->evaluateExpression($formula->expression, [
                        '{price}' => $asset->purchase_price ?: 0,
                        '{salvage}' => $asset->salvage_value ?: 0,
                        '{life}' => max(1, $asset->useful_life),
                        '{age}' => $ageYears,
                    ]);

                    if ($annualChange === null) {
                        $this->warn("Rumus gagal dievaluasi untuk aset #{$asset->id} ({$asset->name}), dilewati.");
                        continue;
                    }

                    $currentValue = $asset->current_book_value ?? $asset->purchase_price;
                    $delta = abs($annualChange);

                    if ($isAppreciating) {
                        $newValue = $currentValue + $delta;
                    } else {
                        $floor = $asset->salvage_value ?? 0;
                        $newValue = max($floor, $currentValue - $delta);
                    }

                    $newValue = round($newValue, 2);
                    $changeSigned = $isAppreciating ? -$delta : $delta;

                    DepreciationHistory::updateOrCreate(
                        ['asset_id' => $asset->id, 'year' => $today->year],
                        [
                            'book_value_start' => $currentValue,
                            'depreciation_value' => $changeSigned,
                            'book_value_end' => $newValue,
                        ]
                    );

                    $asset->forceFill([
                        'current_book_value' => $newValue,
                        'last_depreciation_date' => $nextAnniversary->toDateString(),
                    ])->save();

                    // Kirim notifikasi setiap kali update
                    NotificationService::notifyAdmins(
                        'Perhitungan Ulang Nilai Aset (Anniversary)',
                        "Nilai aset '{$asset->name}' (kode: {$asset->asset_code}) telah dihitung ulang pada anniversary date ({$nextAnniversary->format('d M Y')}). Nilai sebelumnya: " . number_format($currentValue, 0, ',', '.') . ", Nilai saat ini: " . number_format($newValue, 0, ',', '.'),
                        'info',
                        [
                            'asset_id' => $asset->id,
                            'asset_code' => $asset->asset_code,
                            'previous_value' => $currentValue,
                            'current_value' => $newValue,
                            'calculated_on' => $today->toDateString(),
                            'anniversary_date' => $nextAnniversary->toDateString(),
                            'age_years' => round($ageYears, 2),
                        ]
                    );

                    $this->info("✓ Aset #{$asset->id} ({$asset->name}) - Anniversary {$nextAnniversary->format('d M Y')}: Rp " . number_format($currentValue, 0, ',', '.') . " → Rp " . number_format($newValue, 0, ',', '.'));
                    $processed++;
                }
            });

        if ($processed > 0) {
            $this->info("✓ Depresiasi otomatis selesai. Total {$processed} aset berhasil diperbarui.");
            
            // Catat di cache bahwa scheduler sudah run hari ini
            Cache::put('depreciation_last_run_' . now()->toDateString(), now(), now()->endOfDay());
        } else {
            $this->info("ℹ Tidak ada aset yang perlu diperbarui hari ini.");
            
            // Tetap catat di cache meskipun tidak ada yang diproses
            Cache::put('depreciation_last_run_' . now()->toDateString(), now(), now()->endOfDay());
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
