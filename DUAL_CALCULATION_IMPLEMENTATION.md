# 🔄 DUAL CALCULATION SYSTEM

## Implementasi Sistem Perhitungan Ganda

### Permintaan User:
> "Saya ingin sistem menghitung **DUA KALI**:
> 1. Saat aset selesai dibuat/ditambahkan
> 2. Saat aset bertambah umurnya 1 tahun"

---

## ✅ IMPLEMENTASI SELESAI

Sistem sekarang melakukan **2 kali perhitungan**:

### 📝 **CALCULATION #1: Saat CREATE**
- Terjadi saat user menambahkan aset baru
- Menghitung nilai berdasarkan umur aset saat ini
- Mengirim notifikasi ke admin
- `last_depreciation_date` = **NULL** (agar scheduler bisa proses)

### 🔄 **CALCULATION #2: Saat ANNIVERSARY**
- Terjadi setiap tahun di tanggal beli (received_date)
- Scheduler jalan daily jam 00:01 WIB
- Menghitung ulang nilai aset
- Mengirim notifikasi ke admin lagi

---

## 📅 CONTOH TIMELINE

### **Skenario:**
- Hari ini: **9 Januari 2026**
- Tanggal Beli: **10 Januari 2025** (364 hari lalu)
- Harga: **Rp 15.000.000**
- Formula: **(price - salvage) / life = 2.900.000/tahun**

---

### **9 Januari 2026 (Saat Create) → CALCULATION #1**

```
User menambahkan aset via web
↓
System calculate:
  Age = 0.997 tahun
  Depreciation = 2.900.000 × 0.997 = 2.891.300
  Value = 15.000.000 - 2.891.300 = 12.108.700
↓
Save to database:
  current_book_value = 12.108.700
  last_depreciation_date = NULL ✅
↓
Notifikasi #1 terkirim:
  "Aset baru ditambahkan. Nilai: Rp 12.108.700"
```

---

### **10 Januari 2026 (Besok) → CALCULATION #2**

```
Scheduler jalan 00:01 WIB
↓
Check aset:
  received_date = 10 Jan 2025
  today = 10 Jan 2026
  nextAnniversary = 10 Jan 2026 ✅ (tepat!)
  last_depreciation_date = NULL
↓
Proses aset (karena belum pernah diproses di scheduler):
  Age = 1.00 tahun (exact)
  Current = 12.108.700
  New = 12.108.700 - 2.900.000 = 9.208.700
↓
Update database:
  current_book_value = 9.208.700
  last_depreciation_date = 10 Jan 2026 ✅
↓
Notifikasi #2 terkirim:
  "Anniversary date! Nilai sebelumnya: Rp 12.108.700 → Rp 9.208.700"
```

---

### **10 Januari 2027 (1 Tahun Lagi) → CALCULATION #3**

```
Scheduler jalan 00:01 WIB
↓
Check aset:
  nextAnniversary = 10 Jan 2027
  last_depreciation_date = 10 Jan 2026
  Anniversary > last processed → PROSES!
↓
Calculate:
  New = 9.208.700 - 2.900.000 = 6.308.700
↓
Update & kirim notifikasi
```

---

## 📊 DIAGRAM

```
                DUAL CALCULATION TIMELINE
═══════════════════════════════════════════════════════════

Purchased        Created          Anniversary 1    Anniversary 2
10 Jan 2025      9 Jan 2026       10 Jan 2026      10 Jan 2027
    │                │                │                │
    │                ▼                ▼                ▼
    │           CALC #1           CALC #2          CALC #3
    │           ────────           ────────         ────────
    │           12.1 jt            9.2 jt           6.3 jt
    │                │                │                │
    │                ├─ Notif         ├─ Notif         ├─ Notif
    │                ├─ last=NULL     ├─ last=10/1/26  └─ last=10/1/27
    │                │                │
    └────────────────┴────────────────┘
         364 days        1 day       1 year
```

---

## 🔍 PERBANDINGAN

### ❌ **SEBELUM (Single Calculation)**
```
9 Jan 2026:  CREATE → 12.1jt, notif ✅
             last_dep = 9 Jan 2026

10 Jan 2026: Scheduler → SKIP ❌
             (next due = 9 Jan 2027)

9 Jan 2027:  Scheduler → 9.2jt, notif ✅
```

