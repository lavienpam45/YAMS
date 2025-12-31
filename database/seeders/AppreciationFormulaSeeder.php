<?php

namespace Database\Seeders;

use App\Models\DepreciationFormula;
use Illuminate\Database\Seeder;

class AppreciationFormulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample appreciation formula (5% annual appreciation)
        DepreciationFormula::create([
            'name' => 'Apresiasi Linear 5%',
            'expression' => '{price} * (1 + 0.05 * {age})',
            'description' => 'Rumus apresiasi linear dengan kenaikan 5% per tahun untuk tanah dan bangunan',
            'type' => 'appreciation',
            'is_active' => true,
        ]);

        // Create sample depreciation formula if not exists
        $depreciationExists = DepreciationFormula::where('type', 'depreciation')->exists();
        if (!$depreciationExists) {
            DepreciationFormula::create([
                'name' => 'Garis Lurus',
                'expression' => '({price} - {salvage}) / {life}',
                'description' => 'Rumus penyusutan garis lurus standar',
                'type' => 'depreciation',
                'is_active' => true,
            ]);
        }
    }
}
