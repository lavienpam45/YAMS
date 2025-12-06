<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    use HasFactory;

    // Properti $fillable (sudah lengkap dari langkah sebelumnya)
    protected $fillable = [
        'name', 'room_name', 'asset_code', 'unit_code', 'received_date',
        'purchase_price', 'useful_life', 'salvage_value', 'type', 'brand',
        'serial_number', 'quantity', 'status', 'description',
        'user_assigned', 'inventory_status', 'photo',
    ];

    // Properti $casts untuk tipe data
    protected $casts = [
        'purchase_price' => 'float',
        'salvage_value' => 'float',
        'useful_life' => 'integer',
        'received_date' => 'date:Y-m-d',
    ];

    /**
     * LANGKAH PENTING #1: Memberitahu Laravel untuk selalu menyertakan atribut virtual ini
     * saat data dikirim ke frontend.
     */
    protected $appends = [
        'asset_age_in_years',
        'annual_depreciation',
        'accumulated_depreciation',
        'book_value',
    ];

    // --- FUNGSI BARU UNTUK RELASI ---
    /**
     * Mendefinisikan bahwa satu Aset memiliki banyak Catatan Riwayat Penyusutan.
     */
    public function depreciationHistories(): HasMany
    {
        return $this->hasMany(DepreciationHistory::class)->orderBy('year', 'desc');
    }
    // --- AKHIR DARI FUNGSI BARU ---

    /**
     * LANGKAH PENTING #2: Fungsi Kalkulator Otomatis (Accessors).
     */

    // Kalkulator: Umur Aset dalam Tahun
    protected function assetAgeInYears(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->received_date ? Carbon::parse($this->received_date)->diffInYears(Carbon::now()) : 0
        );
    }

    // Kalkulator: Penyusutan Tahunan (Metode Garis Lurus)
    protected function annualDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                $depreciableCost = $this->purchase_price - $this->salvage_value;
                return $this->useful_life > 0 ? ($depreciableCost / $this->useful_life) : 0;
            }
        );
    }

    // Kalkulator: Akumulasi Penyusutan hingga saat ini
    protected function accumulatedDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                $totalPossibleDepreciation = $this->asset_age_in_years * $this->annual_depreciation;
                $depreciableCost = $this->purchase_price - $this->salvage_value;

                // Pastikan total penyusutan tidak lebih besar dari nilai yang bisa disusutkan
                return min($totalPossibleDepreciation, $depreciableCost);
            }
        );
    }

    // Kalkulator: Nilai Buku Terkini
    protected function bookValue(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->purchase_price - $this->accumulated_depreciation
        );
    }
}
