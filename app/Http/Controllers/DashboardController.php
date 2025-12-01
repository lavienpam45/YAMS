<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Ambil data untuk tabel aset terbaru (tidak berubah)
        $latestAssets = Asset::latest()->paginate(5);

        // 2. Hitung data untuk kartu ringkasan
        $totalAssets = Asset::count();
        $totalPurchaseValue = Asset::sum('purchase_price');

        // (Kita akan tambahkan logika penyusutan nyata di sini nanti)
        // Sementara kita hitung manual untuk contoh. Di langkah berikutnya akan otomatis.
        $assetsForDepreciation = Asset::all();
        $totalDepreciation = 0;
        foreach ($assetsForDepreciation as $asset) {
            $totalDepreciation += $asset->accumulated_depreciation;
        }
        $currentBookValue = $totalPurchaseValue - $totalDepreciation;

        $summaryData = [
            'total_assets' => $totalAssets,
            'total_purchase_value' => $totalPurchaseValue,
            'total_depreciation' => $totalDepreciation,
            'current_book_value' => $currentBookValue,
        ];

        // --- PERBAIKAN UTAMA DI SINI ---
        // 3. Hitung jumlah aset per TIPE, bukan per KATEGORI
        $assetsByType = Asset::query()
            ->select('type', DB::raw('count(*) as total')) // <-- 'category' diganti 'type'
            ->groupBy('type') // <-- 'category' diganti 'type'
            ->pluck('total', 'type');

        // 4. Hitung jumlah aset per lokasi (Nama Ruang)
        $assetsByLocation = Asset::query()
            ->select('room_name', DB::raw('count(*) as total'))
            ->groupBy('room_name')
            ->pluck('total', 'room_name');

        $chartData = [
            'by_category' => $assetsByType, // Biarkan nama prop 'by_category' agar frontend tidak perlu diubah
            'by_location' => $assetsByLocation,
        ];

        // 5. Kirim SEMUA data (latestAssets, summaryData, chartData) ke frontend
        return Inertia::render('dashboard', [
            'latestAssets' => $latestAssets,
            'summaryData' => $summaryData,
            'chartData' => $chartData,
        ]);
    }
}
