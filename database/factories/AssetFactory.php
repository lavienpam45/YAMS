<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'room_name' => $this->faker->randomElement(['Gudang', 'Lobi Utama', 'Ruang Server', 'Ruang FOTO', 'Ruang Tunggu PMB']),
            'asset_code' => 'AKT-' . $this->faker->unique()->numberBetween(100, 999),
            'unit_code' => 'SAT-' . $this->faker->unique()->numberBetween(100, 999),

            // === PERBAIKAN UTAMA DI SINI ===
            // 'received_date' => $this->faker->date(), // INI VERSI LAMA (tanggal terlalu acak)
            'received_date' => $this->faker->dateTimeBetween('-2 years', 'now'), // VERSI BARU (hanya 2 tahun terakhir)
            // ===============================

            'purchase_price' => $this->faker->numberBetween(5000000, 150000000),
            'useful_life' => $this->faker->randomElement([3, 5, 8, 10]),
            'salvage_value' => 0,
            'type' => $this->faker->randomElement(['Furniture', 'Kendaraan', 'Mesin', 'Elektronik']),
            'brand' => $this->faker->randomElement(['LG', 'Panasonic', 'Sony', 'Dell', 'HP', 'Epson', 'Honda']),
            'serial_number' => 'SN-' . $this->faker->unique()->ean8(),
            'quantity' => $this->faker->numberBetween(1, 5),
            'status' => $this->faker->randomElement(['Baik', 'Rusak Ringan', 'Rusak Berat']),
            'description' => $this->faker->boolean(25) ? 'Perlu maintenance rutin' : null,
            'user_assigned' => $this->faker->randomElement(['Umum', 'Staff 3', 'Staff 6', 'Security']),
            'inventory_status' => 'Tercatat',
            'photo' => null,
        ];
    }
}
