<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "SIMULASI STORE DENGAN PERHITUNGAN OTOMATIS\n";
echo "===========================================\n\n";

// Simulasi input dari form
$validatedData = [
    'name' => 'Aset Simulasi - Input 7 Jan 2026',
    'asset_code' => 'SIM-' . now()->format('YmdHis'),
    'unit_code' => 'UNIT-' . now()->format('YmdHis'),
    'received_date' => '2020-01-07', // 6 tahun lalu
    'purchase_price' => 10000000,
    'useful_life' => 5,
    'salvage_value' => 500000,
    'type' => 'Peralatan',
    'quantity' => 1,
    'status' => 'Aktif',
    'description' => 'Test scenario',
];

echo "Input Data:\n";
echo "- Name: {$validatedData['name']}\n";
echo "- Received Date: {$validatedData['received_date']}\n";
echo "- Purchase Price: Rp " . number_format($validatedData['purchase_price'], 0, ',', '.') . "\n";
echo "- Useful Life: {$validatedData['useful_life']} tahun\n";
echo "- Salvage Value: Rp " . number_format($validatedData['salvage_value'], 0, ',', '.') . "\n\n";

// Hitung current_book_value (simulasi dari AssetController.store)
$currentBookValue = $validatedData['purchase_price'];
$lastDepreciationDate = null;
$notificationMessage = null;

if (!empty($validatedData['received_date'])) {
    $receivedDate = \Carbon\Carbon::parse($validatedData['received_date'])->startOfDay();
    $today = now()->startOfDay();
    $ageYears = $receivedDate->diffInYears($today);

    echo "Perhitungan:\n";
    echo "- Age: {$ageYears} tahun\n";
    echo "- Received Date: {$receivedDate->toDateString()}\n";
    echo "- Today: {$today->toDateString()}\n\n";

    // Jika aset sudah lebih dari 1 tahun, hitung nilai sekarang
    if ($ageYears >= 1) {
        echo "✓ Aset sudah > 1 tahun, menghitung nilai saat ini...\n\n";

        // Tentukan tipe aset (appreciating atau depreciating)
        $type = strtolower($validatedData['type'] ?? '');
        $isAppreciating = str_contains($type, 'tanah') || str_contains($type, 'bangunan');

        echo "Is Appreciating: " . ($isAppreciating ? 'YES' : 'NO') . "\n";

        // Ambil rumus aktif
        $formula = $isAppreciating
            ? App\Models\DepreciationFormula::getActiveAppreciationFormula()
            : App\Models\DepreciationFormula::getActiveDepreciationFormula();

        if ($formula) {
            echo "Formula: {$formula->name}\n";
            echo "Expression: {$formula->expression}\n\n";

            // Evaluasi formula dengan variabel
            $expression = $formula->expression;
            $built = str_replace(
                ['{price}', '{salvage}', '{life}', '{age}'],
                [
                    $validatedData['purchase_price'],
                    $validatedData['salvage_value'],
                    max(1, $validatedData['useful_life']),
                    $ageYears
                ],
                $expression
            );

            echo "Evaluasi: {$built}\n";

            try {
                $annualChange = (float) eval("return {$built};");
                echo "Annual Change: Rp " . number_format($annualChange, 0, ',', '.') . "\n\n";

                if ($annualChange !== null) {
                    $delta = abs($annualChange);

                    if ($isAppreciating) {
                        $currentBookValue = $validatedData['purchase_price'] + $delta;
                    } else {
                        $floor = $validatedData['salvage_value'] ?? 0;
                        $currentBookValue = max($floor, $validatedData['purchase_price'] - $delta);
                    }

                    $currentBookValue = round($currentBookValue, 2);
                    $lastDepreciationDate = $receivedDate->toDateString();

                    // Siapkan message notifikasi
                    $notificationMessage = "Nilai aset '{$validatedData['name']}' telah dihitung berdasarkan umur {$ageYears} tahun. Nilai saat ini: " . number_format($currentBookValue, 0, ',', '.');
                }
            } catch (\Throwable $e) {
                echo "ERROR: " . $e->getMessage() . "\n";
            }
        }
    }
}

echo "\n";
echo "HASIL AKHIR:\n";
echo "============\n";
echo "Current Book Value: Rp " . number_format($currentBookValue, 0, ',', '.') . "\n";
echo "Last Depreciation Date: " . ($lastDepreciationDate ?? 'NULL') . "\n";
echo "\nNotifikasi yang dikirim:\n";
echo $notificationMessage . "\n";

// Sekarang buat aset dengan nilai yang sudah dihitung
echo "\n\nMembuat aset di database dengan nilai yang sudah dihitung...\n";

$asset = App\Models\Asset::create([
    'name' => $validatedData['name'],
    'asset_code' => $validatedData['asset_code'],
    'unit_code' => $validatedData['unit_code'],
    'received_date' => $validatedData['received_date'],
    'purchase_price' => $validatedData['purchase_price'],
    'useful_life' => $validatedData['useful_life'],
    'salvage_value' => $validatedData['salvage_value'],
    'type' => $validatedData['type'],
    'quantity' => $validatedData['quantity'],
    'status' => $validatedData['status'],
    'description' => $validatedData['description'],
    'current_book_value' => $currentBookValue,
    'last_depreciation_date' => $lastDepreciationDate,
]);

echo "✓ Aset dibuat dengan ID: {$asset->id}\n\n";

// Refresh dan tampilkan
$asset->refresh();
echo "Verifikasi data di database:\n";
echo "- Name: {$asset->name}\n";
echo "- Received Date: {$asset->received_date}\n";
echo "- Purchase Price: Rp " . number_format($asset->purchase_price, 0, ',', '.') . "\n";
echo "- Current Book Value: Rp " . number_format($asset->current_book_value, 0, ',', '.') . "\n";
echo "- Last Depreciation Date: {$asset->last_depreciation_date}\n";
