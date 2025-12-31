<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('depreciation_formulas', function (Blueprint $table) {
            $table->enum('type', ['depreciation', 'appreciation'])->default('depreciation')->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('depreciation_formulas', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
