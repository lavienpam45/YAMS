<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\FromArray;

class AssetsTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
    /**
     * Return array dengan contoh data
     */
    public function array(): array
    {
        return [
            // Baris 1: Contoh data Penyusutan
            [
                'Ruang IT',                 // NAMA RUANG
                'Gedung A',                 // LOKASI
                '3',                        // LANTAI
                '',                         // KODE AKTIVA (auto-generate, boleh kosong)
                '',                         // KODE SATUAN (auto-generate, boleh kosong)
                'Laptop Dell Latitude 5420',// NAMA BARANG *
                '2023-01-15',              // TGL TERIMA *
                15000000,                   // HARGA BELI *
                'Penyusutan',               // TIPE PERHITUNGAN (Penyusutan/Kenaikan) *
                'Elektronik',               // KATEGORI
                5,                          // UMUR MANFAAT (TAHUN) *
                500000,                     // NILAI SISA *
                '',                         // CUSTOM RATE (%) - kosongkan jika pakai formula
                'Dell',                     // MERK
                'DL2023001',               // SERIAL NUMBER
                1,                          // JML *
                'Baik',                     // KONDISI *
                'Laptop untuk staff IT',    // KETERANGAN
                'Ahmad Hidayat',            // PENGGUNA
                'Tercatat',                 // STATUS INV.
            ],
            // Baris 2: Contoh data Kenaikan (Tanah/Bangunan)
            [
                '',
                'Kampus Utama',
                '',
                '',
                '',
                'Tanah Kampus',
                '2020-05-10',
                5000000000,
                'Kenaikan',
                'Tanah',
                99,
                4500000000,
                '5',                        // Custom rate 5% per tahun
                '',
                '',
                1,
                'Baik',
                'Tanah seluas 2 hektar',
                '',
                'Terdaftar',
            ],
            // Baris 3: Contoh data Penyusutan - Furniture
            [
                'Ruang Icikiwir',
                'Universitas Yarsi',
                'Lantai 3',
                '',
                '',
                'Meja Kerja Kayu',
                '2024-06-20',
                2500000,
                'Penyusutan',
                'Furniture',
                10,
                100000,
                '',
                'IKEA',
                'DESK-001',
                5,
                'Baik',
                'Meja kerja kayu jati',
                'Staff Umum',
                'Aktif',
            ],
        ];
    }

    /**
     * Header kolom sesuai dengan tabel YAMS
     */
    public function headings(): array
    {
        return [
            'NAMA RUANG',
            'LOKASI',
            'LANTAI',
            'KODE AKTIVA',
            'KODE SATUAN',
            'NAMA BARANG *',
            'TGL TERIMA (YYYY-MM-DD) *',
            'HARGA BELI *',
            'TIPE PERHITUNGAN (Penyusutan/Kenaikan) *',
            'KATEGORI',
            'UMUR MANFAAT (TAHUN) *',
            'NILAI SISA *',
            'CUSTOM RATE (%)',
            'MERK',
            'SERIAL NUMBER',
            'JML *',
            'KONDISI *',
            'KETERANGAN',
            'PENGGUNA',
            'STATUS INV.',
        ];
    }

    /**
     * Styling untuk header dan sheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Header row styling
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 11,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '0C7E46'], // Green YARSI
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    /**
     * Set column widths
     */
    public function columnWidths(): array
    {
        return [
            'A' => 18,  // NAMA RUANG
            'B' => 20,  // LOKASI
            'C' => 12,  // LANTAI
            'D' => 15,  // KODE AKTIVA
            'E' => 15,  // KODE SATUAN
            'F' => 30,  // NAMA BARANG
            'G' => 22,  // TGL TERIMA
            'H' => 18,  // HARGA BELI
            'I' => 25,  // TYPE
            'J' => 22,  // UMUR MANFAAT
            'K' => 15,  // NILAI SISA
            'L' => 18,  // CUSTOM RATE
            'M' => 15,  // MERK
            'N' => 18,  // SERIAL NUMBER
            'O' => 8,   // JML
            'P' => 15,  // KONDISI
            'Q' => 30,  // KETERANGAN
            'R' => 18,  // PENGGUNA
            'S' => 15,  // STATUS INV.
        ];
    }
}
