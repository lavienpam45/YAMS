<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\DepreciationHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        // 5. Data untuk grafik trend bulanan (12 bulan terakhir)
        $trendData = $this->getMonthlyTrendData();

        // 6. Kirim SEMUA data (latestAssets, summaryData, chartData, trendData) ke frontend
        return Inertia::render('dashboard', [
            'latestAssets' => $latestAssets,
            'summaryData' => $summaryData,
            'chartData' => $chartData,
            'trendData' => $trendData,
        ]);
    }

    /**
     * Hitung data trend penyusutan dan apresiasi per tahun
     * Dari tahun aset tertua sampai tahun sekarang
     */
    private function getMonthlyTrendData(): array
    {
        $years = [];
        $depreciationData = [];
        $appreciationData = [];

        $currentYear = Carbon::now()->year;

        // Cari tahun aset tertua dari received_date
        $oldestAssetDate = Asset::whereNotNull('received_date')
            ->orderBy('received_date', 'asc')
            ->value('received_date');

        $startYear = $oldestAssetDate
            ? Carbon::parse($oldestAssetDate)->year
            : $currentYear - 5;

        // Loop dari tahun aset tertua sampai tahun sekarang
        for ($year = $startYear; $year <= $currentYear; $year++) {
            $years[] = (string) $year;

            // Cek apakah ada data historis untuk tahun ini
            $hasHistory = DepreciationHistory::where('year', $year)->exists();

            if ($hasHistory) {
                // Gunakan data dari depreciation_histories
                $depTotal = DepreciationHistory::join('assets', 'depreciation_histories.asset_id', '=', 'assets.id')
                    ->where('depreciation_histories.year', $year)
                    ->where('assets.depreciation_type', 'depreciation')
                    ->sum('depreciation_histories.book_value_end');

                $appTotal = DepreciationHistory::join('assets', 'depreciation_histories.asset_id', '=', 'assets.id')
                    ->where('depreciation_histories.year', $year)
                    ->where('assets.depreciation_type', 'appreciation')
                    ->sum('depreciation_histories.book_value_end');
            } else {
                // Hitung nilai buku berdasarkan aset yang sudah ada di tahun tersebut
                // Untuk aset depreciation: purchase_price - (tahun berlalu * penyusutan per tahun)
                $depTotal = 0;
                $appTotal = 0;

                // Aset depreciation yang sudah ada di tahun tersebut
                $depAssets = Asset::where('depreciation_type', 'depreciation')
                    ->whereNotNull('received_date')
                    ->whereYear('received_date', '<=', $year)
                    ->get();

                foreach ($depAssets as $asset) {
                    $assetYear = Carbon::parse($asset->received_date)->year;
                    $yearsElapsed = $year - $assetYear;

                    // Hitung penyusutan per tahun
                    $annualDepreciation = $asset->useful_life > 0
                        ? ($asset->purchase_price - $asset->salvage_value) / $asset->useful_life
                        : 0;

                    // Nilai buku = harga beli - (penyusutan per tahun * tahun berlalu)
                    $bookValue = $asset->purchase_price - ($annualDepreciation * $yearsElapsed);
                    $bookValue = max($bookValue, $asset->salvage_value); // Tidak kurang dari salvage value

                    $depTotal += $bookValue;
                }

                // Aset appreciation yang sudah ada di tahun tersebut
                $appAssets = Asset::where('depreciation_type', 'appreciation')
                    ->whereNotNull('received_date')
                    ->whereYear('received_date', '<=', $year)
                    ->get();

                foreach ($appAssets as $asset) {
                    $assetYear = Carbon::parse($asset->received_date)->year;
                    $yearsElapsed = $year - $assetYear;

                    // Untuk apresiasi, gunakan custom rate atau default 5%
                    $appreciationRate = $asset->custom_depreciation_rate
                        ? $asset->custom_depreciation_rate / 100
                        : 0.05;

                    // Nilai buku = harga beli * (1 + rate)^tahun
                    $bookValue = $asset->purchase_price * pow(1 + $appreciationRate, $yearsElapsed);

                    $appTotal += $bookValue;
                }
            }

            $depreciationData[] = round(abs($depTotal) / 1000000, 2); // Per juta
            $appreciationData[] = round(abs($appTotal) / 1000000, 2); // Per juta
        }

        return [
            'labels' => $years,
            'depreciation' => $depreciationData,
            'appreciation' => $appreciationData,
        ];
    }
}
