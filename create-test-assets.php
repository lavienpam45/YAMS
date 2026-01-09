<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "MEMBUAT 2 DATA ASET TEST (PENYUSUTAN & KENAIKAN)\n";
echo "==============================================\n\n";

$today = now()->toDateString();
$receivedDate = '2025-01-08';
$purchasePrice = 150000000; // Rp 150 juta

echo "Hari ini: {$today}\n";
echo "Received Date: {$receivedDate} (tepat 1 tahun besok!)\n";
echo "Purchase Price: Rp " . number_format($purchasePrice, 0, ',', '.') . "\n\n";

// ========== ASET 1: PENYUSUTAN (Depreciation) ==========
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "ASET 1: PENYUSUTAN (Depreciation)\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$asset1 = App\Models\Asset::create([
    'name' => 'Komputer Desktop Premium',
    'asset_code' => 'COMP-001-' . now()->format('YmdHis'),
    'unit_code' => 'UNIT-001-' . now()->format('YmdHis'),
    'received_date' => $receivedDate,
    'purchase_price' => $purchasePrice,
    'useful_life' => 5,
    'salvage_value' => 10000000, // Rp 10 juta
    'type' => 'Elektronik',
    'brand' => 'Dell',
    'serial_number' => 'DL2025-' . uniqid(),
    'quantity' => 1,
    'status' => 'Aktif',
    'description' => 'Aset test untuk membuktikan depreciation otomatis',
    'current_book_value' => $purchasePrice,
    'last_depreciation_date' => null,
]);

echo "✓ Aset 1 berhasil dibuat\n";
echo "ID: {$asset1->id}\n";
echo "Name: {$asset1->name}\n";
echo "Type: {$asset1->type} (Elektronik = DEPRECIATION)\n";
echo "Received Date: {$asset1->received_date}\n";
echo "Purchase Price: Rp " . number_format($asset1->purchase_price, 0, ',', '.') . "\n";
echo "Useful Life: {$asset1->useful_life} tahun\n";
echo "Salvage Value: Rp " . number_format($asset1->salvage_value, 0, ',', '.') . "\n";
echo "Current Book Value: Rp " . number_format($asset1->current_book_value, 0, ',', '.') . "\n";
echo "Last Depreciation Date: " . ($asset1->last_depreciation_date ?? 'NULL') . "\n\n";

// Hitung perkiraan nilai besok
$receiveDateCarbon = \Carbon\Carbon::parse($receivedDate)->startOfDay();
$todayCarbon = now()->startOfDay();
$tomorrowCarbon = $todayCarbon->copy()->addDay();

$ageToday = $receiveDateCarbon->diffInDays($todayCarbon) / 365.25;
$ageTomorrow = $receiveDateCarbon->diffInDays($tomorrowCarbon) / 365.25;

$annualDepreciation = ($purchasePrice - $asset1->salvage_value) / $asset1->useful_life;
$valueToday = $purchasePrice - ($annualDepreciation * $ageToday);
$valueTomorrow = $purchasePrice - ($annualDepreciation * $ageTomorrow);

echo "💡 Perkiraan Perhitungan (Pro-Rata):\n";
echo "   Age hari ini: {$ageToday} tahun\n";
echo "   Value hari ini: Rp " . number_format($valueToday, 0, ',', '.') . "\n";
echo "   Age besok: {$ageTomorrow} tahun\n";
echo "   Value besok: Rp " . number_format($valueTomorrow, 0, ',', '.') . "\n";
echo "   Perubahan: Rp " . number_format($valueTomorrow - $valueToday, 0, ',', '.') . "\n\n";

