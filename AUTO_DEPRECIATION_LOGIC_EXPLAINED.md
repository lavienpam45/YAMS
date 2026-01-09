# PENJELASAN: Bagaimana Auto-Depreciation Bekerja

## Skenario: Menambahkan Aset Lama

### Contoh Kasus Anda:
- **Hari ini:** 9 Januari 2026
- **Tanggal Beli Aset:** 10 Januari 2025 (364 hari yang lalu)
- **Harga Beli:** Rp 15.000.000
- **Tipe:** Komputer (Depreciating Asset)

---

## Timeline: Apa yang Terjadi?

### **Hari ke-1: 9 Januari 2026 (Saat Create Aset)**

#### Langkah 1: Input Data di Form
```
Nama Aset: Komputer HP
Tanggal Terima: 10 Januari 2025
Harga Beli: Rp 15.000.000
Umur Manfaat: 5 tahun
Nilai Sisa: Rp 500.000
```

#### Langkah 2: Sistem Menghitung Otomatis (AssetController::store)
```php
// Calculate age
$receivedDate = 10 Jan 2025
$today = 9 Jan 2026
$ageYears = 0.997 tahun (~364 hari / 365.25)

// Ambil rumus aktif (misalnya: Straight-Line)
// Expression: ({price} - {salvage}) / {life}

// Evaluasi
$annualChange = (15.000.000 - 500.000) / 5
              = 2.900.000 per tahun

// Hitung nilai saat ini (setelah ~1 tahun)
$currentBookValue = 15.000.000 - (2.900.000 * 0.997)
                  = 15.000.000 - 2.891.300
                  = 12.108.700

// Set last_depreciation_date = 9 Jan 2026 (HARI INI!)
```

#### Langkah 3: Notifikasi Terkirim ke Admin
```
Title: "Aset Baru Ditambahkan dengan Perhitungan Depresiasi"
Message: "Nilai aset 'Komputer HP' telah dihitung berdasarkan umur 0.997 tahun. 
          Nilai saat ini: Rp 12.108.700"
Type: info
```

#### Hasil di Database:
```
assets table:
- id: 123
- name: "Komputer HP"
- received_date: "2025-01-10"
- purchase_price: 15000000
- current_book_value: 12108700
- last_depreciation_date: "2026-01-09" ✅ HARI INI
```

---

### **Hari ke-2: 10 Januari 2026 (Besok) - Scheduler Jalan**

#### Jam 00:01 WIB: Scheduler Run
```bash
php artisan schedule:run
  → assets:run-depreciation
```

#### Logic di RunAssetDepreciation Command:
```php
// Load aset "Komputer HP"
$purchaseDate = "2025-01-10"
$lastProcessed = "2026-01-09" // Dari last_depreciation_date
$today = "2026-01-10"

// Hitung next due
$nextDue = "2026-01-09" + 1 year = "2027-01-09"

// Check: Apakah sudah waktunya update?
if ($today->lt($nextDue)) { // 10 Jan 2026 < 9 Jan 2027? YES!
    continue; // ❌ SKIP - Belum waktunya
}
```

#### Hasil:
```
✅ Aset "Komputer HP" DILEWATI
✅ TIDAK ada perubahan nilai
✅ TIDAK ada notifikasi
✅ Tunggu sampai 9 Januari 2027 untuk update berikutnya
```

---

### **1 Tahun Kemudian: 9 Januari 2027 - Anniversary Date**

#### Jam 00:01 WIB: Scheduler Run
```bash
php artisan schedule:run
  → assets:run-depreciation
```

#### Logic:
```php
$purchaseDate = "2025-01-10"
$lastProcessed = "2026-01-09"
$today = "2027-01-09"

$nextDue = "2026-01-09" + 1 year = "2027-01-09"

// Check: Apakah sudah waktunya update?
if ($today->lt($nextDue)) { // 9 Jan 2027 < 9 Jan 2027? NO!
    continue;
}

// ✅ PROSES!
$ageYears = 2.00 tahun
$annualChange = 2.900.000

// Hitung nilai baru (tahun ke-2)
$currentValue = 12.108.700
$newValue = 12.108.700 - 2.900.000 = 9.208.700

// Update database
current_book_value = 9.208.700
last_depreciation_date = "2027-01-09"
```

#### Notifikasi Terkirim:
```
Title: "Perhitungan Ulang Nilai Aset"
Message: "Nilai aset 'Komputer HP' (kode: AKT-001) telah dihitung ulang. 
          Nilai sebelumnya: Rp 12.108.700, Nilai saat ini: Rp 9.208.700"
Type: info
```

---

## Poin Penting! ⚠️

