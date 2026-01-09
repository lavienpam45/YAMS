<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->decimal('current_book_value', 15, 2)->nullable()->after('purchase_price');
            $table->date('last_depreciation_date')->nullable()->after('current_book_value');
        });

        DB::table('assets')->update([
            'current_book_value' => DB::raw('COALESCE(current_book_value, purchase_price)'),
            'last_depreciation_date' => DB::raw('COALESCE(last_depreciation_date, received_date)'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropColumn(['current_book_value', 'last_depreciation_date']);
        });
    }
};
