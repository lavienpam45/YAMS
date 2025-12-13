<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
// PENTING: Import model Rumus yang sudah dibuat
use App\Models\DepreciationFormula; 

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'room_name', 'asset_code', 'unit_code', 'received_date',
        'purchase_price', 'useful_life', 'salvage_value', 'type', 'brand',
        'serial_number', 'quantity', 'status', 'description',
        'user_assigned', 'inventory_status', 'photo',
    ];

    protected $casts = [
        'purchase_price' => 'float',
        'salvage_value' => 'float',
        'useful_life' => 'integer',
        'received_date' => 'date:Y-m-d',
    ];

    protected $appends = [
        'asset_age_in_years',
        'annual_depreciation',
        'accumulated_depreciation',
        'book_value',
    ];

    public function depreciationHistories(): HasMany
    {
        return $this->hasMany(DepreciationHistory::class)->orderBy('year', 'desc');
    }

    // --- KALKULATOR OTOMATIS (LOGIKA BARU) ---

    // 1. Hitung Umur Aset
    protected function assetAgeInYears(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->received_date ? Carbon::parse($this->received_date)->diffInYears(Carbon::now()) : 0
        );
    }

    // 2. Hitung Penyusutan Tahunan (MENGGUNAKAN RUMUS DARI DATABASE)
    protected function annualDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                // A. Ambil rumus yang statusnya 'is_active' = true dari database
                $activeFormula = DepreciationFormula::where('is_active', true)->first();

                // B. Siapkan data aset ini
                $price = $this->purchase_price ?: 0;
                $salvage = $this->salvage_value ?: 0;
                $life = $this->useful_life ?: 1; // Hindari pembagian 0
                $age = $this->asset_age_in_years ?: 0;

                // C. Jika TIDAK ADA rumus aktif, kembalikan 0 (atau pakai default)
                if (!$activeFormula) {
                    return 0; 
                }

                // D. Ambil teks rumus, misal: "({price} - {salvage}) / {life}"
                $expression = $activeFormula->expression;

                // E. Ganti placeholder {kata} dengan angka asli
                $expression = str_replace(
                    ['{price}', '{salvage}', '{life}', '{age}'],
                    [$price, $salvage, $life, $age],
                    $expression
                );

                // F. Eksekusi matematika string tersebut
                try {
                    // Hati-hati: eval() mengeksekusi string sebagai kode PHP.
                    // Karena kita yang mengontrol input rumusnya di Admin panel, ini relatif aman.
                    return eval("return $expression;");
                } catch (\Throwable $e) {
                    // Jika rumus error (misal salah ketik), kembalikan 0 agar web tidak crash
                    return 0;
                }
            }
        );
    }

    // 3. Akumulasi (Otomatis mengikuti hasil annualDepreciation di atas)
    protected function accumulatedDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Perhatikan: fungsi ini memanggil annual_depreciation yang sudah dinamis
                $totalPossibleDepreciation = $this->asset_age_in_years * $this->annual_depreciation;
                
                $depreciableCost = $this->purchase_price - $this->salvage_value;

                // Pastikan akumulasi tidak melebihi harga beli (dikurangi residu)
                if ($depreciableCost < 0) return 0; // Guard clause
                
                return min($totalPossibleDepreciation, $depreciableCost);
            }
        );
    }

    // 4. Nilai Buku
    protected function bookValue(): Attribute
    {
        return Attribute::make(
            get: fn () => max(0, $this->purchase_price - $this->accumulated_depreciation)
        );
    }
}