// ========== ASET 2: KENAIKAN (Appreciation) ==========
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "ASET 2: KENAIKAN (Appreciation)\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$asset2 = App\Models\Asset::create([
    'name' => 'Tanah Strategis Pusat Kota',
    'asset_code' => 'LAND-001-' . now()->format('YmdHis'),
    'unit_code' => 'UNIT-002-' . now()->format('YmdHis'),
    'received_date' => $receivedDate,
    'purchase_price' => $purchasePrice,
    'useful_life' => 20, // Tanah tidak punya useful life, tapi kita set 20 untuk formula
    'salvage_value' => $purchasePrice, // Tanah tidak berkurang, salvage = purchase_price
    'type' => 'Tanah', // Type dengan "Tanah" = APPRECIATION
    'brand' => 'Developer ABC',
    'serial_number' => 'LAND2025-' . uniqid(),
    'quantity' => 1,
    'status' => 'Aktif',
    'description' => 'Aset test untuk membuktikan appreciation otomatis',
    'current_book_value' => $purchasePrice,
    'last_depreciation_date' => null,
]);

echo "✓ Aset 2 berhasil dibuat\n";
echo "ID: {$asset2->id}\n";
echo "Name: {$asset2->name}\n";
echo "Type: {$asset2->type} (Tanah = APPRECIATION)\n";
echo "Received Date: {$asset2->received_date}\n";
echo "Purchase Price: Rp " . number_format($asset2->purchase_price, 0, ',', '.') . "\n";
echo "Useful Life: {$asset2->useful_life} tahun\n";
echo "Salvage Value: Rp " . number_format($asset2->salvage_value, 0, ',', '.') . "\n";
echo "Current Book Value: Rp " . number_format($asset2->current_book_value, 0, ',', '.') . "\n";
echo "Last Depreciation Date: " . ($asset2->last_depreciation_date ?? 'NULL') . "\n\n";

// Cek formula appreciation
$appreciationFormula = App\Models\DepreciationFormula::getActiveAppreciationFormula();
echo "Formula Appreciation: {$appreciationFormula->name}\n";
echo "Expression: {$appreciationFormula->expression}\n\n";

// Hitung perkiraan nilai besok dengan appreciation formula
// Formula: {price} * (1 + 0.05 * {age})
$expression = $appreciationFormula->expression;
$valueApprecToday = $purchasePrice * (1 + 0.05 * $ageToday);
$valueApprecTomorrow = $purchasePrice * (1 + 0.05 * $ageTomorrow);

echo "💡 Perkiraan Perhitungan (Pro-Rata Appreciation):\n";
echo "   Age hari ini: {$ageToday} tahun\n";
echo "   Value hari ini: Rp " . number_format($valueApprecToday, 0, ',', '.') . "\n";
echo "   Age besok: {$ageTomorrow} tahun\n";
echo "   Value besok: Rp " . number_format($valueApprecTomorrow, 0, ',', '.') . "\n";
echo "   Perubahan: Rp " . number_format($valueApprecTomorrow - $valueApprecToday, 0, ',', '.') . "\n\n";

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✅ KEDUA ASET BERHASIL DIBUAT\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

echo "📋 RINGKASAN:\n";
echo "Aset 1 (ID {$asset1->id}): Elektronik - DEPRECIATION\n";
echo "  Saat ini: Rp " . number_format($valueToday, 0, ',', '.') . "\n";
echo "  Besok: Rp " . number_format($valueTomorrow, 0, ',', '.') . " (berkurang)\n\n";

echo "Aset 2 (ID {$asset2->id}): Tanah - APPRECIATION\n";
echo "  Saat ini: Rp " . number_format($valueApprecToday, 0, ',', '.') . "\n";
echo "  Besok: Rp " . number_format($valueApprecTomorrow, 0, ',', '.') . " (bertambah)\n\n";

echo "⏰ NEXT STEP:\n";
echo "1. Buka aplikasi web\n";
echo "2. Lihat Assets list - nilai masih asli Rp 150 juta (belum dihitung)\n";
echo "3. Besok (8 Jan 2026), refresh halaman Assets\n";
echo "4. Nilai akan BERUBAH otomatis sesuai perhitungan di atas!\n";
echo "5. Check notifikasi untuk melihat perubahan nilai\n";
