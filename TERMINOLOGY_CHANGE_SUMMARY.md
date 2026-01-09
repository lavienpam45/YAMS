# PERUBAHAN TERMINOLOGI: "Nilai Buku" → "Harga Saat Ini"

## Tanggal: 9 Januari 2026

---

## 📝 RINGKASAN

Berdasarkan permintaan user, semua kata **"Nilai Buku"** telah diganti menjadi **"Harga Saat Ini"** di seluruh tampilan user-facing.

---

## ✅ FILE YANG DIUBAH

### **1. Frontend Pages (React/TypeScript)**

#### **A. Dashboard (`resources/js/pages/dashboard.tsx`)**
```diff
- title="Nilai Buku Terkini"
+ title="Harga Saat Ini"

- <th>Nilai Buku</th>
+ <th>Harga Saat Ini</th>
```

#### **B. Asset Detail (`resources/js/pages/Assets/Show.tsx`)**
```diff
- label="Nilai Buku Tersimpan"
+ label="Harga Saat Ini Tersimpan"

- <th>Nilai Buku Awal</th>
- <th>Nilai Buku Akhir</th>
+ <th>Harga Awal</th>
+ <th>Harga Akhir</th>
```

#### **C. Reports Page (`resources/js/pages/Reports/Index.tsx`)**
```diff
- Total Nilai Buku
+ Total Harga Saat Ini

- <th>Nilai Buku</th>
+ <th>Harga Saat Ini</th>

- <th>Nilai Buku Awal</th>
- <th>Nilai Buku Akhir</th>
+ <th>Harga Awal</th>
+ <th>Harga Akhir</th>
```

#### **D. Landing Page (`resources/js/pages/welcome.tsx`)**
```diff
- Laporan mencakup nilai buku aset...
+ Laporan mencakup harga aset saat ini...
```

---

### **2. Reports & Exports**

#### **E. PDF Report (`resources/views/reports/assets-pdf.blade.php`)**
```diff
- <th>Nilai Buku</th>
+ <th>Harga Saat Ini</th>
```

#### **F. Excel Export (`app/Exports/AssetsExport.php`)**
```diff
- 'Nilai Buku',
+ 'Harga Saat Ini',
```

---

## 📊 PERUBAHAN VISUAL YANG TERLIHAT USER

### **Dashboard:**
```
SEBELUM:
╔═══════════════════════════════════╗
║ Total Nilai Buku Terkini          ║
║ Rp 320.000.000                    ║
╚═══════════════════════════════════╝

SESUDAH:
╔═══════════════════════════════════╗
║ Harga Saat Ini                    ║
║ Rp 320.000.000                    ║
╚═══════════════════════════════════╝
```

### **Asset Detail Page:**
```
SEBELUM:
┌─────────────────────────────────┐
│ Nilai Buku Tersimpan            │
│ Rp 12.100.000                   │
│                                 │
│ Riwayat Penyusutan:             │
│ Tahun | Nilai Buku Awal | ...   │
└─────────────────────────────────┘

SESUDAH:
┌─────────────────────────────────┐
│ Harga Saat Ini Tersimpan        │
│ Rp 12.100.000                   │
│                                 │
│ Riwayat Penyusutan:             │
│ Tahun | Harga Awal | ...        │
└─────────────────────────────────┘
```

### **Reports:**
```
SEBELUM:
Total Nilai Buku: Rp 320.000.000

Table Header:
| Nama | Harga Beli | Nilai Buku |

SESUDAH:
Total Harga Saat Ini: Rp 320.000.000

Table Header:
| Nama | Harga Beli | Harga Saat Ini |
```

### **Excel Export:**
```
SEBELUM:
| Nama | Harga Beli | Nilai Buku | Penyusutan |

SESUDAH:
| Nama | Harga Beli | Harga Saat Ini | Penyusutan |
```

---

## 🔍 YANG TIDAK DIUBAH

### **Backend Code (Tetap menggunakan `book_value`):**
```php
// Database column names (TIDAK DIUBAH):
- current_book_value
- book_value_start
- book_value_end

// Variable names (TIDAK DIUBAH):
$asset->book_value
$asset->current_book_value
$bookValue

// Method names (TIDAK DIUBAH):
protected function bookValue()
```

**Alasan:**
- Mengubah nama column/variable di backend berisiko break system
- Istilah "book_value" adalah standar akuntansi internasional
- User hanya perlu lihat "Harga Saat Ini" di tampilan, backend tetap pakai istilah teknis

---

## ✅ TESTING CHECKLIST

Setelah perubahan ini, pastikan:

- [ ] Dashboard menampilkan "Harga Saat Ini" (bukan "Nilai Buku")
- [ ] Asset detail page menampilkan "Harga Saat Ini Tersimpan"
- [ ] Reports menampilkan "Total Harga Saat Ini"
- [ ] Table headers di reports: "Harga Awal" dan "Harga Akhir"
- [ ] PDF export menampilkan "Harga Saat Ini"
- [ ] Excel export menampilkan "Harga Saat Ini"
- [ ] Landing page FAQ tidak mention "nilai buku"

---

## 🎯 DAMPAK

### **User Experience:**
✅ Lebih mudah dipahami (bahasa lebih sederhana)  
✅ Tidak perlu penjelasan istilah "nilai buku"  
✅ Lebih intuitif untuk non-akuntan  

### **Technical:**
✅ Backend tetap konsisten (pakai standar akuntansi)  
✅ Database schema tidak berubah (aman)  
✅ API response tetap sama  
✅ Hanya label di frontend yang berubah  

---

## 📌 CATATAN

Jika di masa depan ingin mengubah juga backend (database column names), perlu:
1. Create migration untuk rename columns
2. Update semua Model properties
3. Update semua Controller logic
4. Update API responses
5. Regression testing lengkap

**Untuk sekarang, cukup ubah tampilan user-facing saja (sudah selesai ✅)**

---

**Status:** ✅ SELESAI  
**Files Modified:** 6 files  
**Lines Changed:** ~15 lines  
**Breaking Changes:** NONE  
**Safe to Deploy:** YES
