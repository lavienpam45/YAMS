<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Force run depreciation command
echo "Menjalankan depreciation command...\n";
\Illuminate\Support\Facades\Artisan::call('assets:run-depreciation');
echo \Illuminate\Support\Facades\Artisan::output();

echo "\n\n✓ Selesai!\n";
