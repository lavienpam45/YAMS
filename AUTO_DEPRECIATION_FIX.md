# AUTO DEPRECIATION SYSTEM - BUG FIXES

## Tanggal Perbaikan
8 Januari 2026

## Bug yang Diperbaiki

### Bug #1: Sistem tidak menghitung ulang harga/nilai aset secara otomatis
**Masalah:**
- Sistem tidak menghitung ulang nilai aset meskipun aset sudah bertambah 1 tahun usianya
- Logic di `AppServiceProvider` yang dijalankan saat bootstrap memiliki kondisi query yang salah
- Scheduler ada tapi tidak dikonfigurasi dengan benar

**Solusi:**
1. **Menghapus auto-depreciation dari AppServiceProvider**
   - Auto-depreciation di `boot()` method dihapus karena terlalu berat dan tidak efisien
   - Seharusnya tidak dijalankan setiap request, tapi dijadwalkan 1x sehari

2. **Memperbaiki RunAssetDepreciation Command**
   - Fix logic untuk cek anniversary date (dari `isSameDay()` menjadi `lt()`)
   - Menggunakan `calculateAgeInYears()` dengan desimal untuk presisi lebih tinggi
   - Menambahkan logging yang lebih informatif

3. **Memperbaiki Scheduler Configuration** (`routes/console.php`)
   - Schedule command `assets:run-depreciation` berjalan setiap hari jam 00:01 WIB
   - Menambahkan `withoutOverlapping()` untuk mencegah double execution
   - Menambahkan logging success/failure ke Laravel log

### Bug #2: Notifikasi tidak mendeteksi/memberitahu saat terjadi penghitungan ulang nilai/harga aset
**Masalah:**
- Notifikasi tidak terkirim ke admin saat sistem menghitung ulang nilai aset
- Karena bug #1, auto-depreciation tidak jalan, sehingga notifikasi juga tidak terkirim

**Solusi:**
1. **Memperbaiki Notifikasi di RunAssetDepreciation**
   - Mengupdate pesan notifikasi lebih informatif (nilai sebelumnya → nilai baru)
   - Menambahkan data tambahan: `age_years` untuk debugging
   - Notifikasi akan terkirim setiap kali aset dihitung ulang

## File yang Diubah

### 1. `app/Providers/AppServiceProvider.php`
**Perubahan:**
- Menghapus method `runAutoDepreciation()`, `evaluateExpression()`, dan `calculateAgeInYears()`
- Menghapus semua import yang tidak terpakai (Asset, DepreciationFormula, etc.)
- Menyederhanakan `boot()` method hanya untuk register commands

**Sebelum:**
```php
public function boot(): void
{
    $this->runAutoDepreciation(); // ❌ Berat, jalan setiap request
}
```

**Sesudah:**
```php
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->commands([
            \App\Console\Commands\RunAssetDepreciation::class,
            \App\Console\Commands\RecordDepreciationHistory::class,
        ]);
    }
}
```

### 2. `app/Console/Commands/RunAssetDepreciation.php`
**Perubahan:**
- Fix kondisi untuk cek anniversary: `$today->lt($nextDue)` (jika hari ini < next due, skip)
- Menggunakan `calculateAgeInYears()` dengan decimal precision
- Memperbaiki pesan notifikasi lebih informatif (menampilkan nilai lama → nilai baru)
- Menambahkan output yang lebih detail di console

**Sebelum:**
```php
if (!$today->isSameDay($nextDue)) { // ❌ Terlalu strict, hanya jalan 1 hari
    continue;
}
```

**Sesudah:**
```php
if ($today->lt($nextDue)) { // ✅ Jalan saat sudah >= anniversary
    continue;
}
```

**Notifikasi:**
```php
NotificationService::notifyAdmins(
    'Perhitungan Ulang Nilai Aset',
    "Nilai aset '{$asset->name}' (kode: {$asset->asset_code}) telah dihitung ulang. Nilai sebelumnya: Rp XXX, Nilai saat ini: Rp YYY",
    'info',
    [
        'asset_id' => $asset->id,
        'asset_code' => $asset->asset_code,
        'previous_value' => $currentValue,
        'current_value' => $newValue,
        'calculated_on' => $today->toDateString(),
        'age_years' => round($ageYears, 2),
    ]
);
```

### 3. `routes/console.php`
**Perubahan:**
- Menghapus duplikasi scheduler
- Menambahkan konfigurasi scheduler yang lebih robust

**Konfigurasi Scheduler:**
```php
Schedule::command('assets:run-depreciation')
    ->dailyAt('00:01')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping()
    ->onSuccess(function () {
        Log::info('✓ Auto depreciation berhasil dijalankan');
    })
    ->onFailure(function () {
        Log::error('✗ Auto depreciation gagal dijalankan');
    });
```

## Cara Menggunakan

### 1. Menjalankan Scheduler (Production)
Untuk menjalankan scheduler otomatis setiap hari, tambahkan ke crontab:

```bash
* * * * * cd /path/to/yams2 && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Menjalankan Manual (Testing/Development)
Jalankan command secara manual untuk testing:

```bash
php artisan assets:run-depreciation
```

### 3. Melihat Log
Cek log untuk memastikan scheduler berjalan:

```bash
# Di Windows
Get-Content storage\logs\laravel.log -Tail 50

# Di Linux/Mac
tail -f storage/logs/laravel.log
```

## Testing

### Test Case 1: Aset yang sudah 1 tahun
1. Buat aset dengan `received_date` = 1 tahun lalu
2. Pastikan `last_depreciation_date` = null atau < 1 tahun lalu
3. Jalankan `php artisan assets:run-depreciation`
4. **Expected:** Nilai aset diupdate, notifikasi terkirim ke admin

### Test Case 2: Aset yang belum 1 tahun
1. Buat aset dengan `received_date` = 6 bulan lalu
2. Jalankan `php artisan assets:run-depreciation`
3. **Expected:** Aset dilewati, tidak ada perubahan

### Test Case 3: Aset appreciating (Tanah/Bangunan)
1. Buat aset dengan `type` = "Tanah" atau "Bangunan"
2. `received_date` = 1 tahun lalu
3. Jalankan `php artisan assets:run-depreciation`
4. **Expected:** Nilai aset **naik** (appreciation), notifikasi terkirim

## Verification Checklist

- [x] RunAssetDepreciation command logic fixed
- [x] Scheduler configured di routes/console.php
- [x] AppServiceProvider cleaned up (tidak ada auto-run di boot)
- [x] Notification message improved (tampilkan nilai lama → nilai baru)
- [x] Logging added untuk success/failure
- [ ] Test manual dengan `php artisan assets:run-depreciation`
- [ ] Verify notifikasi terkirim ke admin
- [ ] Verify scheduler berjalan dengan crontab

## Notes
- Scheduler hanya akan berjalan jika crontab sudah dikonfigurasi di server
- Untuk development, gunakan command manual atau `php artisan schedule:work`
- Notifikasi dikirim ke semua user dengan role `admin` atau `superadmin`
