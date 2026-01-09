<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Latest 3 notifications:\n";
echo "=======================\n\n";

$notifications = App\Models\Notification::latest()->take(3)->get();

foreach ($notifications as $n) {
    echo "Title: {$n->title}\n";
    echo "Message: {$n->message}\n";
    echo "Type: {$n->type}\n";
    echo "Is Read: " . ($n->is_read ? 'Yes' : 'No') . "\n";
    echo "Created: {$n->created_at}\n";
    echo "\n---\n\n";
}
