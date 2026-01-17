# 📘 MANUAL BOOK - YAMS (Yet Another Management System)
## Sistem Manajemen Aset dengan Depresiasi/Apresiasi Otomatis

**Versi:** 1.0  
**Tanggal:** 17 Januari 2026  
**Platform:** Web Application (Laravel + React)

---

## 📑 DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Persyaratan Sistem](#2-persyaratan-sistem)
3. [Instalasi & Setup](#3-instalasi--setup)
4. [Login & Autentikasi](#4-login--autentikasi)
5. [Dashboard](#5-dashboard)
6. [Manajemen Aset](#6-manajemen-aset)
7. [Manajemen Rumus](#7-manajemen-rumus)
8. [Kalkulator Depresiasi](#8-kalkulator-depresiasi)
9. [Laporan](#9-laporan)
10. [Manajemen User](#10-manajemen-user)
11. [Pengaturan (Settings)](#11-pengaturan-settings)
12. [Notifikasi](#12-notifikasi)
13. [Troubleshooting](#13-troubleshooting)
14. [FAQ](#14-faq)

---

## 1. PENDAHULUAN

### 1.1 Tentang YAMS

YAMS (Yet Another Management System) adalah sistem manajemen aset digital yang dirancang untuk membantu organisasi dalam:

- **Mengelola inventaris aset** (barang, peralatan, tanah, bangunan)
- **Menghitung depresiasi otomatis** untuk aset yang nilainya menurun
- **Menghitung apresiasi otomatis** untuk aset yang nilainya meningkat (tanah/bangunan)
- **Melacak riwayat nilai aset** dari tahun ke tahun
- **Menghasilkan laporan** dalam format Excel dan PDF

### 1.2 Fitur Utama

✅ **CRUD Aset Lengkap**
- Tambah, edit, hapus, dan lihat detail aset
- Upload foto aset
- Import data dari Excel/CSV

✅ **Dual System: Depresiasi & Apresiasi**
- Depresiasi untuk aset umum (komputer, printer, mobil, dll)
- Apresiasi untuk tanah dan bangunan

✅ **Formula Dinamis**
- Admin dapat membuat rumus perhitungan custom
- Support variabel: harga beli, nilai sisa, umur manfaat, umur aset
- Aktivasi rumus otomatis recalculate semua aset

✅ **Custom Rate per Aset**
- User dapat set persentase custom untuk aset tertentu
- Tidak terpengaruh oleh perubahan formula sistem

✅ **Auto-Depreciation System**
- Scheduler otomatis hitung ulang nilai aset setiap hari
- Fallback mechanism jika scheduler gagal
- Notifikasi real-time ke admin

✅ **Reporting & Analytics**
- Dashboard dengan chart interaktif
- Export laporan ke Excel/PDF
- Filter berdasarkan kategori dan sorting

✅ **Role-Based Access**
- Superadmin: Full access
- Admin: Manage aset dan rumus
- User: View reports only

---

## 2. PERSYARATAN SISTEM

### 2.1 Server Requirements

**Minimum:**
- PHP 8.2 atau lebih tinggi
- MySQL 8.0+ atau MariaDB 10.3+
- Node.js 18+ dan npm 9+
- Composer 2.0+

**Recommended:**
- PHP 8.3
- MySQL 8.0+
- Node.js 20 LTS
- 2GB RAM
- 10GB Storage

### 2.2 Browser Requirements

**Supported Browsers:**
- Google Chrome 90+ ✅ (Recommended)
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

**Not Supported:**
- Internet Explorer (any version)

---

## 3. INSTALASI & SETUP

### 3.1 Clone Repository

```bash
git clone https://github.com/your-repo/yams2.git
cd yams2
```

### 3.2 Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3.3 Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3.4 Database Configuration

Edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yams_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3.5 Database Migration

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE yams_db"

# Run migrations
php artisan migrate

# Seed initial data (optional)
php artisan db:seed
```

### 3.6 Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 3.7 Run Application

**Development:**
```bash
php artisan serve
# Access: http://localhost:8000
```

**Production:**
- Setup web server (Apache/Nginx)
- Point document root ke `/public`

### 3.8 Setup Scheduler (PENTING!)

**Windows (Task Scheduler):**
1. Buka Task Scheduler
2. Create Task:
   - Name: "YAMS Auto Depreciation"
   - Trigger: Daily, repeat every 1 minute
   - Action: `C:\php\php.exe artisan schedule:run`
   - Start in: `C:\path\to\yams2`

**Linux/Mac (Crontab):**
```bash
crontab -e

# Tambahkan:
* * * * * cd /path/to/yams2 && php artisan schedule:run >> /dev/null 2>&1
```

---

## 4. LOGIN & AUTENTIKASI

### 4.1 Halaman Login

**URL:** `/login`

**Form Login:**
- Email
- Password
- Remember Me (optional)

**Fitur:**
- ✅ Validation real-time
- ✅ Error messages jika gagal
- ✅ Redirect ke dashboard setelah berhasil

### 4.2 Register (Jika Diaktifkan)

**URL:** `/register`

**Form Register:**
- Name
- Email
- Password
- Password Confirmation

**Note:** Admin dapat menonaktifkan registrasi publik di config.

### 4.3 Forgot Password

**URL:** `/forgot-password`

**Proses:**
1. Input email
2. Sistem kirim link reset password
3. Klik link di email
4. Set password baru

### 4.4 Two-Factor Authentication (2FA)

**Setup 2FA:**
1. Login → Pengaturan
2. Klik "Enable Two-Factor Authentication"
3. Scan QR code dengan Google Authenticator
4. Save recovery codes (PENTING!)

**Login dengan 2FA:**
1. Input email & password
2. Input 6-digit code dari authenticator
3. Login berhasil

---

## 5. DASHBOARD

### 5.1 Overview

**URL:** `/dashboard`

**Akses:** Semua user (superadmin, admin, user)

### 5.2 Summary Cards

Dashboard menampilkan 4 kartu ringkasan:

1. **Total Aset**
   - Jumlah total aset dalam sistem
   - Icon: 🏢

2. **Total Nilai Aset**
   - Total harga beli semua aset
   - Format: Rp XXX juta/miliar
   - Icon: 💵

3. **Total Penyusutan**
   - Total akumulasi penyusutan/kenaikan
   - Format: Rp XXX juta/miliar
   - Icon: 💰

4. **Harga Saat Ini**
   - Total nilai aset saat ini (setelah depresiasi/apresiasi)
   - Format: Rp XXX juta/miliar
   - Icon: 💳

### 5.3 Grafik

**A. Pie Chart: Aset per Kategori**
- Menampilkan distribusi aset berdasarkan tipe
- Contoh: Komputer (10), Printer (5), Tanah (2)
- Warna berbeda per kategori

**B. Bar Chart: Aset per Lokasi**
- Menampilkan distribusi aset berdasarkan lokasi
- Horizontal bar chart
- Sort by jumlah terbanyak

### 5.4 Tabel Aset Terbaru

**Kolom:**
- No
- Nama Barang
- Harga Saat Ini
- Kondisi (Badge: Baik/Rusak Ringan/Rusak Berat)
- Lokasi

**Fitur:**
- Pagination (10 item per page)
- Sortable
- Clickable row (go to detail)

---

## 6. MANAJEMEN ASET

### 6.1 Daftar Aset

**URL:** `/assets`

**Akses:** Superadmin, Admin

#### 6.1.1 Tabel Aset

**Kolom:**
- Kode Aset (AKT-XXX)
- Nama Barang
- Tipe
- Lokasi
- Kondisi
- Harga Beli
- Harga Saat Ini
- Aksi (Lihat, Edit, Hapus)

#### 6.1.2 Fitur Filter & Search

**Search:**
- Cari berdasarkan nama, kode aset, atau serial number
- Real-time search dengan debounce

**Sort:**
- Sort by: ID, Tipe, Tanggal Terima
- Direction: Ascending/Descending

**Pagination:**
- 10 item per page
- Navigate dengan tombol prev/next

#### 6.1.3 Import Data

**Format Supported:** Excel (.xlsx, .xls), CSV

**Kolom Required:**
```
name, room_name, asset_code, unit_code, received_date,
purchase_price, useful_life, salvage_value, type,
brand, serial_number, quantity, status, description
```

**Cara Import:**
1. Klik tombol "Import"
2. Pilih file
3. Upload
4. Sistem proses di background
5. Notifikasi setelah selesai

---

### 6.2 Tambah Aset Baru

**URL:** `/assets/create`

#### 6.2.1 Form Input

**Informasi Dasar:**
- Nama Barang (required)
- Nama Ruang (optional)
- Lokasi (optional)
- Lantai (optional)

**Kode Aset (Auto-Generated):**
- Kode Aktiva: AKT-XXX (auto)
- Kode Satuan: SAT-XXX (auto)

**Informasi Aset:**
- Tanggal Terima (required)
- Tipe/Kategori (required)
- Merk/Brand (optional)
- Serial Number (optional)
- Jumlah (required, default: 1)

**Informasi Finansial:**
- Harga Beli (required, in Rupiah)
- Umur Manfaat (required, in years)
- Nilai Sisa (required, default: 0)

**Tipe Perhitungan:**
- Penyusutan (Depreciation) - untuk aset umum
- Apresiasi (Appreciation) - untuk tanah/bangunan

**Persentase Custom (Optional):**
- Input: 0-100%
- Jika diisi, aset tidak terpengaruh oleh formula sistem
- Jika kosong, aset mengikuti formula aktif

**Kondisi & Status:**
- Kondisi: Baik / Rusak Ringan / Rusak Berat
- Status Inventaris: Tercatat / Dalam Proses / dll

**Informasi Tambahan:**
- Pengguna (optional)
- Keterangan (optional)
- Foto Aset (optional, max 2MB)

#### 6.2.2 Logika Auto-Calculation

**Saat Menyimpan:**

1. **Jika aset baru (umur = 0):**
   - `current_book_value = purchase_price`
   - Tidak ada perhitungan depresiasi

2. **Jika aset sudah punya umur (misal received_date = 2 tahun lalu):**
   - Sistem hitung umur: `ageYears = 2.0`
   - Pilih custom rate atau formula
   - Hitung nilai saat ini berdasarkan umur
   - Set `current_book_value` dengan hasil perhitungan
   - Kirim notifikasi ke admin

**Contoh:**
```
Input:
- Nama: Komputer
- Tanggal Terima: 1 Jan 2024 (2 tahun lalu)
- Harga Beli: Rp 10,000,000
- Umur Manfaat: 5 tahun
- Nilai Sisa: Rp 0
- Tipe: Penyusutan
- Custom Rate: 20% per tahun

Perhitungan:
- Age: 2 tahun
- Annual Depreciation: 10,000,000 × 20% = 2,000,000
- Total Depreciation: 2,000,000 × 2 = 4,000,000
- Current Book Value: 10,000,000 - 4,000,000 = Rp 6,000,000 ✅

Hasil:
- Aset tersimpan dengan current_book_value = Rp 6,000,000
- Notifikasi: "Nilai aset dihitung berdasarkan umur 2 tahun"
```

#### 6.2.3 Upload Foto

**Spesifikasi:**
- Format: JPG, PNG, JPEG
- Max size: 2MB
- Auto-resize jika terlalu besar
- Disimpan di: `/storage/app/public/asset-photos/`

**Preview:**
- Thumbnail preview sebelum upload
- Crop/resize (future feature)

---

### 6.3 Edit Aset

**URL:** `/assets/{id}/edit`

#### 6.3.1 Form Edit

Form sama dengan form tambah aset, dengan data pre-filled.

#### 6.3.2 Auto-Recalculation

**Trigger Recalculation:**

Sistem otomatis **recalculate nilai aset** jika user mengubah:

1. **Tipe Perhitungan** (depreciation ↔ appreciation)
2. **Tanggal Terima** (received_date)
3. **Custom Rate** (persentase)
4. **Harga Beli** (purchase_price)
5. **Umur Manfaat** (useful_life)
6. **Nilai Sisa** (salvage_value)

**Proses Recalculation:**
```
1. Deteksi perubahan critical
2. Hitung umur aset saat ini
3. Ambil formula/custom rate yang sesuai
4. Hitung nilai baru
5. Update current_book_value
6. Reset last_depreciation_date ke NULL
7. Kirim notifikasi ke admin
```

**Contoh:**
```
Sebelum Edit:
- Tanah Kampus
- Tipe: Apresiasi
- Harga Beli: Rp 500,000,000
- Umur: 2 tahun
- Current Value: Rp 550,000,000

User Edit:
- Ubah Tipe ke: Penyusutan
- Save

Sistem Auto-Recalculate:
- Deteksi: tipe berubah dari apresiasi → penyusutan
- Hitung dengan formula depreciation
- New Value: Rp 400,000,000 (turun, bukan naik)
- Notifikasi: "Nilai aset dihitung ulang karena: tipe perhitungan berubah"
```

#### 6.3.3 Edit Foto

**Ganti Foto:**
1. Upload foto baru
2. Sistem otomatis hapus foto lama
3. Save foto baru

**Hapus Foto:**
- Klik tombol "Remove Photo"
- Foto terhapus dari storage

---

### 6.4 Detail Aset

**URL:** `/assets/{id}`

#### 6.4.1 Layout

**Hero Section:**
- Foto aset (full width)
- Jika tidak ada foto: placeholder image

**Info Cards:**

**A. Informasi Umum**
- Kode Aktiva
- Kode Satuan
- Nama Ruang / Lokasi
- Lokasi
- Lantai
- Pengguna
- Status Inventaris
- Kondisi
- Tanggal Terima
- Jumlah
- Merk / Brand
- Tipe
- Tipe Perhitungan (📈 Kenaikan / 📉 Penyusutan)
- Persentase Custom
- Serial Number
- Keterangan

**B. Informasi Finansial**
- Harga Beli
- Masa Manfaat (X Tahun)
- Nilai Sisa
- **Akumulasi Penyusutan/Kenaikan** (label dinamis)
- **Harga Saat Ini** (dari current_book_value)
- Terakhir Diperbarui

**C. Riwayat Penyusutan/Kenaikan**

Tabel dengan kolom:
- Tahun
- Harga Awal
- Penyusutan/Kenaikan Tahun Ini (warna hijau jika naik, merah jika turun)
- Harga Akhir

**Contoh:**

| Tahun | Harga Awal | Perubahan Tahun Ini | Harga Akhir |
|-------|-----------|---------------------|-------------|
| 2026 | Rp 6,000,000 | -Rp 2,000,000 | Rp 4,000,000 |
| 2025 | Rp 8,000,000 | -Rp 2,000,000 | Rp 6,000,000 |
| 2024 | Rp 10,000,000 | -Rp 2,000,000 | Rp 8,000,000 |

**Note:**
- Negatif (hijau) = Kenaikan (appreciation)
- Positif (merah) = Penyusutan (depreciation)

#### 6.4.2 Tombol Aksi

- **Kembali** - Kembali ke daftar aset
- **Edit** - Edit aset ini
- **Hapus** - Hapus aset (dengan konfirmasi)

---

### 6.5 Hapus Aset

**Proses:**
1. Klik tombol "Hapus"
2. Konfirmasi modal: "Apakah Anda yakin?"
3. Klik "Ya, Hapus"
4. Sistem hapus:
   - Data aset dari database
   - Foto terkait dari storage
   - Riwayat depresiasi terkait
5. Redirect ke daftar aset
6. Notifikasi: "Aset berhasil dihapus"
7. Admin menerima notifikasi

---

## 7. MANAJEMEN RUMUS

### 7.1 Overview

**URL:** `/formulas`

**Akses:** Superadmin, Admin

**Fungsi:**
- Buat rumus perhitungan custom
- Aktifkan rumus untuk semua aset
- Hapus rumus yang tidak terpakai

### 7.2 Daftar Rumus

#### 7.2.1 Layout Dual Column

**Kolom Kiri: Rumus Penyusutan**
- Background: Merah muda
- Icon: 📉
- Deskripsi: "Untuk aset selain tanah dan bangunan"

**Kolom Kanan: Rumus Apresiasi**
- Background: Hijau muda
- Icon: 📈
- Deskripsi: "Untuk aset tanah dan bangunan"

#### 7.2.2 Card Rumus

**Informasi:**
- Nama Rumus (contoh: "Garis Lurus")
- Ekspresi Matematika (contoh: `({price} - {salvage}) / {life}`)
- Badge "Aktif" (jika rumus sedang digunakan)

**Tombol:**
- **Gunakan** - Aktifkan rumus ini (hanya untuk rumus non-aktif)
- **Hapus** - Hapus rumus (dengan konfirmasi)

---

### 7.3 Buat Rumus Baru

#### 7.3.1 Form Input

**Tipe Rumus:**
- Penyusutan (untuk aset umum)
- Apresiasi (untuk tanah/bangunan)

**Nama Rumus:**
- Contoh: "Garis Lurus", "Double Declining", "Sum of Years Digits"

**Ekspresi Matematika:**
- Input formula dengan variabel

#### 7.3.2 Variabel yang Tersedia

| Variabel | Deskripsi | Contoh Nilai |
|----------|-----------|--------------|
| `{price}` | Harga Beli | 100,000,000 |
| `{salvage}` | Nilai Sisa | 10,000,000 |
| `{life}` | Umur Manfaat (Tahun) | 5 |
| `{age}` | Umur Aset Saat Ini (Tahun) | 2.5 |

#### 7.3.3 Contoh Rumus

**1. Straight Line (Garis Lurus)**
```
Formula: ({price} - {salvage}) / {life}
Contoh: (100,000,000 - 10,000,000) / 5 = 18,000,000 per tahun
```

**2. Double Declining Balance**
```
Formula: {price} * (2 / {life})
Contoh: 100,000,000 * (2 / 5) = 40,000,000 per tahun
```

**3. Sum of Years Digits**
```
Formula: ({price} - {salvage}) * ({life} - {age} + 1) / ({life} * ({life} + 1) / 2)
Complex calculation
```

**4. Appreciation (5% per tahun)**
```
Formula: {price} * 0.05
Contoh: 500,000,000 * 0.05 = 25,000,000 per tahun
```

**5. Total Depreciation (menggunakan {age})**
```
Formula: ({price} - {salvage}) / {life} * {age}
Contoh: (100,000,000 - 0) / 5 * 2.5 = 50,000,000 total
```

#### 7.3.4 PENTING: Formula dengan vs tanpa {age}

**Formula DENGAN {age}:**
- Hasil = **TOTAL** depreciation/appreciation
- Sistem **TIDAK** kalikan lagi dengan age
- Contoh: `({price} - {salvage}) / {life} * {age}`

**Formula TANPA {age}:**
- Hasil = **ANNUAL** depreciation/appreciation
- Sistem **kalikan dengan age** untuk dapat total
- Contoh: `({price} - {salvage}) / {life}`

**Rekomendasi:**
- Gunakan formula TANPA {age} untuk simplicity
- Sistem otomatis handle multiplication dengan age

---

### 7.4 Aktivasi Rumus

#### 7.4.1 Proses Aktivasi

**Step-by-step:**
1. Klik tombol "Gunakan" pada rumus yang diinginkan
2. Sistem:
   - Set semua rumus dengan tipe yang sama ke non-aktif
   - Set rumus dipilih ke aktif
   - **Recalculate SEMUA aset** yang sesuai dengan tipe rumus
3. Notifikasi: "Rumus diaktifkan dan X aset telah dihitung ulang"

#### 7.4.2 Auto-Recalculation Detail

**Filter Aset:**
- Untuk rumus depreciation → recalculate aset dengan `depreciation_type = 'depreciation'`
- Untuk rumus appreciation → recalculate aset dengan `depreciation_type = 'appreciation'`

**Aset yang DI-SKIP:**
- ❌ Aset dengan custom rate (tidak terpengaruh oleh formula)
- ❌ Aset tanpa received_date

**Aset yang DI-RECALCULATE:**
- ✅ Semua aset dengan tipe yang sama
- ✅ Termasuk aset yang baru di-edit manual
- ✅ Nilai di-update ke database
- ✅ History di-update

**Contoh:**
```
Aktifkan rumus depreciation "Straight Line 25%"

Aset yang di-recalculate:
✅ Komputer A (depreciation_type = 'depreciation')
✅ Printer B (depreciation_type = 'depreciation')
✅ Mobil C (depreciation_type = 'depreciation')
⏭️ Tanah D (depreciation_type = 'appreciation') - SKIP (beda tipe)
⏭️ Server E (custom_rate = 15%) - SKIP (pakai custom)

Hasil:
- 3 aset dihitung ulang
- Notifikasi: "Rumus diaktifkan dan 3 aset telah dihitung ulang"
```

---

### 7.5 Hapus Rumus

**Proses:**
1. Klik tombol "Hapus"
2. Konfirmasi: "Apakah Anda yakin?"
3. Klik "Ya, Hapus"
4. Rumus terhapus dari database

**PERINGATAN:**
- ❌ Tidak bisa hapus rumus yang sedang aktif
- ✅ Hanya bisa hapus rumus non-aktif

**Rekomendasi:**
- Aktifkan rumus lain terlebih dahulu
- Baru hapus rumus lama

---

## 8. KALKULATOR DEPRESIASI

### 8.1 Overview

**URL:** `/calculator`

**Akses:** Superadmin, Admin

**Fungsi:**
- Test formula sebelum diterapkan
- Simulasi perhitungan depresiasi/apresiasi
- Bandingkan hasil berbagai formula

### 8.2 Form Kalkulator

**Input:**
- Pilih Formula (dropdown)
- Harga Beli (Rupiah)
- Nilai Sisa (Rupiah)
- Umur Manfaat (Tahun)
- Umur Aset Saat Ini (Tahun)

**Output:**
- Annual Depreciation/Appreciation
- Total Depreciation/Appreciation
- Current Book Value

**Contoh:**
```
Input:
- Formula: Straight Line
- Harga Beli: Rp 100,000,000
- Nilai Sisa: Rp 10,000,000
- Umur Manfaat: 5 tahun
- Umur Aset: 2.5 tahun

Formula: ({price} - {salvage}) / {life}
= (100,000,000 - 10,000,000) / 5
= 18,000,000 per tahun

Hasil:
- Annual Depreciation: Rp 18,000,000
- Total (2.5 tahun): Rp 45,000,000
- Current Book Value: Rp 55,000,000
```

---

## 9. LAPORAN

### 9.1 Overview

**URL:** `/reports`

**Akses:** Superadmin, Admin, User

### 9.2 Summary Cards

Sama dengan dashboard:
1. Total Aset
2. Total Harga Beli
3. Total Harga Saat Ini

### 9.3 Filter & Sort

**Filter Tipe:**
- Semua (default)
- Komputer
- Printer
- Mobil
- Tanah
- Bangunan
- dll (sesuai data)

**Urutkan:**
- Default (ID)
- Tahun Pembelian
- Kategori
- Lokasi

### 9.4 Tabel Laporan

**Kolom:**
- ID (ASSET-XXX)
- Nama Barang
- Tipe
- Tahun (dari received_date)
- Lokasi
- Harga Saat Ini

**Pagination:**
- 15 item per page

### 9.5 Export Laporan

#### 9.5.1 Export ke Excel

**Format:** .xlsx

**Kolom:**
1. ID
2. Nama Barang
3. Nama Ruang
4. Kode Aktiva
5. Kode Satuan
6. Tanggal Terima
7. Harga Beli
8. Masa Manfaat (Tahun)
9. Nilai Sisa
10. Akumulasi Penyusutan
11. Harga Saat Ini
12. Tipe
13. Merk
14. Serial Number
15. Jumlah
16. Kondisi
17. Keterangan
18. Pengguna
19. Status Inventaris

**File Name:** `laporan-aset.xlsx`

**Cara Download:**
1. Set filter (optional)
2. Klik tombol "Export Excel"
3. File otomatis download

#### 9.5.2 Export ke PDF

**Format:** .pdf (Landscape, A4)

**Kolom (Simplified):**
1. No
2. Ruang
3. Kode
4. Nama Barang
5. Tgl Terima
6. Merk
7. Kondisi
8. Harga Saat Ini

**Header:**
- Judul: "Laporan Aset YAMS"
- Tanggal Cetak: DD/MM/YYYY

**File Name:** `laporan-aset-YYYYMMDD.pdf`

**Cara Download:**
1. Set filter (optional)
2. Klik tombol "Export PDF"
3. File otomatis download

---

## 10. MANAJEMEN USER

### 10.1 Overview

**URL:** `/users`

**Akses:** Superadmin only

### 10.2 Daftar User

**Kolom:**
- Avatar (gambar atau initial)
- Nama
- Email
- Role (Badge)
- Status (Active/Inactive)
- Aksi (Edit, Hapus)

### 10.3 Tambah User

**Form:**
- Name (required)
- Email (required, unique)
- Password (required, min 8 char)
- Password Confirmation (required)
- Role (required): Superadmin / Admin / User

**Role Permissions:**

| Feature | Superadmin | Admin | User |
|---------|------------|-------|------|
| Dashboard | ✅ | ✅ | ✅ |
| Lihat Aset | ✅ | ✅ | ❌ |
| Tambah/Edit Aset | ✅ | ✅ | ❌ |
| Hapus Aset | ✅ | ✅ | ❌ |
| Manajemen Rumus | ✅ | ✅ | ❌ |
| Kalkulator | ✅ | ✅ | ❌ |
| Laporan | ✅ | ✅ | ✅ |
| Manajemen User | ✅ | ❌ | ❌ |
| Pengaturan | ✅ | ✅ | ✅ |

### 10.4 Edit User

**Form:**
- Name
- Email
- Password (optional, kosongkan jika tidak diubah)
- Role

### 10.5 Hapus User

**Proses:**
1. Klik "Hapus"
2. Konfirmasi
3. User dihapus dari database

**PERINGATAN:**
- ❌ Tidak bisa hapus diri sendiri
- ❌ Tidak bisa hapus user terakhir dengan role superadmin

---

## 11. PENGATURAN (SETTINGS)

### 11.1 Overview

**URL:** `/settings`

**Akses:** Semua user (authenticated)

### 11.2 Profil User

**Form:**
- Name
- Email
- Avatar (upload foto profil)

**Upload Avatar:**
- Format: JPG, PNG
- Max size: 1MB
- Auto-crop to circle

### 11.3 Ubah Password

**Form:**
- Current Password (required)
- New Password (required, min 8 char)
- Confirm New Password (required)

**Validation:**
- Current password harus benar
- New password minimal 8 karakter
- Confirmation harus match

### 11.4 Two-Factor Authentication

**Enable 2FA:**
1. Klik "Enable Two-Factor Authentication"
2. Scan QR code dengan Google Authenticator
3. Input 6-digit code untuk verify
4. **PENTING:** Save recovery codes ke tempat aman
5. 2FA aktif

**Disable 2FA:**
1. Klik "Disable Two-Factor Authentication"
2. Input password untuk konfirmasi
3. 2FA nonaktif

**Recovery Codes:**
- Gunakan jika kehilangan akses ke authenticator
- Setiap code hanya bisa dipakai 1x
- Generate ulang jika sudah habis

---

## 12. NOTIFIKASI

### 12.1 Notification Bell

**Location:** Top-right corner (header)

**Badge:**
- Merah dengan angka (jika ada unread)
- Abu-abu jika semua sudah dibaca

### 12.2 Dropdown Notifikasi

**Klik Bell Icon:**
- Dropdown muncul
- Maksimal 10 notifikasi terbaru
- Unread di-highlight dengan background

**Item Notifikasi:**
- Icon (sesuai tipe)
- Title (bold)
- Message
- Timestamp (relative: "2 menit lalu")

**Tipe Notifikasi:**
- 🆕 Success (hijau) - Aset baru, rumus diaktifkan
- ℹ️ Info (biru) - Update aset, recalculation
- ⚠️ Warning (kuning) - Hapus aset

**Aksi:**
- Klik notifikasi → Mark as read & navigate ke detail
- Klik "Mark All as Read" → Semua jadi read

### 12.3 Halaman Notifikasi

**URL:** `/notifications`

**Fitur:**
- List semua notifikasi (dengan pagination)
- Filter: All / Unread / Read
- Sort: Terbaru / Terlama
- Mark as read individual
- Mark all as read
- Delete notifikasi

### 12.4 Trigger Notifikasi

**Admin menerima notifikasi ketika:**
1. ✅ Aset baru ditambahkan
2. ✅ Aset diupdate (dengan recalculation)
3. ✅ Aset dihapus
4. ✅ Rumus baru diaktifkan (+ jumlah aset yang di-recalculate)
5. ✅ Auto-depreciation berjalan (setiap hari jam 00:01)
6. ✅ Nilai aset dihitung ulang (saat edit)

---

## 13. TROUBLESHOOTING

### 13.1 Auto-Depreciation Tidak Jalan

**Gejala:**
- Scheduler tidak update nilai aset
- Tidak ada notifikasi setiap hari

**Solusi:**

**1. Cek Scheduler:**
```bash
# Windows
# Cek Task Scheduler → YAMS Auto Depreciation → Status

# Linux/Mac
crontab -l
# Pastikan ada: * * * * * cd /path/to/yams2 && php artisan schedule:run
```

**2. Test Manual:**
```bash
php artisan assets:run-depreciation
# Jika berhasil, cek output: "✓ X aset berhasil diperbarui"
```

**3. Cek Log:**
```bash
# Windows
Get-Content storage\logs\laravel.log -Tail 50

# Linux/Mac
tail -f storage/logs/laravel.log
```

**4. Cek Cache:**
```bash
php artisan tinker
>>> Cache::get('depreciation_last_run_' . today()->toDateString())
# Jika ada value, scheduler sudah run hari ini
```

---

### 13.2 Nilai Aset Salah / Overflow

**Gejala:**
- Current book value = Rp 10 triliun (sangat besar)
- Error: "Numeric value out of range"

**Penyebab:**
- Formula menggunakan `{age}` tapi sistem kalikan lagi dengan age (double multiplication)

**Solusi:**
✅ **Sudah diperbaiki di versi 1.0**

**Jika masih terjadi:**
1. Cek formula yang aktif
2. Pastikan tidak ada formula dengan multiple `{age}` nested
3. Edit aset → Save ulang (trigger recalculation)

---

### 13.3 Rumus Tidak Bekerja

**Gejala:**
- Aktivasi rumus tidak recalculate aset
- Aset masih pakai nilai lama

**Solusi:**

**1. Cek Tipe Rumus vs Tipe Aset:**
```
Rumus Depreciation → Hanya untuk aset dengan depreciation_type = 'depreciation'
Rumus Appreciation → Hanya untuk aset dengan depreciation_type = 'appreciation'
```

**2. Cek Custom Rate:**
- Aset dengan custom rate tidak terpengaruh oleh formula
- Edit aset → Hapus custom rate → Save

**3. Force Recalculate:**
```bash
php artisan assets:recalculate
# (Jika command tersedia)
```

---

### 13.4 Import Excel Gagal

**Gejala:**
- Upload file berhasil tapi data tidak masuk
- Error: "Invalid column format"

**Solusi:**

**1. Cek Format Kolom:**
- Pastikan kolom sesuai dengan template
- Download template dari sistem

**2. Cek Data Type:**
- `purchase_price`: Angka (bukan text)
- `received_date`: Format tanggal (YYYY-MM-DD)
- `useful_life`: Integer

**3. Cek Encoding:**
- File harus UTF-8
- Tidak ada special characters

---

### 13.5 Foto Tidak Muncul

**Gejala:**
- Upload foto berhasil tapi tidak tampil
- Broken image icon

**Solusi:**

**1. Cek Storage Link:**
```bash
php artisan storage:link
# Buat symbolic link dari storage/app/public ke public/storage
```

**2. Cek Permission:**
```bash
# Linux/Mac
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Windows
# Klik kanan folder → Properties → Security → Full Control
```

**3. Cek File Exists:**
```bash
ls -la storage/app/public/asset-photos/
# Pastikan file ada
```

---

### 13.6 Login Error "Too Many Attempts"

**Gejala:**
- Error: "Too many login attempts. Please try again in X seconds."

**Penyebab:**
- Laravel throttle login (max 5 attempts per minute)

**Solusi:**
1. Tunggu 1 menit
2. Clear cache (optional):
   ```bash
   php artisan cache:clear
   ```
3. Coba login lagi

---

### 13.7 Database Connection Error

**Gejala:**
- Error: "SQLSTATE[HY000] [2002] Connection refused"

**Solusi:**

**1. Cek MySQL Service:**
```bash
# Windows
services.msc → MySQL → Start

# Linux
sudo service mysql start

# Mac
brew services start mysql
```

**2. Cek .env Configuration:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1  # Bukan 'localhost' jika masalah
DB_PORT=3306
DB_DATABASE=yams_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

**3. Test Connection:**
```bash
php artisan tinker
>>> DB::connection()->getPdo();
# Jika berhasil, tidak ada error
```

---

## 14. FAQ

### 14.1 Umum

**Q: Apa bedanya depreciation dan appreciation?**

A: 
- **Depreciation (Penyusutan):** Nilai aset **turun** seiring waktu. Contoh: komputer, mobil, printer.
- **Appreciation (Apresiasi):** Nilai aset **naik** seiring waktu. Contoh: tanah, bangunan.

---

**Q: Kapan sistem menghitung ulang nilai aset?**

A: Sistem menghitung ulang dalam 3 kondisi:
1. **Saat tambah aset baru** (jika received_date sudah lewat)
2. **Saat edit aset** (jika ada perubahan critical)
3. **Setiap hari jam 00:01** (via scheduler, pada anniversary date)

---

**Q: Apa itu anniversary date?**

A: Anniversary date adalah tanggal ulang tahun aset diterima.

Contoh:
- Received date: 15 Januari 2024
- Anniversary dates: 15 Jan 2025, 15 Jan 2026, dst
- Sistem update nilai aset setiap anniversary

---

**Q: Apa bedanya custom rate dan formula?**

A:
- **Custom Rate:** Persentase tetap per tahun yang di-set manual per aset. Tidak terpengaruh oleh perubahan formula sistem.
- **Formula:** Rumus dinamis yang diterapkan ke semua aset. Bisa diubah admin kapan saja.

Gunakan custom rate untuk aset khusus yang butuh perhitungan berbeda.

---

### 14.2 Perhitungan

**Q: Bagaimana sistem menghitung depresiasi?**

A: 
```
Step 1: Tentukan tipe (depreciation/appreciation)
Step 2: Cek apakah pakai custom rate atau formula
Step 3: Hitung annual change:
  - Custom: purchase_price × custom_rate / 100
  - Formula: Evaluasi formula dengan variabel aset
Step 4: Hitung total change:
  - Jika formula pakai {age}: Langsung pakai hasil (sudah total)
  - Jika formula tidak pakai {age}: annual_change × age
Step 5: Hitung current value:
  - Depreciation: purchase_price - total_change
  - Appreciation: purchase_price + total_change
Step 6: Apply floor (minimum = salvage_value)
```

---

**Q: Kenapa nilai aset saya tidak berubah setelah aktivasi rumus?**

A: Kemungkinan penyebab:
1. Aset menggunakan **custom rate** → Tidak terpengaruh oleh formula
2. Tipe rumus tidak sesuai:
   - Rumus depreciation hanya untuk aset dengan depreciation_type = 'depreciation'
   - Rumus appreciation hanya untuk aset dengan depreciation_type = 'appreciation'
3. Scheduler belum jalan → Edit aset → Save ulang untuk force recalculate

---

**Q: Apa itu {age} dalam formula?**

A: `{age}` adalah variabel umur aset dalam tahun (dengan desimal).

Contoh:
- Received date: 1 Juli 2024
- Hari ini: 17 Januari 2026
- {age} = 1.55 tahun

**PENTING:**
- Jika formula pakai `{age}`, hasilnya adalah **TOTAL** (bukan annual)
- Jika formula tidak pakai `{age}`, hasilnya adalah **ANNUAL** (sistem kalikan dengan age)

---

### 14.3 Manajemen Aset

**Q: Bagaimana cara mengubah aset dari depreciation ke appreciation?**

A:
1. Edit aset
2. Ubah "Tipe Perhitungan" dari "Penyusutan" ke "Apresiasi"
3. Save
4. Sistem otomatis recalculate nilai dengan formula appreciation
5. Notifikasi terkirim ke admin

---

**Q: Apakah bisa import aset dalam jumlah banyak?**

A: Ya, via Excel/CSV import:
1. Download template Excel
2. Isi data aset (bisa ratusan/ribuan rows)
3. Upload file
4. Sistem proses di background
5. Notifikasi saat selesai

---

**Q: Bagaimana cara backup data aset?**

A: 
**Manual:**
1. Export semua aset ke Excel
2. Save file Excel

**Database:**
```bash
# MySQL dump
mysqldump -u root -p yams_db > backup.sql

# Restore
mysql -u root -p yams_db < backup.sql
```

---

**Q: Apakah foto aset wajib di-upload?**

A: Tidak, foto optional. Jika tidak ada foto, sistem tampilkan placeholder image.

---

### 14.4 Rumus & Kalkulator

**Q: Bagaimana membuat rumus yang akurat?**

A: Tips:
1. Test di Kalkulator dulu sebelum diterapkan
2. Gunakan formula sederhana (tanpa {age}) untuk kemudahan
3. Untuk straight-line: `({price} - {salvage}) / {life}`
4. Untuk percentage: `{price} * 0.XX` (XX = persentase dalam desimal)

---

**Q: Apakah bisa punya 2 rumus aktif sekaligus?**

A: Tidak. Sistem hanya mengizinkan **1 rumus aktif per tipe**:
- 1 rumus aktif untuk depreciation
- 1 rumus aktif untuk appreciation

Saat aktivasi rumus baru, rumus lama otomatis non-aktif.

---

**Q: Apa yang terjadi saat aktivasi rumus?**

A: 
1. Rumus lama → Non-aktif
2. Rumus baru → Aktif
3. Sistem recalculate **SEMUA** aset yang sesuai (kecuali yang pakai custom rate)
4. Nilai di database di-update
5. History di-update
6. Notifikasi terkirim ke admin: "X aset telah dihitung ulang"

---

### 14.5 Laporan

**Q: Apa bedanya export Excel vs PDF?**

A:
- **Excel (.xlsx):** Full detail (19 kolom), bisa diedit, untuk analisis
- **PDF (.pdf):** Ringkas (8 kolom), siap cetak, untuk presentasi

---

**Q: Apakah laporan real-time?**

A: Ya, laporan selalu mengambil data terkini dari database.

---

**Q: Bagaimana cara filter laporan berdasarkan tanggal?**

A: Filter tanggal belum tersedia di versi 1.0. Gunakan Excel export → Filter di Excel.

---

### 14.6 User & Security

**Q: Lupa password, bagaimana?**

A:
1. Klik "Forgot Password" di halaman login
2. Input email
3. Cek inbox email → Klik link reset
4. Set password baru
5. Login dengan password baru

---

**Q: Apakah data aman?**

A: Ya, dengan fitur:
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ 2FA (optional)
- ✅ Role-based access control

---

**Q: Bagaimana cara menambah user baru?**

A: (Untuk Superadmin)
1. Navigasi ke Menu "Users"
2. Klik "Tambah User"
3. Isi form (name, email, password, role)
4. Save
5. User bisa login dengan email & password tersebut

---

## 15. ISTILAH & DEFINISI

| Istilah | Definisi |
|---------|----------|
| **Aset** | Barang milik organisasi yang punya nilai ekonomis |
| **Depreciation** | Penurunan nilai aset seiring waktu |
| **Appreciation** | Peningkatan nilai aset seiring waktu |
| **Purchase Price** | Harga beli awal aset |
| **Salvage Value** | Nilai sisa/residu aset di akhir umur manfaat |
| **Useful Life** | Estimasi umur manfaat aset dalam tahun |
| **Current Book Value** | Nilai aset saat ini (setelah depresiasi/apresiasi) |
| **Accumulated Depreciation** | Total penyusutan yang sudah terjadi |
| **Annual Depreciation** | Penyusutan per tahun |
| **Anniversary Date** | Tanggal ulang tahun aset (dari received_date) |
| **Custom Rate** | Persentase depresiasi/apresiasi custom per aset |
| **Formula** | Rumus perhitungan depresiasi/apresiasi sistem |
| **Recalculation** | Perhitungan ulang nilai aset |
| **Scheduler** | Sistem otomatis yang jalan setiap hari |
| **Fallback** | Mekanisme cadangan jika scheduler gagal |

---

## 16. KONTAK & SUPPORT

### 16.1 Technical Support

**Email:** support@yams.com  
**WhatsApp:** +62 812-3456-7890  
**Working Hours:** Senin - Jumat, 09:00 - 17:00 WIB

### 16.2 Bug Report

Laporkan bug via:
1. Email ke support@yams.com dengan subject: "[BUG] Deskripsi"
2. Sertakan screenshot
3. Sertakan langkah reproduksi

### 16.3 Feature Request

Request fitur baru via:
1. Email ke support@yams.com dengan subject: "[FEATURE] Deskripsi"
2. Jelaskan use case
3. Sertakan mockup (optional)

---

## 17. CHANGELOG

### Version 1.0 (17 Januari 2026)

**Initial Release:**
- ✅ CRUD Aset lengkap
- ✅ Dual system: Depreciation & Appreciation
- ✅ Formula dinamis
- ✅ Custom rate per aset
- ✅ Auto-depreciation system
- ✅ Dashboard dengan chart
- ✅ Export Excel/PDF
- ✅ Role-based access
- ✅ 2FA authentication
- ✅ Real-time notification

**Bug Fixes:**
- ✅ Fix overflow calculation saat aktivasi rumus
- ✅ Fix recalculation tidak termasuk aset yang di-edit
- ✅ Fix filter rumus pakai depreciation_type field
- ✅ Fix accumulated_depreciation untuk appreciation

---

## 18. LISENSI

**YAMS (Yet Another Management System)**

Copyright © 2026 All Rights Reserved.

Software ini dilindungi oleh hak cipta. Penggunaan tanpa izin dilarang.

---

**END OF MANUAL BOOK**

---

## 📞 BUTUH BANTUAN?

Jika ada pertanyaan atau kesulitan, jangan ragu untuk menghubungi tim support kami.

**Happy Managing Your Assets! 🎉**
