<?php

namespace App\Imports;

use App\Models\Asset;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;

class AssetsImport implements ToCollection, WithHeadingRow, WithValidation
{
    use Importable;

    /**
    * @param Collection $rows
    */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row)
        {
            // Pastikan baris memiliki data penting sebelum membuat aset
            if (!isset($row['nama_barang'])) {
                continue; // Lompati baris jika tidak ada nama barang
            }

            $purchasePrice = $row['harga_beli'] ?? 0;
            $receivedDate = $row['tanggal_terima'];

            Asset::create([
                'name'             => $row['nama_barang'],
                'room_name'        => $row['nama_ruang'],
                'asset_code'       => $row['kode_aktiva'],
                'unit_code'        => $row['kode_satuan'],

                // Menggunakan key 'tanggal_terima' yang benar
                'received_date'    => $receivedDate,

                'purchase_price'   => $purchasePrice, // Default 0 jika tidak ada
                'current_book_value' => $purchasePrice,
                'last_depreciation_date' => $receivedDate,
                'useful_life'      => $row['masa_manfaat_tahun'] ?? 5, // Default 5 jika tidak ada
                'salvage_value'    => $row['nilai_sisa'] ?? 0, // Default 0 jika tidak ada

                'type'             => $row['tipe'], // Menggunakan key 'tipe'
                'brand'            => $row['merk'],
                'serial_number'    => $row['serial_number'],

                'quantity'         => $row['jumlah'], // Menggunakan key 'jumlah'
                'status'           => $row['kondisi'], // Menggunakan key 'kondisi'

                'description'      => $row['keterangan'],
                'user_assigned'    => $row['pengguna'],
                'inventory_status' => $row['status_inventaris'], // Menggunakan key 'status_inventaris'
            ]);
        }
    }

    public function rules(): array
    {
        // Sesuaikan nama key di aturan validasi
        return [
             '*.nama_barang' => 'required|string',
             '*.harga_beli' => 'required|numeric',
             '*.masa_manfaat_tahun' => 'required|integer',
             '*.tanggal_terima' => 'required',
             '*.jumlah' => 'required|integer',
             '*.kondisi' => 'required|string',
        ];
    }
}
