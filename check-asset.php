<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Aset dengan received_date 2025-01-07:\n";
echo "======================================\n\n";

$today = now()->startOfDay();
echo "Hari ini: " . $today->toDateString() . "\n\n";

$assets = App\Models\Asset::where('received_date', '2025-01-07')->get();

foreach ($assets as $asset) {
    $purchaseDate = \Carbon\Carbon::parse($asset->received_date)->startOfDay();
    $yearsSince = $purchaseDate->diffInYears($today);

    echo "ID: {$asset->id}\n";
    echo "Name: {$asset->name}\n";
    echo "Received Date: {$asset->received_date}\n";
    echo "Last Depreciation: " . ($asset->last_depreciation_date ?? 'NULL') . "\n";
    echo "Current Book Value: {$asset->current_book_value}\n";
    echo "Years since purchase: {$yearsSince}\n";

    if ($yearsSince >= 1) {
        $lastProcessed = $asset->last_depreciation_date
            ? \Carbon\Carbon::parse($asset->last_depreciation_date)->startOfDay()
            : $purchaseDate;

        $nextDue = $lastProcessed->copy()->addYear();
        echo "Next due date: " . $nextDue->toDateString() . "\n";
        echo "Should process today? " . ($today->isSameDay($nextDue) ? 'YES ✓' : 'NO ✗') . "\n";
    }

    echo "\n---\n\n";
}

echo "\n\nNotifikasi terbaru (5 notif):\n";
echo "============================\n\n";

$notifications = App\Models\Notification::latest()->take(5)->get();

foreach ($notifications as $n) {
    echo "Title: {$n->title}\n";
    echo "Message: {$n->message}\n";
    echo "Type: {$n->type}\n";
    echo "Created: {$n->created_at}\n";
    echo "\n---\n\n";
}
