<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // <-- IMPORT BARU DAN PENTING

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // === PERBAIKAN UTAMA DI SINI ===
        // 1. Matikan pemeriksaan Foreign Key sementara
        Schema::disableForeignKeyConstraints();

        // 2. Kosongkan tabel roles DAN tabel penghubungnya, role_user
        DB::table('roles')->truncate();
        DB::table('role_user')->truncate(); // Pastikan tabel penghubung juga bersih

        // 3. Aktifkan kembali pemeriksaan Foreign Key
        Schema::enableForeignKeyConstraints();
        // === AKHIR DARI PERBAIKAN ===


        // Masukkan data peran (roles) yang kita butuhkan
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'superadmin', 'label' => 'Super Administrator'],
            ['id' => 2, 'name' => 'admin', 'label' => 'Administrator'],
            ['id' => 3, 'name' => 'user', 'label' => 'User'],
        ]);
    }
}
