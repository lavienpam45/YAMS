<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('depreciation_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->year('year');
            $table->decimal('book_value_start', 15, 2); // Nilai buku di awal tahun
            $table->decimal('depreciation_value', 15, 2); // Nilai penyusutan selama setahun
            $table->decimal('book_value_end', 15, 2); // Nilai buku di akhir tahun
            $table->timestamps();

            // Pastikan setiap aset hanya punya satu catatan per tahun untuk integritas data
            $table->unique(['asset_id', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depreciation_histories');
    }
};
