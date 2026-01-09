<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class DepreciationHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'year',
        'book_value_start',
        'depreciation_value',
        'book_value_end',
    ];

    protected $casts = [
        'book_value_start' => 'float',
        'depreciation_value' => 'float',
        'book_value_end' => 'float',
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
