<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Asset;

$loremCategories = [
    'Voluptatem Deserunt',
    'Eum beatae quia inci',
    'Voluptatem Dolorem',
    'Pariatur In molesti',
    'Aut debitis accusamu'
];

$count = Asset::whereIn('type', $loremCategories)->count();
echo "Found {$count} assets with Lorem Ipsum categories\n";

$deleted = Asset::whereIn('type', $loremCategories)->delete();
echo "Deleted: {$deleted} assets\n";

echo "\nRemaining categories:\n";
$categories = Asset::select('type')->distinct()->pluck('type')->toArray();
print_r($categories);
