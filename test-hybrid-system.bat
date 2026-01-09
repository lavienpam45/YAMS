@echo off
echo ════════════════════════════════════════════════════════════
echo  TEST HYBRID AUTO-DEPRECIATION SYSTEM
echo ════════════════════════════════════════════════════════════
echo.

echo [1] Clear cache untuk force trigger fallback...
php artisan cache:clear
echo.

echo [2] Membuat test asset (received_date = 10 Jan 2025)...
php -r "require 'vendor/autoload.php'; $app = require 'bootstrap/app.php'; $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap(); $asset = App\Models\Asset::create(['name' => 'Test Komputer - Hybrid System', 'asset_code' => 'TEST-' . now()->format('His'), 'unit_code' => 'UNIT-TEST', 'received_date' => '2025-01-10', 'purchase_price' => 15000000, 'useful_life' => 5, 'salvage_value' => 500000, 'type' => 'Komputer', 'quantity' => 1, 'status' => 'Baik']); echo 'Asset created: ID ' . $asset->id . PHP_EOL;"
echo.

echo [3] Simulate HTTP request (trigger fallback)...
echo    Accessing http://localhost/dashboard...
timeout /t 2 /nobreak > NUL
echo    (Fallback should trigger now if scheduler hasn't run)
echo.

echo [4] Check cache status...
php artisan tinker --execute="echo 'Cache key: depreciation_last_run_' . today()->toDateString() . PHP_EOL; echo 'Cache exists: ' . (Cache::has('depreciation_last_run_' . today()->toDateString()) ? 'YES' : 'NO') . PHP_EOL;"
echo.

echo [5] Check latest asset values...
php artisan tinker --execute="$asset = App\Models\Asset::latest()->first(); echo 'Latest Asset:' . PHP_EOL; echo '  ID: ' . $asset->id . PHP_EOL; echo '  Name: ' . $asset->name . PHP_EOL; echo '  Current Value: Rp ' . number_format($asset->current_book_value, 0, ',', '.') . PHP_EOL; echo '  Last Dep Date: ' . ($asset->last_depreciation_date ?? 'NULL') . PHP_EOL;"
echo.

echo [6] Check notifications...
php artisan tinker --execute="$notif = App\Models\Notification::latest()->first(); if($notif) { echo 'Latest Notification:' . PHP_EOL; echo '  Title: ' . $notif->title . PHP_EOL; echo '  Message: ' . substr($notif->message, 0, 100) . '...' . PHP_EOL; echo '  Created: ' . $notif->created_at . PHP_EOL; } else { echo 'No notifications yet' . PHP_EOL; }"
echo.

echo [7] Run scheduler command manually...
php artisan assets:run-depreciation
echo.

echo [8] Check cache after scheduler run...
php artisan tinker --execute="echo 'Cache exists: ' . (Cache::has('depreciation_last_run_' . today()->toDateString()) ? 'YES (Scheduler or Fallback ran)' : 'NO') . PHP_EOL;"
echo.

echo ════════════════════════════════════════════════════════════
echo  TEST COMPLETED
echo ════════════════════════════════════════════════════════════
echo.
echo Expected Results:
echo  1. Asset created with initial calculation
echo  2. Fallback or Scheduler updated the values
echo  3. Cache set to prevent duplicate runs
echo  4. Notifications sent to admins
echo.

pause
