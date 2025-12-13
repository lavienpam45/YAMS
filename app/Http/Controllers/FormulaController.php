<?php

namespace App\Http\Controllers;

use App\Models\DepreciationFormula;
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
        ]);

        DepreciationFormula::create($request->all());
        return redirect()->back();
    }

    public function activate(DepreciationFormula $formula)
    {
        // Set semua ke tidak aktif
        DepreciationFormula::query()->update(['is_active' => false]);
        // Set yang dipilih ke aktif
        $formula->update(['is_active' => true]);

        return redirect()->back();
    }
    
    public function destroy(DepreciationFormula $formula)
    {
        $formula->delete();
        return redirect()->back();
    }
}