<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FormulaController extends Controller
{
    public function index()
    {
        return Inertia::render('Formulas/Index', [
            'formulas' => DepreciationFormula::all(),
            'variables' => DepreciationFormula::$allowedVariables,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'expression' => 'required|string',
            'type' => 'required|in:depreciation,appreciation',
        ]);

        DepreciationFormula::create($request->all());
        return redirect()->back();
    }

    public function activate(DepreciationFormula $formula)
    {
        // Set semua rumus dengan tipe yang sama ke tidak aktif
        DepreciationFormula::where('type', $formula->type)->update(['is_active' => false]);
        // Set yang dipilih ke aktif
        $formula->update(['is_active' => true]);

        // PERBAIKAN BUG: Hitung ulang semua aset setelah formula diaktifkan
        $this->recalculateAllAssets($formula);

        return redirect()->back()->with('message', 'Rumus diaktifkan dan semua aset telah dihitung ulang.');
    }

    public function destroy(DepreciationFormula $formula)
    {
        $formula->delete();
        return redirect()->back();
    }

    public function calculator()
    {
        return Inertia::render('Calculator/Index', [
            'formulas' => DepreciationFormula::all(),
            'variables' => DepreciationFormula::$allowedVariables,
        ]);
    }

    /**
     * Recalculate semua aset setelah formula baru diaktifkan
     */
    private function recalculateAllAssets(DepreciationFormula $formula)
    {
        $today = now()->startOfDay();
        $processed = 0;

        // Tentukan apakah ini formula untuk depreciation atau appreciation
        $isDepreciationFormula = $formula->type === 'depreciation';

        // PERBAIKAN BUG: Gunakan depreciation_type field, bukan deteksi dari type
        $query = Asset::whereNotNull('received_date');

        if ($isDepreciationFormula) {
            // Untuk depreciation: aset dengan depreciation_type = 'depreciation'
            $query->where('depreciation_type', 'depreciation');
        } else {
            // Untuk appreciation: aset dengan depreciation_type = 'appreciation'
            $query->where('depreciation_type', 'appreciation');
        }

        $query->chunkById(100, function ($assets) use ($formula, $today, &$processed) {
            foreach ($assets as $asset) {
                $receivedDate = Carbon::parse($asset->received_date)->startOfDay();

                // Hitung age dengan presisi
                $ageYears = $this->calculateAgeInYears($receivedDate, $today);

                // CEK: Apakah menggunakan custom rate?
                if (!empty($asset->custom_depreciation_rate)) {
                    // SKIP: Aset dengan custom rate tidak terpengaruh oleh formula
                    continue;
                }

                // Evaluasi formula baru
                $annualChange = $this->evaluateExpression($formula->expression, [
                    '{price}' => $asset->purchase_price ?: 0,
                    '{salvage}' => $asset->salvage_value ?: 0,
                    '{life}' => max(1, $asset->useful_life),
                    '{age}' => $ageYears,
                ]);

                if ($annualChange === null) {
                    continue;
                }

                $currentValue = $asset->current_book_value ?? $asset->purchase_price;

                // PERBAIKAN BUG: annualChange adalah ANNUAL rate, bukan total
                // Kita perlu kalikan dengan age untuk mendapat total
                // TAPI cek dulu apakah formula sudah pakai {age} atau belum

                // Cek apakah formula menggunakan variabel {age}
                $formulaUsesAge = str_contains($formula->expression, '{age}');

                // Hitung nilai baru
                if ($asset->is_appreciating) {
                    if ($formulaUsesAge) {
                        // Formula sudah hitung total (misal: {price} * 0.05 * {age})
                        // Langsung pakai hasil formula
                        $newValue = $asset->purchase_price + abs($annualChange);
                    } else {
                        // Formula hanya hitung per tahun (misal: {price} * 0.05)
                        // Kalikan dengan age untuk dapat total
                        $newValue = $asset->purchase_price + (abs($annualChange) * $ageYears);
                    }
                } else {
                    $floor = $asset->salvage_value ?? 0;

                    if ($formulaUsesAge) {
                        // Formula sudah hitung total depreciation
                        $newValue = max($floor, $asset->purchase_price - abs($annualChange));
                    } else {
                        // Formula hitung per tahun, kalikan dengan age
                        $totalDepreciation = abs($annualChange) * $ageYears;
                        $newValue = max($floor, $asset->purchase_price - $totalDepreciation);
                    }
                }

                $newValue = round($newValue, 2);

                // Update nilai aset
                $asset->forceFill([
                    'current_book_value' => $newValue,
                ])->save();

                // Update history
                // Hitung delta dari selisih nilai (newValue - currentValue)
                $changeAmount = $newValue - $currentValue;
                $changeSigned = $asset->is_appreciating ? -abs($changeAmount) : abs($changeAmount);

                DepreciationHistory::updateOrCreate(
                    ['asset_id' => $asset->id, 'year' => $today->year],
                    [
                        'book_value_start' => $currentValue,
                        'depreciation_value' => $changeSigned,
                        'book_value_end' => $newValue,
                    ]
                );

                $processed++;
            }
        });

        // Kirim notifikasi ke admin
        if ($processed > 0) {
            NotificationService::notifyAdmins(
                'Rumus Baru Diaktifkan - Aset Dihitung Ulang',
                "Rumus '{$formula->name}' telah diaktifkan. Total {$processed} aset telah dihitung ulang menggunakan rumus baru.",
                'success',
                [
                    'formula_id' => $formula->id,
                    'formula_name' => $formula->name,
                    'formula_type' => $formula->type,
                    'assets_recalculated' => $processed,
                    'calculated_at' => $today->toDateString(),
                ]
            );
        }

        Log::info("Formula activated: {$formula->name}. {$processed} assets recalculated.");
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
