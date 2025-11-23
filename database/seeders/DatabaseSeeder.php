<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // <-- Pastikan ini ada
use App\Models\Asset; // <-- TAMBAHKAN IMPORT INI

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil Factory Asset untuk membuat 15 data palsu.
        Asset::factory(15)->create();

        // Kode di bawah ini adalah default dari starter kit untuk membuat satu user
        // Jika Anda sudah punya user dari halaman registrasi, Anda bisa memberikan komentar pada bagian ini
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

         // Atau Anda bisa menggunakan User::firstOrCreate untuk memastikan hanya ada satu admin
         User::firstOrCreate(
            ['email' => 'superadmin@yams.test'], // Kunci untuk mencari
            [ // Data yang akan dibuat jika tidak ditemukan
                'name' => 'Super Admin',
                'password' => bcrypt('password123'),
            ]
        );
    }
}
