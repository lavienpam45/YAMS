<?php

namespace App\Exports;

use App\Models\Asset;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AssetsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Asset::all();
    }

    /**
     * Mendefinisikan judul kolom di file Excel.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nama Barang',
            'Nama Ruang',
            'Kode Aktiva',
            'Kode Satuan',
            'Tanggal Terima',
            'Harga Beli',
            'Masa Manfaat (Tahun)',
            'Nilai Sisa',
            'Akumulasi Penyusutan',
            'Harga Saat Ini',
            'Tipe',
            'Merk',
            'Serial Number',
            'Jumlah',
            'Kondisi',
            'Keterangan',
            'Pengguna',
            'Status Inventaris',
        ];
    }

    /**
     * Memetakan data dari setiap model Asset ke dalam baris Excel.
     * @param mixed $asset
     * @return array
     */
    public function map($asset): array
    {
        // Pastikan kita memanggil atribut virtual/kalkulasi yang ada di Model
        return [
            $asset->id,
            $asset->name,
            $asset->room_name,
            $asset->asset_code,
            $asset->unit_code,
            $asset->received_date,
            $asset->purchase_price,
            $asset->useful_life,
            $asset->salvage_value,
            $asset->accumulated_depreciation, // Dari accessor
            $asset->book_value, // Dari accessor
            $asset->type,
            $asset->brand,
            $asset->serial_number,
            $asset->quantity,
            $asset->status,
            $asset->description,
            $asset->user_assigned,
            $asset->inventory_status,
        ];
    }
}
