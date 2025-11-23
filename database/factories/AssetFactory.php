<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AssetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true), // contoh: "Laptop Kantor Baru"
            'category' => $this->faker->randomElement(['Elektronik', 'Kendaraan', 'Perabotan', 'Software']),
            'purchase_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'purchase_price' => $this->faker->numberBetween(1000000, 50000000),
            'description' => $this->faker->sentence(),
            'location' => $this->faker->randomElement(['Kantor Pusat Lt. 5', 'Ruang Server', 'Gudang', 'Ruang Meeting A']),
            'status' => $this->faker->randomElement(['Baik', 'Rusak Ringan', 'Rusak Berat']),
        ];
    }
}
