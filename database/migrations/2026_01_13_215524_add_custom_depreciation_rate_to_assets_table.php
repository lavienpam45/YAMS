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
        Schema::table('assets', function (Blueprint $table) {
            // Tambahkan kolom untuk custom depreciation/appreciation rate (dalam persen)
            // Nullable karena user bisa pilih pakai formula atau custom rate
            $table->decimal('custom_depreciation_rate', 5, 2)->nullable()->after('depreciation_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropColumn('custom_depreciation_rate');
        });
    }
};
