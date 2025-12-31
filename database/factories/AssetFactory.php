<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Simple sequential counters for codes during a seeding run.
     */
    protected static int $assetSeq = 1;
    protected static int $unitSeq = 1;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $assetCode = 'AKT-' . str_pad(self::$assetSeq++, 3, '0', STR_PAD_LEFT);
        $unitCode = 'SAT-' . str_pad(self::$unitSeq++, 3, '0', STR_PAD_LEFT);

        // Pastikan ada aset apresiasi (Tanah/Bangunan) dan depresiasi lain
        $type = $this->faker->randomElement(['Bangunan', 'Elektronik', 'Furniture', 'Kendaraan', 'Tanah', 'Lainnya']);

        return [
            'name' => $this->faker->words(3, true),
            'room_name' => $this->faker->randomElement(['Gudang', 'Lobi Utama', 'Ruang Server', 'Ruang FOTO', 'Ruang Tunggu PMB']),
            'asset_code' => $assetCode,
            'unit_code' => $unitCode,

            // === PERBAIKAN UTAMA DI SINI ===
            // 'received_date' => $this->faker->date(), // INI VERSI LAMA (tanggal terlalu acak)
            'received_date' => $this->faker->dateTimeBetween('-2 years', 'now'), // VERSI BARU (hanya 2 tahun terakhir)
            // ===============================

            'purchase_price' => $this->faker->numberBetween(5000000, 150000000),
            'useful_life' => $this->faker->randomElement([3, 5, 8, 10]),
            'salvage_value' => 0,
            'type' => $type,
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

    /**
     * State untuk aset dengan kategori apresiasi (Tanah/Bangunan).
     */
    public function appreciating(): self
    {
        return $this->state(function () {
            return [
                'type' => $this->faker->randomElement(['Tanah', 'Bangunan']),
            ];
        });
    }

    /**
     * State untuk aset dengan kategori depresiasi (bukan tanah/bangunan).
     */
    public function depreciating(): self
    {
        return $this->state(function () {
            return [
                'type' => $this->faker->randomElement(['Elektronik', 'Furniture', 'Kendaraan', 'Lainnya']),
            ];
        });
    }
}
