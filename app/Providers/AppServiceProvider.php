<?php

namespace App\Providers;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
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
            ]);
        }

        // HYBRID SYSTEM: Fallback auto-depreciation
        // Hanya jalan jika scheduler belum run hari ini
        $this->runDepreciationFallback();
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
            $processed = 0;

            $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
            $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

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

            // Ada aset yang perlu diproses, jalankan update
            Asset::whereNotNull('received_date')
                ->orderBy('id')
                ->chunkById(100, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed) {
                    foreach ($assets as $asset) {
                        if ($this->processAsset($asset, $today, $activeDepreciationFormula, $activeAppreciationFormula)) {
                            $processed++;
                        }
                    }
                });

            // Catat di cache bahwa sudah run hari ini
            Cache::put($cacheKey, now(), now()->endOfDay());

            // Log jika ada yang diproses
            if ($processed > 0) {
                \Log::info("Fallback depreciation executed: {$processed} assets updated");
            }

        } catch (\Exception $e) {
            // Silent fail - tidak ganggu user experience
            \Log::error('Fallback depreciation error: ' . $e->getMessage());
        }
    }

    /**
     * Process single asset untuk depreciation/appreciation
     */
    private function processAsset($asset, $today, $activeDepreciationFormula, $activeAppreciationFormula): bool
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
        $formula = $isAppreciating ? $activeAppreciationFormula : $activeDepreciationFormula;

        if (!$formula) {
            return false;
        }

        $ageYears = $this->calculateAgeInYears($purchaseDate, $today);
        $annualChange = $this->evaluateExpression($formula->expression, [
            '{price}' => $asset->purchase_price ?: 0,
            '{salvage}' => $asset->salvage_value ?: 0,
            '{life}' => max(1, $asset->useful_life),
            '{age}' => $ageYears,
        ]);

        if ($annualChange === null) {
            return false;
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

        NotificationService::notifyAdmins(
            'Perhitungan Ulang Nilai Aset (Auto)',
            "Nilai aset '{$asset->name}' (kode: {$asset->asset_code}) telah dihitung ulang. Nilai sebelumnya: " . number_format($currentValue, 0, ',', '.') . ", Nilai saat ini: " . number_format($newValue, 0, ',', '.'),
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

        return true;
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
