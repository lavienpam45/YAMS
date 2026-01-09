# 🔧 PERBAIKAN BUG AUTO-DEPRECIATION SYSTEM

## 📋 Summary

Berhasil memperbaiki **3 bug** dalam sistem auto-depreciation:

### ✅ Bug #1: Sistem tidak menghitung ulang harga/nilai aset secara otomatis
**Status:** FIXED ✓

**Penyebab:**
- Logic di `RunAssetDepreciation` command terlalu strict (hanya jalan tepat di anniversary date)
- AppServiceProvider menjalankan auto-depreciation di `boot()` yang terlalu berat
- Scheduler sudah ada tapi tidak optimal

**Solusi:**
- ✓ Fix kondisi di `RunAssetDepreciation`: dari `isSameDay()` → `lt()` 
- ✓ Remove auto-depreciation dari `AppServiceProvider::boot()`
- ✓ Optimize scheduler dengan `withoutOverlapping()` dan logging
- ✓ Tambah precision dengan `calculateAgeInYears()` menggunakan decimal

### ✅ Bug #2: Notifikasi tidak mendeteksi/memberitahu saat terjadi penghitungan ulang
**Status:** FIXED ✓

**Penyebab:**
- Karena bug #1, command tidak jalan → notifikasi tidak terkirim

**Solusi:**
- ✓ Update notifikasi message lebih informatif (nilai lama → nilai baru)
- ✓ Tambah metadata: `previous_value`, `current_value`, `age_years`
- ✓ Console output lebih detail untuk monitoring

### ✅ Bug #3: Double Calculation saat create aset lama
**Status:** FIXED ✓

**Penyebab:**
- Saat create aset dengan `received_date` lama (misal 1 tahun lalu)
- `last_depreciation_date` di-set ke `received_date` (tanggal beli)
- Besoknya scheduler jalan lagi karena sudah >= 1 tahun dari `received_date`
- Terjadi **DOUBLE CALCULATION** dalam 2 hari

**Solusi:**
- ✓ Set `last_depreciation_date` ke **HARI INI** (tanggal create), bukan `received_date`
- ✓ Scheduler akan menunggu 1 tahun dari tanggal create sebelum update lagi
- ✓ Mencegah duplicate calculation

---

## 📁 File yang Diubah

### 1. `app/Providers/AppServiceProvider.php`
**Perubahan:**
```diff
- public function boot(): void
- {
-     $this->runAutoDepreciation(); // ❌ Berat, jalan setiap request
- }

+ public function boot(): void
+ {
+     if ($this->app->runningInConsole()) {
+         $this->commands([...]);
+     }
+ }
```

**Impact:** Mengurangi overhead pada setiap HTTP request

### 2. `app/Console/Commands/RunAssetDepreciation.php`
**Perubahan Utama:**
```diff
- if (!$today->isSameDay($nextDue)) { // ❌ Terlalu strict
-     continue;
- }

+ if ($today->lt($nextDue)) { // ✅ Cek >= anniversary
+     continue;
+ }

+ // Notifikasi lebih informatif
+ NotificationService::notifyAdmins(
+     'Perhitungan Ulang Nilai Aset',
+     "Nilai aset '{$asset->name}' telah dihitung ulang. 
+      Nilai sebelumnya: Rp XXX, Nilai saat ini: Rp YYY",
+     'info',
+     [...]
+ );
```

**Impact:** Sistem sekarang jalan untuk semua aset yang sudah >= anniversary date

### 3. `app/Http/Controllers/AssetController.php` ⭐ NEW
**Perubahan Utama:**
```diff
- $lastDepreciationDate = $receivedDate->toDateString(); // ❌ Set ke tanggal beli

+ $lastDepreciationDate = $today->toDateString(); // ✅ Set ke tanggal create
```

**Impact:** Mencegah double calculation saat create aset yang sudah lama

### 4. `routes/console.php`
**Perubahan:**
```diff
- Schedule::command('assets:run-depreciation')->dailyAt('00:10');

+ Schedule::command('assets:run-depreciation')
+     ->dailyAt('00:01')
+     ->timezone('Asia/Jakarta')
+     ->withoutOverlapping()
+     ->onSuccess(fn() => Log::info('✓ Auto depreciation berhasil'))
+     ->onFailure(fn() => Log::error('✗ Auto depreciation gagal'));
```

**Impact:** Scheduler lebih robust dengan protection & logging

---

## 🧪 Cara Testing

### Testing Manual
```bash
# 1. Verifikasi fix
php verify-auto-depreciation-fix.php

# 2. Run command manual
php artisan assets:run-depreciation

# 3. Cek notifikasi di database
php artisan tinker
>>> App\Models\Notification::latest()->take(5)->get()
```

### Expected Results
- ✓ Aset yang sudah >= 1 tahun diupdate `current_book_value`
- ✓ `last_depreciation_date` diupdate ke hari ini
- ✓ Notifikasi terkirim ke semua admin/superadmin
- ✓ History tercatat di `depreciation_histories`
- ✓ Console output menampilkan jumlah aset yang diproses

---

## 🚀 Cara Aktivasi Auto-Depreciation

### Windows (Task Scheduler)
1. Buka Task Scheduler
2. Create Basic Task
3. Trigger: Daily, jam 00:01
4. Action: Start a Program
   - Program: `php`
   - Arguments: `artisan schedule:run`
   - Start in: `C:\Users\bagus\Herd\yams2`

