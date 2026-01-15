<?php

namespace App\Console\Commands;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class RecalculateAssetValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assets:recalculate-values {--force : Force recalculation for all assets}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate semua nilai aset menggunakan formula aktif saat ini';

    public function handle(): int
    {
        $this->info('🔄 Memulai recalculation nilai aset...');
        
        $today = now()->startOfDay();
        $processed = 0;

        $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
        $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

        if (!$activeDepreciationFormula && !$activeAppreciationFormula) {
            $this->error('❌ Tidak ada formula aktif. Aktifkan formula terlebih dahulu.');
            return Command::FAILURE;
        }

        // Process semua aset
        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(100, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed) {
                foreach ($assets as $asset) {
                    $receivedDate = Carbon::parse($asset->received_date)->startOfDay();
                    
                    // Skip aset yang belum 1 tahun (kecuali --force)
                    if (!$this->option('force') && $today->lt($receivedDate->copy()->addYear())) {
                        continue;
                    }

                    $isAppreciating = $asset->is_appreciating;
                    $formula = $isAppreciating ? $activeAppreciationFormula : $activeDepreciationFormula;

                    if (!$formula) {
                        $this->warn("⚠ Tidak ada rumus aktif untuk tipe aset {$asset->type}, aset #{$asset->id} dilewati.");
                        continue;
                    }

                    // Hitung age dengan presisi
                    $ageYears = $this->calculateAgeInYears($receivedDate, $today);
                    
                    // Evaluasi formula
                    $annualChange = $this->evaluateExpression($formula->expression, [
                        '{price}' => $asset->purchase_price ?: 0,
                        '{salvage}' => $asset->salvage_value ?: 0,
                        '{life}' => max(1, $asset->useful_life),
                        '{age}' => $ageYears,
                    ]);

                    if ($annualChange === null) {
                        $this->warn("⚠ Rumus gagal dievaluasi untuk aset #{$asset->id} ({$asset->name}), dilewati.");
                        continue;
                    }

                    $currentValue = $asset->current_book_value ?? $asset->purchase_price;
                    $delta = abs($annualChange);
                    
                    // Hitung nilai baru
                    if ($isAppreciating) {
                        $newValue = $asset->purchase_price + $delta;
                    } else {
                        $floor = $asset->salvage_value ?? 0;
                        $newValue = max($floor, $asset->purchase_price - $delta);
                    }

                    $newValue = round($newValue, 2);

                    // Update nilai aset
                    $asset->forceFill([
                        'current_book_value' => $newValue,
                    ])->save();

                    // Update history
                    $changeSigned = $isAppreciating ? -$delta : $delta;
                    DepreciationHistory::updateOrCreate(
                        ['asset_id' => $asset->id, 'year' => $today->year],
                        [
                            'book_value_start' => $currentValue,
                            'depreciation_value' => $changeSigned,
                            'book_value_end' => $newValue,
                        ]
                    );

                    $this->info("✓ Aset #{$asset->id} ({$asset->name}): Rp " . number_format($currentValue, 0, ',', '.') . " → Rp " . number_format($newValue, 0, ',', '.'));
                    $processed++;
                }
            });

        if ($processed > 0) {
            $this->info("\n✅ Recalculation selesai. Total {$processed} aset berhasil diperbarui.");
            
            // Kirim notifikasi
            NotificationService::notifyAdmins(
                'Recalculation Manual Selesai',
                "Total {$processed} aset telah dihitung ulang menggunakan formula aktif saat ini.",
                'success',
                [
                    'assets_recalculated' => $processed,
                    'calculated_at' => $today->toDateString(),
                    'trigger' => 'manual',
                ]
            );
        } else {
            $this->info("\nℹ Tidak ada aset yang perlu diperbarui.");
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
}
