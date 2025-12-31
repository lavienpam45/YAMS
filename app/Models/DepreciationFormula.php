<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepreciationFormula extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'expression', 'is_active', 'description', 'type'];

    // Variabel yang diizinkan dalam rumus
    public static $allowedVariables = [
        '{price}' => 'Harga Beli',
        '{salvage}' => 'Nilai Sisa',
        '{life}' => 'Umur Manfaat (Tahun)',
        '{age}' => 'Umur Aset Saat Ini (Tahun)',
    ];

    public static function getActiveDepreciationFormula()
    {
        return self::where('is_active', true)->where('type', 'depreciation')->first();
    }

    public static function getActiveAppreciationFormula()
    {
        return self::where('is_active', true)->where('type', 'appreciation')->first();
    }
}
