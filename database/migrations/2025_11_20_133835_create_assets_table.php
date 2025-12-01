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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('room_name')->nullable();
            $table->string('asset_code')->unique()->nullable();
            $table->string('unit_code')->nullable();
            $table->date('received_date')->nullable();
            $table->decimal('purchase_price', 15, 2)->default(0);

            // Kolom Penyusutan sudah dimasukkan di sini
            $table->integer('useful_life')->default(5);
            $table->decimal('salvage_value', 15, 2)->default(0);

            $table->string('type')->nullable();
            $table->string('brand')->nullable();
            $table->string('serial_number')->nullable();
            $table->integer('quantity')->default(1);
            $table->string('status');
            $table->text('description')->nullable();
            $table->string('user_assigned')->nullable();
            $table->string('inventory_status')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
