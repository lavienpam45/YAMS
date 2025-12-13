<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepreciationFormula extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'expression', 'is_active', 'description'];

    // Variabel yang diizinkan dalam rumus
    public static $allowedVariables = [
        '{price}' => 'Harga Beli',
        '{salvage}' => 'Nilai Sisa',
        '{life}' => 'Umur Manfaat (Tahun)',
        '{age}' => 'Umur Aset Saat Ini (Tahun)',
    ];
}