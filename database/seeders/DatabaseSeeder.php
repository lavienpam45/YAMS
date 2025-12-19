<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asset;
use App\Models\Role;
use App\Models\DepreciationFormula;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class
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

        // Hapus aset lama (jika ada) dan buat yang baru.
        // Ini memastikan data aset selalu konsisten setiap kali seeding.
        Asset::query()->delete();
        Asset::factory(25)->create(); // Kita buat lebih banyak untuk mengetes paginasi nanti

        // Pastikan ada rumus penyusutan default yang aktif
        // Aktifkan satu-satunya rumus "Garis Lurus" jika belum ada
        // Expression: (price - salvage) / life
        // Catatan: placeholder yang diizinkan ada di DepreciationFormula::$allowedVariables
        // Kita non-aktifkan semua rumus lama terlebih dahulu untuk konsistensi
        DepreciationFormula::query()->update(['is_active' => false]);

        DepreciationFormula::firstOrCreate(
            ['name' => 'Garis Lurus'],
            [
                'expression' => '({price} - {salvage}) / {life}',
                'description' => 'Rumus penyusutan garis lurus standar',
                'is_active' => true,
            ]
        )->update(['is_active' => true]);
    }
}
