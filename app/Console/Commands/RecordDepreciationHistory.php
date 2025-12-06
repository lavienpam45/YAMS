<?php

namespace App\Console\Commands;

use App\Models\Asset;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecordDepreciationHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assets:record-history';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghitung dan mencatat riwayat penyusutan untuk semua aset untuk tahun berjalan.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai proses pencatatan riwayat penyusutan...');

        $currentYear = Carbon::now()->year;
        $assets = Asset::all();

        if ($assets->isEmpty()) {
            $this->warn('Tidak ada aset yang ditemukan untuk diproses.');
            return 0;
        }

        foreach ($assets as $asset) {
            $historyExists = DB::table('depreciation_histories')
                ->where('asset_id', $asset->id)
                ->where('year', $currentYear)
                ->exists();

            if ($historyExists) {
                $this->line(" - Riwayat untuk Aset #{$asset->id} ({$asset->name}) tahun {$currentYear} sudah ada, dilewati.");
                continue;
            }

            // Logika untuk menangani nilai null dari tanggal
            if (!$asset->received_date) {
                $this->warn(" ! Aset #{$asset->id} ({$asset->name}) tidak memiliki tanggal terima, dilewati.");
                continue;
            }

            $bookValueNow = $asset->book_value;
            $annualDepreciation = $asset->annual_depreciation;
            $bookValueStartOfYear = $bookValueNow + $annualDepreciation;
            $depreciationThisYear = $asset->asset_age_in_years > 0 ? $annualDepreciation : 0;

            DB::table('depreciation_histories')->insert([
                'asset_id' => $asset->id,
                'year' => $currentYear,
                'book_value_start' => $bookValueStartOfYear,
                'depreciation_value' => $depreciationThisYear,
                'book_value_end' => $bookValueNow,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->info(" + Riwayat untuk Aset #{$asset->id} ({$asset->name}) tahun {$currentYear} berhasil dicatat.");
        }

        $this->info('Proses selesai.');
        return 0;
    }
}
