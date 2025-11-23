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
        $table->string('name'); // <-- Diperbaiki
        $table->string('category'); // <-- Diperbaiki
        $table->date('purchase_date'); // <-- Diperbaiki
        $table->decimal('purchase_price', 15, 2); // <-- Diperbaiki
        $table->text('description')->nullable();
        $table->string('location'); // <-- Diperbaiki
        $table->string('status');
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
