<?php

namespace App\Http\Controllers;

use App\Exports\AssetsExport;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf; // Pastikan ini diimpor
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $assetsQuery = Asset::query();
        if ($request->filled('category') && $request->input('category') !== 'Semua') {
            $assetsQuery->where('type', $request->input('category'));
        }
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = 'asc';
        if (in_array($sortBy, ['id', 'name', 'received_date', 'type', 'room_name'])) {
            $assetsQuery->orderBy($sortBy, $sortOrder);
        }
        $assets = $assetsQuery->paginate(15)->withQueryString();

        $categories = Asset::select('type')->distinct()->pluck('type');

        $summary = [
            'total_assets' => Asset::count(),
            'total_purchase_value' => Asset::sum('purchase_price'),
            'total_book_value' => Asset::all()->sum('book_value'),
        ];

        return Inertia::render('Reports/Index', [
            'assets' => $assets,
            'filters' => $request->only(['category', 'sort_by']),
            'categories' => $categories,
            'summary' => $summary,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $filters = $request->only(['category', 'sort_by']);
        return Excel::download(new AssetsExport($filters), 'laporan-aset.xlsx');
    }

    public function exportPdf(Request $request)
    {
        // Logika query sama seperti di exportExcel atau index
        $assetsQuery = Asset::query();
        if ($request->filled('category') && $request->input('category') !== 'Semua') {
            $assetsQuery->where('type', $request->input('category'));
        }
        $sortBy = $request->input('sort_by', 'id');
        if (in_array($sortBy, ['id', 'received_date', 'type', 'room_name'])) {
            $assetsQuery->orderBy($sortBy, 'asc');
        }
        $assets = $assetsQuery->get();

        // Memanggil view yang sudah kita buat dan menyusun PDF
        $pdf = Pdf::loadView('reports.assets-pdf', ['assets' => $assets])->setPaper('a4', 'landscape');
        return $pdf->download('laporan-aset-' . now()->format('Ymd') . '.pdf');
    }
}