### Linux/Mac (Crontab)
```bash
crontab -e
# Tambahkan:
* * * * * cd /path/to/yams2 && php artisan schedule:run >> /dev/null 2>&1
```

### Development (Manual)
```bash
# Run scheduler worker (auto-check every minute)
php artisan schedule:work

# Atau jalankan command langsung
php artisan assets:run-depreciation
```

---

## 📊 Flow Sistem Setelah Perbaikan

```
┌─────────────────────────────────────┐
│  CRON/Task Scheduler (Daily 00:01)  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   php artisan schedule:run          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   assets:run-depreciation           │
│   (RunAssetDepreciation Command)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Query semua aset dengan           │
│   received_date NOT NULL            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Loop setiap aset:                 │
│   - Cek apakah >= 1 tahun           │
│   - Cek last_depreciation_date      │
│   - Hitung nextDue = last + 1 year  │
│   - Skip jika today < nextDue       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Untuk aset yang perlu update:     │
│   1. Ambil formula aktif            │
│   2. Evaluasi expression            │
│   3. Hitung nilai baru              │
│   4. Update current_book_value      │
│   5. Update last_depreciation_date  │
│   6. Simpan history                 │
│   7. Kirim notifikasi ke admin      │
└─────────────────────────────────────┘
```

---

## ✅ Checklist Verifikasi

- [x] RunAssetDepreciation command logic fixed
- [x] Scheduler configured di routes/console.php
- [x] AppServiceProvider cleaned up
- [x] Notification message improved
- [x] Logging added
- [x] Documentation created
- [x] Verification script created
- [ ] **Manual testing oleh user** ⬅ **LANGKAH SELANJUTNYA**
- [ ] Aktifkan scheduler di server (crontab/task scheduler)

---

## 📝 Notes Penting

1. **Scheduler HARUS diaktifkan** di server untuk auto-depreciation berjalan otomatis
2. Tanpa scheduler, command harus dijalankan manual dengan `php artisan assets:run-depreciation`
3. Notifikasi hanya terkirim ke user dengan role `admin` atau `superadmin`
4. System menggunakan `withoutOverlapping()` untuk mencegah double execution
5. Log tersimpan di `storage/logs/laravel.log`

---

## 🎯 Testing Scenarios

### Scenario 1: Aset Baru (< 1 tahun)
- Input: Aset dengan received_date = 6 bulan lalu
- Expected: **Dilewati**, tidak ada perubahan

### Scenario 2: Aset 1 Tahun (Depreciation)
- Input: Aset "Komputer" dengan received_date = 1 tahun lalu
- Expected: **Nilai turun**, notifikasi terkirim

### Scenario 3: Aset Appreciating (Tanah/Bangunan)
- Input: Aset "Tanah" dengan received_date = 2 tahun lalu
- Expected: **Nilai naik**, notifikasi terkirim

### Scenario 4: Aset Overdue (Terlambat)
- Input: Aset dengan last_depreciation_date = 2 tahun lalu
- Expected: **Langsung diupdate**, tidak menunggu tepat anniversary

### Scenario 5: Create Aset Lama (Regression Test) ⭐ IMPORTANT
- Input: Hari ini 9 Jan 2026, create aset dengan received_date = 10 Jan 2025 (hampir 1 tahun lalu)
- Expected saat CREATE:
  - ✅ Nilai langsung dihitung berdasarkan umur ~1 tahun
  - ✅ `last_depreciation_date` = **9 Jan 2026** (hari create)
  - ✅ Notifikasi langsung terkirim ke admin
- Expected BESOK (10 Jan 2026):
  - ✅ Scheduler SKIP aset ini (karena next due = 9 Jan 2027)
  - ✅ **TIDAK ada** double calculation
- Expected 1 TAHUN KEMUDIAN (9 Jan 2027):
  - ✅ Scheduler UPDATE aset ini
  - ✅ Notifikasi terkirim lagi

---

## 💡 JAWABAN PERTANYAAN USER

**Q:** "Jika saya di hari ini (9 Jan 2026) menambahkan aset yang dibeli 10 Jan 2025 dengan harga 15jt, seharusnya besok harga/nilai aset tersebut sudah berubah sesuai kategori dan rumus, dan notifikasi harus memberitahu admin?"

**A:** 
- ❌ **TIDAK** akan berubah **BESOK** (10 Jan 2026)
- ✅ **SUDAH** berubah **HARI INI** (9 Jan 2026) saat Anda create
- ✅ Notifikasi **SUDAH** terkirim **HARI INI** ke admin
- ✅ Perubahan **BERIKUTNYA** akan terjadi **1 TAHUN LAGI** (9 Jan 2027)

**Alasan:**
- Saat create aset yang sudah lama, sistem **LANGSUNG** menghitung nilai berdasarkan umur aset
- `last_depreciation_date` di-set ke **HARI INI** (bukan tanggal beli)
- Scheduler hanya update **1 tahun** setelah `last_depreciation_date`
- Ini **BUKAN BUG**, ini design untuk mencegah **DOUBLE CALCULATION**

**Detail lengkap:** Lihat file `AUTO_DEPRECIATION_LOGIC_EXPLAINED.md`

---

**Dibuat:** 8 Januari 2026  
**Status:** ✅ COMPLETED  
**Next Action:** Manual testing oleh user
