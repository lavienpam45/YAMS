<?php

namespace App\Providers;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register commands untuk console
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Console\Commands\RunAssetDepreciation::class,
                \App\Console\Commands\RecordDepreciationHistory::class,
                \App\Console\Commands\RecalculateAssetValues::class,
            ]);
        }

        // FALLBACK SYSTEM DINONAKTIFKAN
        // Scheduler sudah stabil, fallback tidak diperlukan lagi
        // Ini menghindari duplikasi notifikasi dan race condition
        // Jika ingin mengaktifkan kembali, uncomment baris di bawah:
        // $this->runDepreciationFallback();
    }

    /**
     * Fallback mechanism untuk auto-depreciation
     * Jalan otomatis jika scheduler belum run hari ini
     */
    private function runDepreciationFallback(): void
    {
        try {
            $cacheKey = 'depreciation_last_run_' . now()->toDateString();

            // Cek cache: Apakah sudah run hari ini?
            if (Cache::has($cacheKey)) {
                return; // Sudah run, skip
            }

            $today = now()->startOfDay();

            // Cek apakah ada aset yang perlu diproses
            $needsProcessing = Asset::whereNotNull('received_date')
                ->where(function ($query) use ($today) {
                    // Aset yang belum pernah diproses
                    $query->whereNull('last_depreciation_date')
                          // Atau sudah 1 tahun dari received_date
                          ->orWhereRaw('DATE_ADD(received_date, INTERVAL 1 YEAR) <= ?', [$today->toDateString()]);
                })
                ->exists();

            if (!$needsProcessing) {
                // Tidak ada yang perlu diproses, tapi tetap catat di cache
                Cache::put($cacheKey, now(), now()->endOfDay());
                return;
            }

            // SET CACHE SEBELUM PROCESSING untuk prevent race condition
            Cache::put($cacheKey, now(), now()->endOfDay());

            $processed = 0;
            $processedAssets = [];
            $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
            $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

            // Ada aset yang perlu diproses, jalankan update
            Asset::whereNotNull('received_date')
                ->orderBy('id')
                ->chunkById(100, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed, &$processedAssets) {
                    foreach ($assets as $asset) {
                        $result = $this->processAsset($asset, $today, $activeDepreciationFormula, $activeAppreciationFormula);
                        if ($result) {
                            $processedAssets[] = $result;
                            $processed++;
                        }
                    }
                });

            // Log dan kirim notifikasi jika ada yang diproses
            if ($processed > 0) {
                Log::info("Fallback depreciation executed: {$processed} assets updated");

                // Kirim 1 notifikasi summary
                $assetList = collect($processedAssets)->take(5)->map(function ($asset) {
                    return "• {$asset['name']} ({$asset['code']}): {$asset['type']} Rp " . number_format(abs($asset['change']), 0, ',', '.');
                })->join("\n");

                $remaining = count($processedAssets) > 5 ? "\n... dan " . (count($processedAssets) - 5) . " aset lainnya" : "";

                NotificationService::notifyAdmins(
                    'Perhitungan Otomatis Nilai Aset (Fallback)',
                    "Sistem fallback telah menghitung ulang nilai {$processed} aset (" . $today->format('d M Y') . ").\n\nRingkasan perubahan:\n{$assetList}{$remaining}",
                    'info',
                    [
                        'total_processed' => $processed,
                        'processed_date' => $today->toDateString(),
                        'mechanism' => 'fallback',
                        'assets' => $processedAssets,
                    ]
                );
            }

        } catch (\Exception $e) {
            // Silent fail - tidak ganggu user experience
            Log::error('Fallback depreciation error: ' . $e->getMessage());
        }
    }

    /**
     * Process single asset untuk depreciation/appreciation
     * Return array dengan data aset jika berhasil, false jika skip
     */
    private function processAsset(Asset $asset, Carbon $today, $activeDepreciationFormula, $activeAppreciationFormula): array|false
    {
        $purchaseDate = Carbon::parse($asset->received_date)->startOfDay();

        // Belum satu tahun sejak pembelian
        if ($today->lt($purchaseDate->copy()->addYear())) {
            return false;
        }

        // Cari anniversary date berikutnya
        $yearsSincePurchase = $purchaseDate->diffInYears($today);
        $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase);

        if ($today->lt($nextAnniversary)) {
            $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase - 1);
        }

        // Cek apakah perlu diproses
        $shouldProcess = false;

        if ($asset->last_depreciation_date === null) {
            $shouldProcess = true;
        } else {
            $lastProcessedDate = Carbon::parse($asset->last_depreciation_date)->startOfDay();
            if ($today->gte($nextAnniversary) && $nextAnniversary->gt($lastProcessedDate)) {
                $shouldProcess = true;
            }
        }

        if (!$shouldProcess) {
            return false;
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
                return false;
            }

            // Evaluasi formula
            $formulaResult = $this->evaluateExpression($formula->expression, [
                '{price}' => $asset->purchase_price ?: 0,
                '{salvage}' => $asset->salvage_value ?: 0,
                '{life}' => max(1, $asset->useful_life),
                '{age}' => $ageYears,
            ]);

            if ($formulaResult === null) {
                return false;
            }

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
            return false;
        }

        // PENTING: Hitung nilai baru dari HARGA BELI (bukan dari current_book_value)
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

        // Return data aset untuk summary notification
        $changeType = $isAppreciating ? 'naik' : 'turun';
        return [
            'id' => $asset->id,
            'name' => $asset->name,
            'code' => $asset->asset_code,
            'previous' => $previousValue,
            'current' => $newValue,
            'change' => $valueChange,
            'type' => $changeType,
        ];
    }

    /**
     * Evaluasi expression dengan variable replacement
     */
    private function evaluateExpression(string $expression, array $variables): ?float
    {
        $built = str_replace(array_keys($variables), array_values($variables), $expression);

        try {
            return (float) eval("return {$built};");
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Hitung age dalam tahun dengan desimal (pro-rata)
     */
    private function calculateAgeInYears(Carbon $receivedDate, Carbon $today): float
    {
        $totalDays = $receivedDate->diffInDays($today);
        return $totalDays / 365.25;
    }
}
