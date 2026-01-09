@echo off
echo ========================================
echo TEST AUTO DEPRECIATION SYSTEM
echo ========================================
echo.

echo [1] Testing command availability...
php artisan list | findstr "assets:run-depreciation"
if errorlevel 1 (
    echo ERROR: Command assets:run-depreciation tidak ditemukan!
    exit /b 1
)
echo OK: Command ditemukan
echo.

echo [2] Running auto depreciation...
php artisan assets:run-depreciation
echo.

echo [3] Checking latest notifications...
php artisan tinker --execute="echo 'Latest 5 notifications:'; App\Models\Notification::latest()->take(5)->get(['id','title','message','created_at'])->each(function($n) { echo $n->id . ' - ' . $n->title . ' (' . $n->created_at . ')' . PHP_EOL; });"
echo.

echo ========================================
echo TEST COMPLETED
echo ========================================
echo.
echo Silakan cek:
echo 1. Output command di atas
echo 2. Database table 'notifications' untuk notifikasi baru
echo 3. Database table 'assets' untuk perubahan 'current_book_value'
echo 4. Database table 'depreciation_histories' untuk history baru
echo.

pause
