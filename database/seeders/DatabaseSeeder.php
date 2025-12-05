<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asset;
use App\Models\Role;

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
    }
}
