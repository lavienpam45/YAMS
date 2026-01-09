<?php

/**
 * Script untuk memverifikasi perbaikan auto-depreciation system
 * Jalankan: php verify-auto-depreciation-fix.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "╔═══════════════════════════════════════════════════════════════╗\n";
echo "║   VERIFIKASI PERBAIKAN AUTO-DEPRECIATION SYSTEM              ║\n";
echo "╚═══════════════════════════════════════════════════════════════╝\n\n";

// 1. Cek apakah ada aset yang perlu diupdate
echo "[1] Checking assets yang perlu diupdate...\n";
echo str_repeat("─", 65) . "\n";

$today = now()->startOfDay();
$needsUpdate = 0;

$assets = App\Models\Asset::whereNotNull('received_date')->get();

foreach ($assets as $asset) {
    $purchaseDate = \Carbon\Carbon::parse($asset->received_date)->startOfDay();
    
    // Skip jika belum 1 tahun
    if ($today->lt($purchaseDate->copy()->addYear())) {
        continue;
    }
    
    $lastProcessed = $asset->last_depreciation_date
        ? \Carbon\Carbon::parse($asset->last_depreciation_date)->startOfDay()
        : $purchaseDate;
    
    $nextDue = $lastProcessed->copy()->addYear();
    
    // Cek apakah sudah waktunya update
    if ($today->gte($nextDue)) {
        $needsUpdate++;
        $daysOverdue = $today->diffInDays($nextDue);
        echo "  ✓ Aset #{$asset->id} - {$asset->name}\n";
        echo "    Kode: {$asset->asset_code}\n";
        echo "    Received: {$asset->received_date}\n";
        echo "    Last Update: " . ($asset->last_depreciation_date ?? 'Belum pernah') . "\n";
        echo "    Next Due: {$nextDue->toDateString()}\n";
        echo "    Status: " . ($daysOverdue > 0 ? "Terlambat {$daysOverdue} hari" : "Tepat waktu") . "\n";
        echo "    Current Value: Rp " . number_format($asset->current_book_value ?? $asset->purchase_price, 0, ',', '.') . "\n\n";
    }
}

if ($needsUpdate === 0) {
    echo "  ℹ Tidak ada aset yang perlu diupdate hari ini.\n\n";
} else {
    echo "  Total aset yang perlu diupdate: {$needsUpdate}\n\n";
}

// 2. Cek apakah command tersedia
echo "[2] Checking command availability...\n";
echo str_repeat("─", 65) . "\n";

try {
    $commands = \Illuminate\Support\Facades\Artisan::all();
    if (isset($commands['assets:run-depreciation'])) {
        echo "  ✓ Command 'assets:run-depreciation' tersedia\n\n";
    } else {
        echo "  ✗ Command 'assets:run-depreciation' TIDAK ditemukan\n\n";
    }
} catch (\Exception $e) {
    echo "  ✗ Error: " . $e->getMessage() . "\n\n";
}

// 3. Cek scheduler configuration
echo "[3] Checking scheduler configuration...\n";
echo str_repeat("─", 65) . "\n";

$consoleFile = file_get_contents(__DIR__ . '/routes/console.php');
if (strpos($consoleFile, 'assets:run-depreciation') !== false) {
    echo "  ✓ Scheduler dikonfigurasi di routes/console.php\n";
    if (strpos($consoleFile, 'dailyAt') !== false) {
        echo "  ✓ Schedule: Daily\n";
    }
    if (strpos($consoleFile, 'withoutOverlapping') !== false) {
        echo "  ✓ Protection: withoutOverlapping() enabled\n";
    }
    echo "\n";
} else {
    echo "  ✗ Scheduler BELUM dikonfigurasi\n\n";
}

// 4. Cek rumus aktif
echo "[4] Checking active formulas...\n";
echo str_repeat("─", 65) . "\n";

$depreciationFormula = App\Models\DepreciationFormula::getActiveDepreciationFormula();
$appreciationFormula = App\Models\DepreciationFormula::getActiveAppreciationFormula();

if ($depreciationFormula) {
    echo "  ✓ Depreciation Formula: {$depreciationFormula->name}\n";
    echo "    Expression: {$depreciationFormula->expression}\n";
} else {
    echo "  ⚠ Depreciation Formula: TIDAK ADA\n";
}

if ($appreciationFormula) {
    echo "  ✓ Appreciation Formula: {$appreciationFormula->name}\n";
    echo "    Expression: {$appreciationFormula->expression}\n";
} else {
    echo "  ⚠ Appreciation Formula: TIDAK ADA\n";
}
echo "\n";

// 5. Tampilkan notifikasi terakhir
echo "[5] Checking recent notifications...\n";
echo str_repeat("─", 65) . "\n";

$recentNotifications = App\Models\Notification::latest()->take(5)->get();

if ($recentNotifications->count() > 0) {
    foreach ($recentNotifications as $notif) {
        $icon = match($notif->type) {
            'success' => '✓',
            'info' => 'ℹ',
            'warning' => '⚠',
            'error' => '✗',
            default => '•'
        };
        
        echo "  {$icon} [{$notif->created_at->format('Y-m-d H:i')}] {$notif->title}\n";
        echo "    Message: {$notif->message}\n";
        echo "    Read: " . ($notif->is_read ? 'Yes' : 'No') . "\n\n";
    }
} else {
    echo "  ℹ Belum ada notifikasi\n\n";
}

// 6. Recommendation
echo "╔═══════════════════════════════════════════════════════════════╗\n";
echo "║   LANGKAH SELANJUTNYA                                         ║\n";
echo "╚═══════════════════════════════════════════════════════════════╝\n\n";

if ($needsUpdate > 0) {
    echo "✓ Ada {$needsUpdate} aset yang perlu diupdate\n";
    echo "  Jalankan: php artisan assets:run-depreciation\n\n";
} else {
    echo "ℹ Tidak ada aset yang perlu diupdate hari ini\n";
    echo "  System sudah up-to-date\n\n";
}

echo "📝 Untuk mengaktifkan scheduler otomatis:\n";
echo "  Windows (Task Scheduler): Buat task yang jalankan command berikut setiap hari:\n";
echo "  cd " . __DIR__ . " && php artisan schedule:run\n\n";

echo "  Linux/Mac (Crontab): Tambahkan ke crontab:\n";
echo "  * * * * * cd " . __DIR__ . " && php artisan schedule:run >> /dev/null 2>&1\n\n";

echo "╔═══════════════════════════════════════════════════════════════╗\n";
echo "║   VERIFICATION COMPLETED                                      ║\n";
echo "╚═══════════════════════════════════════════════════════════════╝\n";