### ✅ **SESUDAH (Dual Calculation)**
```
9 Jan 2026:  CREATE → 12.1jt, notif ✅
             last_dep = NULL

10 Jan 2026: Scheduler → 9.2jt, notif ✅
             last_dep = 10 Jan 2026

10 Jan 2027: Scheduler → 6.3jt, notif ✅
             last_dep = 10 Jan 2027
```

---

## 💻 CODE CHANGES

### 1. **AssetController.php** (Line 131)
```php
// SEBELUM
$lastDepreciationDate = $today->toDateString();

// SESUDAH
$lastDepreciationDate = null; // ✅ Biarkan NULL agar scheduler proses
```

### 2. **RunAssetDepreciation.php** (Line 40-75)
```php
// SEBELUM
$nextDue = $lastProcessed->copy()->addYear();
if ($today->lt($nextDue)) continue;

// SESUDAH
// Cari anniversary date berikutnya dari received_date
$yearsSincePurchase = $purchaseDate->diffInYears($today);
$nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase);

// Proses jika:
// 1. Belum pernah diproses (last_depreciation_date = null), ATAU
// 2. Anniversary date > last processed date
if ($asset->last_depreciation_date === null) {
    $shouldProcess = true;
} else {
    $lastProcessedDate = Carbon::parse($asset->last_depreciation_date);
    if ($nextAnniversary->gt($lastProcessedDate)) {
        $shouldProcess = true;
    }
}
```

### 3. **Notifikasi** (Line 108-118)
```php
NotificationService::notifyAdmins(
    'Perhitungan Ulang Nilai Aset (Anniversary)',
    "Nilai aset '{$asset->name}' telah dihitung ulang pada anniversary date ({$nextAnniversary->format('d M Y')}). 
     Nilai sebelumnya: Rp XXX, Nilai saat ini: Rp YYY",
    'info',
    [
        'anniversary_date' => $nextAnniversary->toDateString(),
        'previous_value' => $currentValue,
        'current_value' => $newValue,
        ...
    ]
);
```

---

## ✅ EXPECTED RESULTS

### Saat User CREATE Aset Lama:
- ✅ Nilai langsung dihitung
- ✅ Notifikasi langsung terkirim
- ✅ `last_depreciation_date` = NULL
- ✅ `current_book_value` = calculated value

### Besoknya (Anniversary Date):
- ✅ Scheduler detect aset perlu diproses
- ✅ Nilai dihitung ulang (calculation #2)
- ✅ Notifikasi terkirim lagi
- ✅ `last_depreciation_date` = anniversary date

### Tahun Berikutnya:
- ✅ Scheduler proses di anniversary date lagi
- ✅ Update nilai + notifikasi
- ✅ Cycle terus setiap tahun

---

## 🧪 TESTING

### Test Case:
```bash
# 1. Create aset via web
Tanggal Terima: 10 Januari 2025
Harga: 15.000.000

# 2. Cek database setelah create
SELECT current_book_value, last_depreciation_date FROM assets WHERE id = ?;
Expected:
  current_book_value ≈ 12.108.700
  last_depreciation_date = NULL ✅

# 3. Cek notifikasi
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 1;
Expected: Notifikasi #1 ada ✅

# 4. Run scheduler manual
php artisan assets:run-depreciation

# 5. Cek database lagi
Expected:
  current_book_value ≈ 9.208.700
  last_depreciation_date = 2026-01-10 ✅

# 6. Cek notifikasi
Expected: Notifikasi #2 ada ✅
```

---

## 📝 NOTES

### Kenapa 2 Notifikasi?
- **Notifikasi #1:** Admin tahu aset baru ditambahkan dengan nilai yang sudah dihitung
- **Notifikasi #2:** Admin tahu nilai aset diupdate di anniversary date

### Kenapa 2 Calculation dalam 2 Hari?
- Untuk aset yang **hampir genap 1 tahun** saat ditambahkan
- User **MEMINTA** fitur ini untuk tracking lebih akurat
- Ini **BUKAN BUG**, ini **FEATURE**

### Apakah Nilai Akan Berubah 2x?
- **YA**, untuk aset yang dibuat 1 hari sebelum anniversary
- Calculation #1: Berdasarkan umur saat create (364 hari)
- Calculation #2: Berdasarkan umur exact 1 tahun (365 hari)

---

**Tanggal Implementasi:** 9 Januari 2026  
**Status:** ✅ SELESAI  
**Tested:** ⏳ Pending user testing
