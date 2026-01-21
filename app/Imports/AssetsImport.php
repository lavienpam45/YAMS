<?php

namespace App\Imports;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Facades\DB;

class AssetsImport implements ToCollection, WithHeadingRow
{
    use Importable;

    private int $imported = 0;
    private int $skipped = 0;
    private array $errors = [];

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +2 karena header di baris 1, data mulai baris 2

            try {
                // Skip jika nama barang kosong
                $namaBarang = $this->getValue($row, ['nama_barang', 'nama_barang_']);
                if (empty($namaBarang)) {
                    $this->skipped++;
                    continue;
                }

                // Parse data dari Excel
                $purchasePrice = $this->parseNumber($this->getValue($row, ['harga_beli', 'harga_beli_'])) ?? 0;
                $receivedDate = $this->parseDate($this->getValue($row, ['tgl_terima_yyyy-mm-dd', 'tgl_terima', 'tgl_terima_yyyy-mm-dd_']));
                $usefulLife = (int) ($this->parseNumber($this->getValue($row, ['umur_manfaat_tahun', 'umur_manfaat_tahun_'])) ?? 5);
                $salvageValue = $this->parseNumber($this->getValue($row, ['nilai_sisa', 'nilai_sisa_'])) ?? 0;
                $quantity = (int) ($this->parseNumber($this->getValue($row, ['jml', 'jml_'])) ?? 1);
                $customRate = $this->parseNumber($this->getValue($row, ['custom_rate', 'custom_rate_']));

                // Parse TIPE PERHITUNGAN (Penyusutan/Kenaikan) - kolom terpisah
                $tipePerhitunganRaw = $this->getValue($row, [
                    'tipe_perhitungan_penyusutankenaikan',
                    'tipe_perhitungan_penyusutankenaikan_',
                    'tipe_perhitungan',
                    'type_penyusutankenaikan', // backward compatibility
                    'type_penyusutankenaikan_',
                    'type'
                ]);
                $depreciationType = $this->parseDepreciationType($tipePerhitunganRaw);

                // Parse KATEGORI (Elektronik, Furniture, Tanah, dll) - kolom terpisah
                $kategori = $this->getValue($row, [
                    'kategori',
                    'kategori_',
                    'tipe',      // backward compatibility
                    'type'       // fallback ke type jika tidak ada kategori
                ]);

                // Generate kode otomatis
                $assetCode = $this->nextSequentialCode('asset_code', 'AKT');
                $unitCode = $this->nextSequentialCode('unit_code', 'SAT');

                // Hitung current_book_value berdasarkan umur aset
                $currentBookValue = $purchasePrice;
                if ($receivedDate && $purchasePrice > 0) {
                    $currentBookValue = $this->calculateInitialValue(
                        $purchasePrice,
                        $receivedDate,
                        $usefulLife,
                        $salvageValue,
                        $depreciationType,
                        $customRate
                    );
                }

                // Create asset
                Asset::create([
                    'name' => $namaBarang,
                    'room_name' => $this->getValue($row, ['nama_ruang']),
                    'location' => $this->getValue($row, ['lokasi']),
                    'floor' => $this->getValue($row, ['lantai']),
                    'asset_code' => $assetCode,
                    'unit_code' => $unitCode,
                    'received_date' => $receivedDate,
                    'purchase_price' => $purchasePrice,
                    'current_book_value' => $currentBookValue,
                    'last_depreciation_date' => null, // Biar scheduler bisa proses
                    'useful_life' => $usefulLife,
                    'salvage_value' => $salvageValue,
                    'depreciation_type' => $depreciationType,
                    'custom_depreciation_rate' => $customRate,
                    'type' => $kategori, // Kategori barang (Elektronik, Furniture, Tanah, dll)
                    'brand' => $this->getValue($row, ['merk']),
                    'serial_number' => $this->getValue($row, ['serial_number']),
                    'quantity' => $quantity,
                    'status' => $this->getValue($row, ['kondisi', 'kondisi_']) ?? 'Baik',
                    'description' => $this->getValue($row, ['keterangan']),
                    'user_assigned' => $this->getValue($row, ['pengguna']),
                    'inventory_status' => $this->getValue($row, ['status_inv', 'status_inv_']),
                ]);

                $this->imported++;

            } catch (\Exception $e) {
                $this->skipped++;
                $this->errors[] = "Baris {$rowNumber}: " . $e->getMessage();
            }
        }

        // Kirim notifikasi setelah import selesai
        if ($this->imported > 0) {
            NotificationService::notifyAdmins(
                'Import Aset Selesai',
                "Berhasil mengimpor {$this->imported} aset dari file Excel." .
                ($this->skipped > 0 ? " ({$this->skipped} baris dilewati)" : ""),
                'success',
                [
                    'imported' => $this->imported,
                    'skipped' => $this->skipped,
                    'errors' => $this->errors,
                ]
            );
        }
    }

    /**
     * Get value from row dengan multiple possible keys
     */
    private function getValue($row, array $keys): ?string
    {
        foreach ($keys as $key) {
            // Coba dengan key langsung
            if (isset($row[$key]) && $row[$key] !== null && $row[$key] !== '') {
                return trim((string) $row[$key]);
            }

            // Coba dengan lowercase dan replace spasi jadi underscore
            $normalizedKey = strtolower(str_replace([' ', '-', '(', ')', '*'], ['_', '_', '', '', ''], $key));
            if (isset($row[$normalizedKey]) && $row[$normalizedKey] !== null && $row[$normalizedKey] !== '') {
                return trim((string) $row[$normalizedKey]);
            }
        }
        return null;
    }

    /**
     * Parse number dari string (handle format Indonesia)
     */
    private function parseNumber($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }
        // Remove titik sebagai pemisah ribuan, ganti koma jadi titik
        $cleaned = str_replace(['.', ','], ['', '.'], (string) $value);
        $cleaned = preg_replace('/[^0-9.-]/', '', $cleaned);
        return is_numeric($cleaned) ? (float) $cleaned : null;
    }

    /**
     * Parse date dari berbagai format
     */
    private function parseDate($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Jika sudah format Y-m-d
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value;
        }

        // Jika Excel serial number
        if (is_numeric($value)) {
            try {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        // Coba parse dengan Carbon
        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Parse depreciation type dari Penyusutan/Kenaikan
     */
    private function parseDepreciationType(?string $value): string
    {
        if ($value === null) {
            return 'depreciation';
        }

        $lower = strtolower($value);
        if (str_contains($lower, 'kenaikan') || str_contains($lower, 'appreciation') || str_contains($lower, 'naik')) {
            return 'appreciation';
        }

        return 'depreciation';
    }

    /**
     * Generate sequential code
     */
    private function nextSequentialCode(string $column, string $prefix): string
    {
        $lastAsset = Asset::orderByRaw("CAST(SUBSTRING({$column}, 5) AS UNSIGNED) DESC")->first();

        if ($lastAsset && $lastAsset->{$column}) {
            $lastNumber = (int) substr($lastAsset->{$column}, strlen($prefix) + 1);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Hitung nilai awal berdasarkan umur aset
     */
    private function calculateInitialValue(
        float $purchasePrice,
        string $receivedDate,
        int $usefulLife,
        float $salvageValue,
        string $depreciationType,
        ?float $customRate
    ): float {
        $receivedDateCarbon = Carbon::parse($receivedDate)->startOfDay();
        $today = now()->startOfDay();
        $ageYears = $receivedDateCarbon->diffInDays($today) / 365.25;

        if ($ageYears <= 0) {
            return $purchasePrice;
        }

        $isAppreciating = $depreciationType === 'appreciation';
        $totalChange = null;

        if ($customRate !== null && $customRate > 0) {
            // Custom rate
            $totalChange = ($purchasePrice * $customRate / 100) * $ageYears;
        } else {
            // Gunakan formula dari database
            $formula = $isAppreciating
                ? DepreciationFormula::getActiveAppreciationFormula()
                : DepreciationFormula::getActiveDepreciationFormula();

            if ($formula) {
                $expression = str_replace(
                    ['{price}', '{salvage}', '{life}', '{age}'],
                    [$purchasePrice, $salvageValue, max(1, $usefulLife), $ageYears],
                    $formula->expression
                );

                try {
                    $result = eval("return {$expression};");
                    $formulaUsesAge = str_contains($formula->expression, '{age}');
                    $totalChange = $formulaUsesAge ? $result : ($result * $ageYears);
                } catch (\Throwable $e) {
                    $totalChange = null;
                }
            }
        }

        if ($totalChange === null) {
            return $purchasePrice;
        }

        $delta = abs($totalChange);

        if ($isAppreciating) {
            return round($purchasePrice + $delta, 2);
        } else {
            return round(max($salvageValue, $purchasePrice - $delta), 2);
        }
    }

    /**
     * Get import results
     */
    public function getResults(): array
    {
        return [
            'imported' => $this->imported,
            'skipped' => $this->skipped,
            'errors' => $this->errors,
        ];
    }
}
