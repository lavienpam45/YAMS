<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Align assets table columns to match the code expectations
        if (Schema::hasTable('assets')) {
            Schema::table('assets', function (Blueprint $table) {
                // Add missing columns (safe: only adds when absent)
                if (!Schema::hasColumn('assets', 'room_name')) {
                    $table->string('room_name')->nullable();
                }
                if (!Schema::hasColumn('assets', 'asset_code')) {
                    $table->string('asset_code')->nullable();
                }
                if (!Schema::hasColumn('assets', 'unit_code')) {
                    $table->string('unit_code')->nullable();
                }
                if (!Schema::hasColumn('assets', 'received_date')) {
                    $table->date('received_date')->nullable();
                }
                if (!Schema::hasColumn('assets', 'purchase_price')) {
                    $table->decimal('purchase_price', 15, 2)->default(0);
                }
                if (!Schema::hasColumn('assets', 'useful_life')) {
                    $table->integer('useful_life')->default(5);
                }
                if (!Schema::hasColumn('assets', 'salvage_value')) {
                    $table->decimal('salvage_value', 15, 2)->default(0);
                }
                if (!Schema::hasColumn('assets', 'type')) {
                    $table->string('type')->nullable();
                }
                if (!Schema::hasColumn('assets', 'brand')) {
                    $table->string('brand')->nullable();
                }
                if (!Schema::hasColumn('assets', 'serial_number')) {
                    $table->string('serial_number')->nullable();
                }
                if (!Schema::hasColumn('assets', 'quantity')) {
                    $table->integer('quantity')->default(1);
                }
                if (!Schema::hasColumn('assets', 'status')) {
                    $table->string('status')->default('Baik');
                }
                if (!Schema::hasColumn('assets', 'description')) {
                    $table->text('description')->nullable();
                }
                if (!Schema::hasColumn('assets', 'user_assigned')) {
                    $table->string('user_assigned')->nullable();
                }
                if (!Schema::hasColumn('assets', 'inventory_status')) {
                    $table->string('inventory_status')->nullable();
                }
                if (!Schema::hasColumn('assets', 'photo')) {
                    $table->string('photo')->nullable();
                }

                // Indexes (avoid errors by not changing existing indexes)
                // We'll add a normal index for asset_code if unique cannot be safely applied.
                if (!Schema::hasColumn('assets', 'asset_code')) {
                    // handled above; index will be created in a separate step below when column exists
                }
            });

            // Add index on asset_code if the column exists (safe duplicate prevention handled by name)
            if (Schema::hasColumn('assets', 'asset_code')) {
                try {
                    Schema::table('assets', function (Blueprint $table) {
                        $table->index('asset_code', 'assets_asset_code_index');
                    });
                } catch (\Throwable $e) {
                    // Ignore if index already exists or DB driver doesn't support named index creation
                }
            }
        }
    }

    public function down(): void
    {
        // Non-destructive: we won't drop columns in down to avoid data loss.
        // You can manually revert by restoring from backups if needed.
    }
};
