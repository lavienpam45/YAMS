<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('depreciation_formulas', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: "Garis Lurus", "Saldo Menurun"
            $table->text('expression'); // Rumus mentah, misal: ({price} - {salvage}) / {life}
            $table->boolean('is_active')->default(false); // Penanda rumus mana yang dipakai
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('depreciation_formulas');
    }
};