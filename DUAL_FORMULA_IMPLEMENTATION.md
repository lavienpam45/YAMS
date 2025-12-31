# Dual Formula System Implementation Guide

## Overview
YAMS sekarang mendukung dua jenis aset dengan rumus perhitungan yang berbeda:
- **Aset Penyusutan** (merah 📉): Untuk aset yang nilainya menurun (komputer, kendaraan, peralatan, dll)
- **Aset Apresiasi** (hijau 📈): Untuk aset yang nilainya naik (tanah dan bangunan)

## Perubahan Backend

### 1. Database Migration
File: `database/migrations/2025_12_29_100000_add_type_to_depreciation_formulas_table.php`

Menambahkan kolom `type` pada tabel `depreciation_formulas`:
- Tipe: ENUM dengan nilai `'depreciation'` atau `'appreciation'`
- Default: `'depreciation'` untuk backward compatibility
- Status: ✅ Sudah dijalankan

### 2. Model DepreciationFormula
File: `app/Models/DepreciationFormula.php`

**Perubahan:**
- Menambahkan `'type'` ke `$fillable`
- Method baru: `getActiveDepreciationFormula()` - mengambil rumus penyusutan yang aktif
- Method baru: `getActiveAppreciationFormula()` - mengambil rumus apresiasi yang aktif

**Cara Penggunaan:**
```php
$depreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
$appreciationFormula = DepreciationFormula::getActiveAppreciationFormula();
```

### 3. Model Asset
File: `app/Models/Asset.php`

**Perubahan:**
- Method baru: `isAppreciating()` - cek apakah aset termasuk tanah/bangunan
- Update `annualDepreciation()` - menggunakan rumus yang sesuai berdasarkan tipe aset
- Menambahkan `'is_appreciating'` ke `$appends`

**Logika Deteksi:**
```php
public function isAppreciating(): bool
{
    $type = strtolower($this->type ?? '');
    return str_contains($type, 'tanah') || str_contains($type, 'bangunan');
}
```

**Perhitungan:**
- Aset tanah/bangunan: menggunakan rumus apresiasi (nilai naik)
- Aset lainnya: menggunakan rumus penyusutan (nilai turun)

### 4. FormulaController
File: `app/Http/Controllers/FormulaController.php`

**Perubahan:**
- `store()`: menambahkan validasi untuk field `type`
- `activate()`: hanya menonaktifkan rumus dengan tipe yang sama (tidak lagi menonaktifkan semua rumus)

## Perubahan Frontend

### 1. Halaman Manajemen Rumus
File: `resources/js/pages/Formulas/Index.tsx`

**Layout Baru:**
```
┌─────────────────────────────────────────────────────┐
│  RUMUS PENYUSUTAN (Red)  │  RUMUS APRESIASI (Green) │
│  📉 Untuk Aset Umum      │  📈 Untuk Tanah/Bangunan │
│  - Rumus 1               │  - Rumus A               │
│  - Rumus 2               │  - Rumus B               │
└─────────────────────────────────────────────────────┘
```

**Fitur:**
- Dua kolom terpisah dengan warna berbeda
- Form pembuatan rumus dengan dropdown pemilih tipe
- Setiap kolom menampilkan rumus sesuai tipenya
- Badge "Aktif" hanya pada satu rumus per tipe

### 2. Halaman Manajemen Aset
File: `resources/js/pages/Assets/Index.tsx`

**Indikator Visual:**
1. **Kolom Accumulated Depreciation/Appreciation:**
   - Penyusutan: 📉 merah dengan nilai negatif
   - Apresiasi: 📈 hijau dengan nilai positif

2. **Kolom Type:**
   - Badge merah untuk aset penyusutan: 📉 Penyusutan
   - Badge hijau untuk aset apresiasi: 📈 Apresiasi
   - Ditampilkan bersama nama tipe aset

**Contoh Tampilan:**
```
Akumulasi         │  Tipe
📉 -Rp 5.000.000  │  [📉 Penyusutan] Komputer
📈 +Rp 10.000.000 │  [📈 Apresiasi] Tanah
```

## Sample Data

### Rumus Penyusutan (Default)
```
Nama: Garis Lurus
Expression: ({price} - {salvage}) / {life}
Type: depreciation
```

### Rumus Apresiasi (Sample)
```
Nama: Apresiasi Linear 5%
Expression: {price} * (1 + 0.05 * {age})
Type: appreciation
Deskripsi: Kenaikan 5% per tahun
```

## Testing Workflow

### 1. Buat Rumus Apresiasi
1. Buka halaman "Manajemen Rumus"
2. Di form "Buat Rumus Baru", pilih tipe: **Apresiasi (Tanah & Bangunan)**
3. Isi nama dan ekspresi
4. Klik "Simpan Rumus"
5. Rumus akan muncul di kolom hijau sebelah kanan
6. Klik "Gunakan" untuk mengaktifkan

### 2. Tambah Aset Tanah/Bangunan
1. Buka halaman "Manajemen Aset"
2. Klik "Tambah Aset"
3. Isi form dengan Type: **Tanah** atau **Bangunan**
4. Simpan aset
5. Lihat badge hijau 📈 Apresiasi pada list aset
6. Nilai buku akan menampilkan hasil apresiasi (naik)

### 3. Tambah Aset Biasa (Penyusutan)
1. Tambah aset dengan type: **Komputer**, **Kendaraan**, dll
2. Sistem akan otomatis menggunakan rumus penyusutan
3. Badge merah 📉 Penyusutan akan muncul
4. Nilai buku akan menampilkan hasil penyusutan (turun)

## Color Scheme

### Depreciation (Penyusutan)
- Primary: `#EF4444` (Red-500)
- Background: `bg-red-50`
- Text: `text-red-600` / `text-red-700`
- Border: `border-red-200`

### Appreciation (Apresiasi)
- Primary: `#7ACAB0` (Custom Green)
- Background: `bg-green-50`
- Text: `text-green-600` / `text-green-700`
- Border: `border-green-200`

## Variabel Formula

Variabel yang dapat digunakan dalam rumus:
- `{price}` - Harga beli aset
- `{salvage}` - Nilai sisa/residu
- `{life}` - Umur manfaat (tahun)
- `{age}` - Umur aset saat ini (tahun)

## Catatan Penting

1. **Hanya satu rumus aktif per tipe**: Sistem memastikan hanya ada satu rumus depreciation dan satu rumus appreciation yang aktif pada satu waktu.

2. **Deteksi otomatis**: Sistem secara otomatis mendeteksi apakah aset termasuk tanah/bangunan berdasarkan field `type`.

3. **Backward compatibility**: Rumus yang sudah ada akan otomatis mendapat tipe `'depreciation'`.

4. **Perhitungan real-time**: Nilai buku dihitung secara real-time berdasarkan rumus yang aktif dan tipe aset.

## Status Implementasi

- ✅ Migration created and run
- ✅ Model DepreciationFormula updated
- ✅ Model Asset updated
- ✅ FormulaController updated
- ✅ Frontend Formulas page restructured
- ✅ Frontend Assets page with visual indicators
- ✅ Sample formulas seeded
- ✅ Type validation implemented
- ✅ Separate activation per formula type

## Next Steps (Optional Enhancements)

1. **Dashboard Charts**: Update untuk menampilkan appreciation vs depreciation secara terpisah
2. **Reports**: Pisahkan laporan untuk aset apresiasi dan penyusutan
3. **Export/Import**: Pastikan kolom `type` ter-include dalam Excel export/import
4. **Audit Log**: Track perubahan aktivasi formula berdasarkan tipe