### 1. **Saat CREATE Aset yang Sudah Lama:**
- ✅ Nilai **LANGSUNG** dihitung berdasarkan umur aset
- ✅ `last_depreciation_date` = **HARI INI** (tanggal create)
- ✅ Notifikasi **LANGSUNG** terkirim ke admin

### 2. **Scheduler Tidak Akan Run Besok:**
- ✅ Karena `last_depreciation_date` sudah di-set ke hari ini
- ✅ Next due = hari ini + 1 tahun
- ✅ Tidak akan double calculation

### 3. **Scheduler Akan Run 1 Tahun Kemudian:**
- ✅ Tepatnya di anniversary date dari `last_depreciation_date`
- ✅ Nilai akan dihitung ulang setiap tahun
- ✅ Notifikasi terkirim setiap kali ada perubahan

---

## Diagram Timeline

```
Timeline Aset "Komputer HP"
════════════════════════════════════════════════════════════════

10 Jan 2025          9 Jan 2026           9 Jan 2027           9 Jan 2028
    │                    │                    │                    │
    │ (Tanggal Beli)     │ (Create di DB)     │ (Auto Update)      │ (Auto Update)
    │                    │                    │                    │
    ▼                    ▼                    ▼                    ▼
Purchase             Calculate             Calculate            Calculate
Rp 15jt              Rp 12.1jt             Rp 9.2jt             Rp 6.3jt
                         │                    │                    │
                         ├─ Notifikasi        ├─ Notifikasi        ├─ Notifikasi
                         ├─ last_dep_date     ├─ last_dep_date     └─ last_dep_date
                         │  = 9 Jan 2026      │  = 9 Jan 2027         = 9 Jan 2028
                         │                    │
                    10 Jan 2026          10 Jan 2027
                         │                    │
                         ▼                    ▼
                    SKIP (belum 1 thn)   SKIP (belum 1 thn)
```

---

## FAQ

### Q1: Kenapa besok (10 Jan 2026) tidak ada perubahan?
**A:** Karena `last_depreciation_date` sudah di-set ke **9 Jan 2026** (hari create). Scheduler hanya run jika sudah **>= 1 tahun** dari `last_depreciation_date`.

### Q2: Kapan nilai aset akan berubah lagi?
**A:** Tepat **1 tahun** dari `last_depreciation_date`, yaitu **9 Januari 2027**.

### Q3: Kenapa tidak 10 Januari 2026 (tepat 1 tahun dari tanggal beli)?
**A:** Karena nilai sudah dihitung saat create (9 Jan 2026), jadi next update adalah 1 tahun dari tanggal itu.

### Q4: Apakah ini bug?
**A:** **BUKAN BUG!** Ini adalah design yang benar. Jika besok (10 Jan) dihitung lagi, akan terjadi **DOUBLE CALCULATION** dalam 2 hari!

---

## Test Case

### Scenario 1: Aset Baru (< 1 tahun)
```
Hari ini: 9 Jan 2026
Tanggal Beli: 1 Jul 2025 (6 bulan lalu)

CREATE:
- age = 0.5 tahun
- Calculate immediately ✅
- current_book_value = adjusted value
- last_depreciation_date = 9 Jan 2026

BESOK (10 Jan 2026):
- SKIP (next due = 9 Jan 2027)

9 JAN 2027:
- Calculate again ✅
- Notifikasi terkirim ✅
```

### Scenario 2: Aset Sangat Lama (3 tahun)
```
Hari ini: 9 Jan 2026
Tanggal Beli: 1 Jan 2023 (3 tahun lalu)

CREATE:
- age = 3.02 tahun
- Calculate immediately ✅
- Nilai sudah turun signifikan
- last_depreciation_date = 9 Jan 2026

BESOK (10 Jan 2026):
- SKIP

9 JAN 2027:
- Calculate again (tahun ke-4) ✅
```

---

## Kesimpulan

**JAWABAN PERTANYAAN ANDA:**

> "Jika saya di hari ini (9 Jan 2026) menambahkan aset yang dibeli 10 Jan 2025 
> dengan harga 15jt, seharusnya besok harga/nilai aset tersebut sudah berubah 
> sesuai kategori dan rumus, dan juga notifikasi harus memberitahu admin?"

**JAWABAN:**
- ❌ **TIDAK** akan berubah **BESOK** (10 Jan 2026)
- ✅ **SUDAH** berubah **HARI INI** (9 Jan 2026) saat Anda create
- ✅ Notifikasi **SUDAH** terkirim **HARI INI** ke admin
- ✅ Perubahan **BERIKUTNYA** akan terjadi **1 TAHUN LAGI** (9 Jan 2027)

**Ini adalah DESIGN yang BENAR untuk menghindari double calculation!**

---

**Tanggal:** 9 Januari 2026  
**Perbaikan:** last_depreciation_date di-set ke tanggal create, bukan received_date
