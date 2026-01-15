<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

        // Ambil semua aset yang sesuai dengan tipe formula
        $query = Asset::whereNotNull('received_date');
        
        if ($isDepreciationFormula) {
            // Untuk depreciation: aset yang BUKAN tanah/bangunan
            $query->where(function ($q) {
                $q->where('type', 'not like', '%tanah%')
                  ->where('type', 'not like', '%bangunan%');
            });
        } else {
            // Untuk appreciation: aset tanah/bangunan
            $query->where(function ($q) {
                $q->where('type', 'like', '%tanah%')
                  ->orWhere('type', 'like', '%bangunan%');
            });
        }

        $query->chunkById(100, function ($assets) use ($formula, $today, &$processed) {
            foreach ($assets as $asset) {
                $receivedDate = Carbon::parse($asset->received_date)->startOfDay();
                
                // Skip aset yang belum 1 tahun
                if ($today->lt($receivedDate->copy()->addYear())) {
                    continue;
                }

                // Hitung age dengan presisi
                $ageYears = $this->calculateAgeInYears($receivedDate, $today);
                
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
                $delta = abs($annualChange);
                
                // Hitung nilai baru
                if ($asset->is_appreciating) {
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
                $changeSigned = $asset->is_appreciating ? -$delta : $delta;
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

        \Log::info("Formula activated: {$formula->name}. {$processed} assets recalculated.");
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
