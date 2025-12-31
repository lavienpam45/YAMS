<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asset;
use App\Models\Role;
use App\Models\DepreciationFormula;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AppreciationFormulaSeeder::class,
        ]);

        // Buat atau temukan user Super Admin
        $superAdminUser = User::firstOrCreate(
            ['email' => 'superadmin@yams.test'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password123'),
            ]
        );

        // Cari 'role' superadmin (yang memiliki ID 1)
        $superAdminRole = Role::find(1);

        // --- PERBAIKAN LOGIKA DI SINI ---
        // 'syncWithoutDetaching' akan melampirkan peran HANYA JIKA belum ada.
        // Ini adalah cara yang aman dan mencegah duplikasi.
        if ($superAdminUser && $superAdminRole) {
            $superAdminUser->roles()->syncWithoutDetaching($superAdminRole->id);
        }

        // Reset tabel aset agar ID mulai dari 1 kembali
        Schema::disableForeignKeyConstraints();
        Asset::truncate();
        Schema::enableForeignKeyConstraints();

        // Seed campuran aset depresiasi dan apresiasi
        Asset::factory()->count(12)->depreciating()->create();
        Asset::factory()->count(13)->appreciating()->create();

        // Pastikan ada rumus penyusutan default yang aktif
        // Aktifkan satu-satunya rumus "Garis Lurus" jika belum ada
        // Expression: (price - salvage) / life
        // Catatan: placeholder yang diizinkan ada di DepreciationFormula::$allowedVariables
        // Kita non-aktifkan semua rumus lama terlebih dahulu untuk konsistensi
        DepreciationFormula::query()->update(['is_active' => false]);

        DepreciationFormula::firstOrCreate(
            ['name' => 'Garis Lurus', 'type' => 'depreciation'],
            [
                'expression' => '({price} - {salvage}) / {life}',
                'description' => 'Rumus penyusutan garis lurus standar',
                'is_active' => true,
            ]
        )->update(['is_active' => true]);
    }
}
