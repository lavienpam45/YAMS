<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // <-- IMPORT BARU

class Role extends Model
{
    use HasFactory;

    // Relasi sebaliknya ke model User
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
