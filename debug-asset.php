<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Asset;
use Carbon\Carbon;

$assets = Asset::whereIn('id', [34, 37])->get();

foreach ($assets as $asset) {
    $purchaseDate = Carbon::parse($asset->received_date)->startOfDay();
    $today = now()->startOfDay();

    echo "=== ASET #{$asset->id}: {$asset->name} ===\n";
    echo "Depreciation Type: {$asset->depreciation_type}\n";
    echo "Received Date: {$asset->received_date}\n";
    echo "Today (server): {$today->format('Y-m-d H:i:s')}\n";
    echo "Purchase + 1 Year: " . $purchaseDate->copy()->addYear()->format('Y-m-d') . "\n";
    echo "Is Today >= (Purchase+1Year): " . ($today->gte($purchaseDate->copy()->addYear()) ? 'YES' : 'NO') . "\n";
    echo "Last Depreciation Date: " . ($asset->last_depreciation_date ?? 'NULL') . "\n";
    echo "Current Book Value: " . number_format($asset->current_book_value, 2) . "\n";

    // Cek anniversary logic
    $yearsSincePurchase = $purchaseDate->diffInYears($today);
    $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase);

    if ($today->lt($nextAnniversary)) {
        $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase - 1);
    }

    echo "Years Since Purchase: {$yearsSincePurchase}\n";
    echo "Next Anniversary to process: " . $nextAnniversary->format('Y-m-d') . "\n";

    // Cek shouldProcess
    $shouldProcess = false;
    if ($asset->last_depreciation_date === null) {
        $shouldProcess = $today->gte($purchaseDate->copy()->addYear());
        echo "Condition: last_depreciation_date is NULL, Today >= Purchase+1Year? " . ($shouldProcess ? 'YES' : 'NO') . "\n";
    } else {
        $lastProcessedDate = Carbon::parse($asset->last_depreciation_date)->startOfDay();
        $shouldProcess = $today->gte($nextAnniversary) && $nextAnniversary->gt($lastProcessedDate);
        echo "Condition: Today >= NextAnniversary && NextAnniversary > LastProcessed\n";
        echo "  Today >= NextAnniversary: " . ($today->gte($nextAnniversary) ? 'YES' : 'NO') . "\n";
        echo "  NextAnniversary > LastProcessed: " . ($nextAnniversary->gt($lastProcessedDate) ? 'YES' : 'NO') . "\n";
    }

    echo "SHOULD PROCESS: " . ($shouldProcess ? 'YES ✓' : 'NO ✗') . "\n";
    echo "\n";
}
