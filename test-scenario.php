<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "TEST PRO-RATA DEPRECIATION\n";
echo "==========================\n\n";

// Skenario: Aset dari 8 Jan 2025, input 7 Jan 2026
$receivedDate = \Carbon\Carbon::parse('2025-01-08')->startOfDay();
$inputDate = \Carbon\Carbon::parse('2026-01-07')->startOfDay();
$tomorrowDate = \Carbon\Carbon::parse('2026-01-08')->startOfDay();

echo "Input Date (Hari ini): {$inputDate->format('d M Y')}\n";
echo "Received Date: {$receivedDate->format('d M Y')}\n";
echo "Tomorrow: {$tomorrowDate->format('d M Y')}\n\n";

// Helper function untuk hitung age
function calculateAgeInYears(\Carbon\Carbon $receivedDate, \Carbon\Carbon $today): float
{
    $totalDays = $receivedDate->diffInDays($today);
    return $totalDays / 365.25;
}

// Hitung age pada hari input
$ageAtInput = calculateAgeInYears($receivedDate, $inputDate);
echo "Age saat input (7 Jan 2026): {$ageAtInput} tahun\n";

// Hitung age pada besok (anniversary)
$ageAtTomorrow = calculateAgeInYears($receivedDate, $tomorrowDate);
echo "Age besok (8 Jan 2026): {$ageAtTomorrow} tahun\n\n";

// Data aset
$purchasePrice = 10000000;
$salvageValue = 500000;
$usefulLife = 5;

// Formula: (price - salvage) / life
$annualDepreciation = ($purchasePrice - $salvageValue) / $usefulLife;
echo "Formula: ({$purchasePrice} - {$salvageValue}) / {$usefulLife}\n";
echo "Annual Depreciation: Rp " . number_format($annualDepreciation, 0, ',', '.') . "/tahun\n\n";

// Hitung nilai pada input date
$depreciationAtInput = $annualDepreciation * $ageAtInput;
$valueAtInput = $purchasePrice - $depreciationAtInput;
$valueAtInput = max($salvageValue, $valueAtInput); // Jangan kurang dari salvage value

echo "═══ HASIL INPUT (7 JAN 2026) ═══\n";
echo "Age: {$ageAtInput} tahun\n";
echo "Depreciation: Rp " . number_format($depreciationAtInput, 0, ',', '.') . "\n";
echo "Current Book Value: Rp " . number_format($valueAtInput, 0, ',', '.') . "\n";
echo "Status: Aset sudah 0.997 tahun, nilai sudah berkurang!\n\n";

// Hitung nilai pada anniversary (besok)
$depreciationAtTomorrow = $annualDepreciation * $ageAtTomorrow;
$valueAtTomorrow = $purchasePrice - $depreciationAtTomorrow;
$valueAtTomorrow = max($salvageValue, $valueAtTomorrow);

echo "═══ HASIL ANNIVERSARY (8 JAN 2026) ═══\n";
echo "Age: {$ageAtTomorrow} tahun\n";
echo "Depreciation: Rp " . number_format($depreciationAtTomorrow, 0, ',', '.') . "\n";
echo "Current Book Value: Rp " . number_format($valueAtTomorrow, 0, ',', '.') . "\n";
echo "Status: Aset sudah 1 tahun penuh, nilai berkurang LEBIH BANYAK!\n\n";

// Perbandingan
$difference = $valueAtInput - $valueAtTomorrow;
echo "═══ PERBANDINGAN ═══\n";
echo "Perubahan nilai dalam 1 hari: Rp " . number_format($difference, 0, ',', '.') . "\n";
echo "Dari Rp " . number_format($valueAtInput, 0, ',', '.') . " (7 Jan)\n";
echo "Menjadi Rp " . number_format($valueAtTomorrow, 0, ',', '.') . " (8 Jan)\n\n";

echo "✅ KESIMPULAN:\n";
echo "- 7 Jan 2026 (input): Nilai sudah berkurang ke " . number_format($valueAtInput, 0, ',', '.') . "\n";
echo "- 8 Jan 2026 (anniversary): Nilai berkurang lagi menjadi " . number_format($valueAtTomorrow, 0, ',', '.') . "\n";
echo "- Sistem akan otomatis recalculate setiap tahunnya pada tanggal 8 Jan\n";
