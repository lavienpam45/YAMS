<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Updating asset 26...\n";

$asset = App\Models\Asset::find(26);
if ($asset) {
    echo "Current received_date: {$asset->received_date}\n";
    echo "Current last_depreciation_date: " . ($asset->last_depreciation_date ?? 'NULL') . "\n\n";

    // Reset to null so it uses received_date as starting point
    $asset->last_depreciation_date = null;
    $asset->save();

    echo "Updated last_depreciation_date to NULL\n\n";

    echo "Now running depreciation command...\n";
    \Illuminate\Support\Facades\Artisan::call('assets:run-depreciation');
    echo \Illuminate\Support\Facades\Artisan::output();
} else {
    echo "Asset 26 not found\n";
}
