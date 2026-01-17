# 1.4 FITUR SISTEM YAMS

## 1.4.1 Fitur Login

### 1.4.1.1 Deskripsi
Pengguna masuk ke sistem menggunakan email dan password. Sistem akan mengecek apakah email sudah diverifikasi dan user punya role (SuperAdmin/Admin/User).

### 1.4.1.2 Trigger
User mengakses halaman login dan klik tombol "Login"

### 1.4.1.3 Input
- Email
- Password
- Remember me (opsional)

### 1.4.1.4 Output
- Berhasil: Redirect ke dashboard
- Gagal: Pesan error di halaman login

### 1.4.1.5 Skenario Utama

**Prakondisi**: User sudah terdaftar dan email terverifikasi

**Pascakondisi**: User masuk ke dashboard

**Langkah-langkah**:
1. User buka halaman login
2. User masukkan email dan password
3. User klik tombol "Login"
4. Sistem cek kredensial
5. Sistem cek verifikasi email dan role
6. Sistem buat session
7. User diarahkan ke dashboard

### 1.4.1.6 Skenario Eksepsional 1: Password Salah

**Prakondisi**: User input password yang salah

**Pascakondisi**: Tetap di halaman login

**Langkah-langkah**:
1. User masukkan password salah
2. User klik "Login"
3. Sistem tampilkan error: "Kredensial tidak cocok"
4. User tetap di halaman login

---

## 1.4.2 Fitur Tambah Aset

### 1.4.2.1 Deskripsi
Admin menambahkan aset baru ke sistem. Sistem otomatis menghitung nilai depresiasi/apresiasi saat aset disimpan berdasarkan tanggal diterima sampai sekarang.

### 1.4.2.2 Trigger
Admin klik tombol "Tambah Aset" di menu Assets

### 1.4.2.3 Input
- Nama aset
- Tanggal diterima
- Harga beli
- Umur manfaat (tahun)
- Nilai sisa
- Tipe depresiasi (depreciation/appreciation)
- Lokasi, status, foto (opsional)

### 1.4.2.4 Output
- Aset tersimpan di database
- Nilai buku saat ini sudah dihitung otomatis
- Notifikasi sukses
- Muncul di daftar aset

### 1.4.2.5 Skenario Utama

**Prakondisi**: Admin login dan ada formula aktif

**Pascakondisi**: Aset baru tersimpan dengan nilai buku terkalkulasi

**Langkah-langkah**:
1. Admin klik menu "Assets"
2. Admin klik "Tambah Aset"
3. Admin isi form (nama, tanggal diterima, harga, dll)
4. Admin klik "Simpan"
5. Sistem validasi data
6. Sistem hitung umur aset dari tanggal diterima sampai sekarang
7. Sistem ambil formula aktif
8. Sistem hitung depresiasi
9. Sistem simpan aset dengan nilai buku yang sudah dihitung
10. Sistem tampilkan notifikasi berhasil
11. Aset muncul di daftar

### 1.4.2.6 Skenario Eksepsional 1: Form Tidak Lengkap

**Prakondisi**: Admin tidak isi field yang wajib

**Pascakondisi**: Data tidak tersimpan

**Langkah-langkah**:
1. Admin isi form tapi nama aset kosong
2. Admin klik "Simpan"
3. Sistem tampilkan error: "Nama harus diisi"
4. Admin isi nama
5. Admin klik "Simpan" lagi

---

## 1.4.3 Fitur Lihat Detail Aset

### 1.4.3.1 Deskripsi
User melihat informasi lengkap aset termasuk foto, data finansial, dan riwayat perubahan nilai per tahun.

### 1.4.3.2 Trigger
User klik nama aset atau tombol "Detail" di daftar aset

### 1.4.3.3 Input
- ID aset (otomatis dari klik)

### 1.4.3.4 Output
- Halaman detail dengan semua informasi aset
- Foto aset (jika ada)
- Tabel riwayat depresiasi per tahun

### 1.4.3.5 Skenario Utama

**Prakondisi**: Aset ada di database

**Pascakondisi**: Detail aset ditampilkan

**Langkah-langkah**:
1. User buka daftar aset
2. User klik nama aset
3. Sistem ambil data aset dari database
4. Sistem tampilkan semua informasi
5. User lihat detail lengkap

### 1.4.3.6 Skenario Eksepsional 1: Aset Tidak Ditemukan

**Prakondisi**: Aset sudah dihapus

**Pascakondisi**: Error 404

**Langkah-langkah**:
1. User klik link aset yang sudah dihapus
2. Sistem cari di database
3. Sistem tidak temukan aset
4. Sistem tampilkan halaman 404

---

## 1.4.4 Fitur Edit Aset

### 1.4.4.1 Deskripsi
Admin mengubah data aset yang sudah ada. Jika mengubah data yang mempengaruhi perhitungan (harga, umur manfaat), sistem akan menghitung ulang nilai buku.

### 1.4.4.2 Trigger
Admin klik tombol "Edit" di daftar aset atau di halaman detail

### 1.4.4.3 Input
- Data aset yang ingin diubah (nama, harga, lokasi, dll)

### 1.4.4.4 Output
- Aset terupdate di database
- Nilai buku dihitung ulang (jika perlu)
- Notifikasi sukses

### 1.4.4.5 Skenario Utama

**Prakondisi**: Aset ada dan admin punya akses

**Pascakondisi**: Data aset terupdate

**Langkah-langkah**:
1. Admin klik "Edit" pada aset
2. Sistem tampilkan form edit dengan data lama
3. Admin ubah data (misal: lokasi)
4. Admin klik "Simpan"
5. Sistem validasi
6. Sistem update data
7. Sistem tampilkan notifikasi berhasil

### 1.4.4.6 Skenario Eksepsional 1: Ubah Data Finansial

**Prakondisi**: Admin ubah harga beli atau umur manfaat

**Pascakondisi**: Nilai buku dihitung ulang

**Langkah-langkah**:
1. Admin ubah harga beli dari 10 juta jadi 12 juta
2. Admin klik "Simpan"
3. Sistem deteksi perubahan data finansial
4. Sistem hitung ulang nilai buku dengan harga baru
5. Sistem update aset
6. Nilai buku berubah sesuai perhitungan baru

---

## 1.4.5 Fitur Hapus Aset

### 1.4.5.1 Deskripsi
Admin menghapus aset dari sistem. Data aset dan riwayatnya akan terhapus permanen.

### 1.4.5.2 Trigger
Admin klik tombol "Hapus" dan konfirmasi

### 1.4.5.3 Input
- ID aset (otomatis)
- Konfirmasi hapus (Ya/Tidak)

### 1.4.5.4 Output
- Aset terhapus dari database
- Notifikasi berhasil
- Aset hilang dari daftar

### 1.4.5.5 Skenario Utama

**Prakondisi**: Aset ada di database

**Pascakondisi**: Aset terhapus permanen

**Langkah-langkah**:
1. Admin klik tombol "Hapus" pada aset
2. Sistem tampilkan modal konfirmasi
3. Admin klik "Ya, Hapus"
4. Sistem hapus aset dan riwayatnya
5. Sistem tampilkan notifikasi berhasil
6. Aset hilang dari daftar

### 1.4.5.6 Skenario Eksepsional 1: Batal Hapus

**Prakondisi**: Admin klik hapus tapi berubah pikiran

**Pascakondisi**: Aset tidak terhapus

**Langkah-langkah**:
1. Admin klik "Hapus"
2. Modal konfirmasi muncul
3. Admin klik "Batal"
4. Modal tertutup
5. Aset tetap ada

---

## 1.4.6 Fitur Import Aset dari Excel

### 1.4.6.1 Deskripsi
Admin mengupload file Excel berisi banyak aset sekaligus. Sistem akan memvalidasi dan menyimpan semua aset yang valid.

### 1.4.6.2 Trigger
Admin klik "Import Excel" dan upload file

### 1.4.6.3 Input
- File Excel (.xlsx atau .xls)

### 1.4.6.4 Output
- Jumlah aset yang berhasil diimpor
- Detail error (jika ada yang gagal)
- Aset baru muncul di daftar

### 1.4.6.5 Skenario Utama

**Prakondisi**: Admin punya file Excel sesuai template

**Pascakondisi**: Semua aset tersimpan

**Langkah-langkah**:
1. Admin klik "Import Excel"
2. Admin pilih file Excel
3. Admin klik "Upload"
4. Sistem baca file
5. Sistem validasi setiap baris
6. Sistem simpan aset yang valid
7. Sistem hitung depresiasi untuk setiap aset
8. Sistem tampilkan hasil: "50 aset berhasil diimpor"

### 1.4.6.6 Skenario Eksepsional 1: Ada Data Invalid

**Prakondisi**: Beberapa baris di Excel tidak lengkap

**Pascakondisi**: Hanya yang valid tersimpan

**Langkah-langkah**:
1. Admin upload Excel dengan 100 baris
2. 20 baris ada data kosong
3. Sistem import 80 baris yang valid
4. Sistem tampilkan: "80 berhasil, 20 gagal"
5. Sistem tampilkan detail error per baris

---

## 1.4.7 Fitur Buat Formula Depresiasi

### 1.4.7.1 Deskripsi
Admin membuat rumus perhitungan depresiasi/apresiasi custom menggunakan variabel harga, nilai sisa, umur manfaat, dan umur aset.

### 1.4.7.2 Trigger
Admin klik "Tambah Formula" di menu Formulas

### 1.4.7.3 Input
- Nama formula (misal: "Metode Garis Lurus")
- Expression (misal: "({price} - {salvage}) / {life}")
- Tipe (depreciation atau appreciation)

### 1.4.7.4 Output
- Formula tersimpan
- Muncul di daftar formula dengan status "Inactive"

### 1.4.7.5 Skenario Utama

**Prakondisi**: Admin login

**Pascakondisi**: Formula baru tersimpan

**Langkah-langkah**:
1. Admin klik menu "Formulas"
2. Admin klik "Tambah Formula"
3. Admin isi nama dan expression
4. Admin pilih tipe "depreciation"
5. Admin klik "Simpan"
6. Sistem validasi expression
7. Sistem simpan formula dengan status inactive
8. Formula muncul di daftar

### 1.4.7.6 Skenario Eksepsional 1: Expression Salah

**Prakondisi**: Admin input expression dengan variabel tidak valid

**Pascakondisi**: Formula tidak tersimpan

**Langkah-langkah**:
1. Admin isi expression: "({harga} / {tahun})"
2. Admin klik "Simpan"
3. Sistem deteksi variabel tidak valid
4. Sistem tampilkan error: "Gunakan variabel: {price}, {salvage}, {life}, {age}"
5. Admin perbaiki expression

---

## 1.4.8 Fitur Aktifkan Formula

### 1.4.8.1 Deskripsi
Admin mengaktifkan formula depresiasi/apresiasi. Sistem akan menonaktifkan formula lama dan menghitung ulang semua aset menggunakan formula baru.

### 1.4.8.2 Trigger
Admin klik tombol "Activate" pada formula yang dipilih

### 1.4.8.3 Input
- ID formula (otomatis)
- Konfirmasi aktivasi

### 1.4.8.4 Output
- Formula aktif (badge hijau)
- Formula lama nonaktif
- Semua aset dihitung ulang
- Notifikasi: "156 aset telah dihitung ulang"

### 1.4.8.5 Skenario Utama

**Prakondisi**: Formula sudah dibuat dengan status inactive

**Pascakondisi**: Formula aktif dan semua aset dihitung ulang

**Langkah-langkah**:
1. Admin klik "Activate" pada formula
2. Sistem tampilkan konfirmasi
3. Admin klik "Ya"
4. Sistem nonaktifkan formula lama (tipe yang sama)
5. Sistem aktifkan formula baru
6. Sistem ambil semua aset sesuai tipe formula
7. Sistem hitung ulang nilai buku setiap aset dengan formula baru
8. Sistem update database
9. Sistem tampilkan: "Formula aktif. 156 aset dihitung ulang"

### 1.4.8.6 Skenario Eksepsional 1: Aset dengan Custom Rate Tidak Terpengaruh

**Prakondisi**: Beberapa aset punya custom rate

**Pascakondisi**: Aset dengan custom rate tidak dihitung ulang

**Langkah-langkah**:
1. Admin aktifkan formula
2. Sistem cek setiap aset
3. Aset tanpa custom rate: dihitung ulang dengan formula baru
4. Aset dengan custom rate: dilewati (tetap pakai custom rate)
5. Sistem tampilkan: "150 aset dihitung ulang, 6 aset pakai custom rate"

---

## 1.4.9 Fitur Kalkulator Depresiasi

### 1.4.9.1 Deskripsi
Admin mencoba formula dengan nilai sampel untuk melihat hasil perhitungan sebelum diterapkan ke aset real.

### 1.4.9.2 Trigger
Admin buka menu "Calculator" dan isi nilai

### 1.4.9.3 Input
- Harga beli
- Nilai sisa
- Umur manfaat
- Umur aset
- Tipe (depreciation/appreciation)

### 1.4.9.4 Output
- Depresiasi tahunan (Rp)
- Akumulasi depresiasi (Rp)
- Nilai buku saat ini (Rp)
- Formula yang digunakan

### 1.4.9.5 Skenario Utama

**Prakondisi**: Ada formula aktif

**Pascakondisi**: Hasil perhitungan ditampilkan (tidak tersimpan)

**Langkah-langkah**:
1. Admin buka "Calculator"
2. Admin isi harga beli: 15.000.000
3. Admin isi nilai sisa: 500.000
4. Admin isi umur manfaat: 5 tahun
5. Admin isi umur aset: 2 tahun
6. Admin klik "Hitung"
7. Sistem ambil formula aktif
8. Sistem hitung dengan formula
9. Sistem tampilkan hasil:
   - Depresiasi tahunan: Rp 2.900.000
   - Akumulasi: Rp 5.800.000
   - Nilai buku: Rp 9.200.000

### 1.4.9.6 Skenario Eksepsional 1: Tidak Ada Formula Aktif

**Prakondisi**: Belum ada formula aktif untuk tipe yang dipilih

**Pascakondisi**: Error ditampilkan

**Langkah-langkah**:
1. Admin pilih tipe "appreciation"
2. Admin isi nilai dan klik "Hitung"
3. Sistem cari formula aktif untuk appreciation
4. Tidak ditemukan
5. Sistem tampilkan error: "Belum ada formula appreciation aktif"

---

## 1.4.10 Fitur Auto-Depreciation (Otomatis Setiap Tahun)

### 1.4.10.1 Deskripsi
Sistem menghitung ulang nilai aset secara otomatis setiap 1 tahun sejak tanggal aset diterima. Berjalan otomatis setiap hari jam 00:01 WIB via scheduler, atau via fallback jika scheduler gagal.

### 1.4.10.2 Trigger
- **Otomatis**: Scheduler Laravel (setiap hari jam 00:01 WIB)
- **Otomatis**: Fallback saat ada HTTP request pertama hari itu (jika scheduler gagal)

### 1.4.10.3 Input
- Aset yang sudah 1 tahun sejak terakhir dihitung
- Formula aktif

### 1.4.10.4 Output
- Nilai buku aset terupdate
- Tanggal terakhir dihitung terupdate
- Riwayat depresiasi bertambah
- Notifikasi ke admin

### 1.4.10.5 Skenario Utama: Scheduler Jalan Normal

**Prakondisi**: 
- Cron job sudah dikonfigurasi
- Ada aset yang mencapai 1 tahun sejak terakhir dihitung

**Pascakondisi**: 
- Aset dihitung ulang
- Nilai buku berkurang/bertambah
- Riwayat tercatat

**Langkah-langkah**:
1. Jam 00:01 WIB, cron job jalan
2. Sistem cek aset yang sudah 1 tahun
3. Sistem ambil formula aktif
4. Untuk setiap aset:
   - Hitung depresiasi/apresiasi tahunan
   - Update nilai buku
   - Update tanggal terakhir dihitung
   - Buat record riwayat
5. Sistem kirim notifikasi: "45 aset telah dihitung ulang"

### 1.4.10.6 Skenario Eksepsional 1: Scheduler Gagal, Fallback Aktif

**Prakondisi**: Scheduler tidak jalan (server mati/error)

**Pascakondisi**: Fallback menjalankan perhitungan saat ada request

**Langkah-langkah**:
1. Scheduler gagal jam 00:01 WIB
2. Admin buka aplikasi jam 08:00
3. Sistem cek: "Sudah jalan hari ini?"
4. Belum → Sistem cek: "Ada aset yang perlu dihitung?"
5. Ada → Sistem jalankan perhitungan (sama seperti scheduler)
6. Sistem kirim notifikasi: "Fallback: 45 aset telah dihitung"

---

## 1.4.11 Fitur Dashboard

### 1.4.11.1 Deskripsi
Menampilkan ringkasan statistik aset dalam bentuk kartu angka, grafik pie (aset per tipe), grafik bar (aset per lokasi), dan tabel 5 aset terbaru.

### 1.4.11.2 Trigger
User login otomatis masuk dashboard, atau klik menu "Dashboard"

### 1.4.11.3 Input
- Session user (otomatis)

### 1.4.11.4 Output
- 4 kartu statistik (total aset, total harga beli, total depresiasi, total nilai buku)
- Grafik pie: aset per tipe
- Grafik bar: aset per lokasi
- Tabel 5 aset terbaru

### 1.4.11.5 Skenario Utama

**Prakondisi**: User login

**Pascakondisi**: Dashboard ditampilkan

**Langkah-langkah**:
1. User login berhasil
2. Sistem redirect ke dashboard
3. Sistem hitung statistik dari database
4. Sistem tampilkan 4 kartu angka
5. Sistem buat data untuk grafik pie dan bar
6. Sistem tampilkan grafik
7. Sistem ambil 5 aset terbaru
8. User lihat dashboard lengkap

### 1.4.11.6 Skenario Eksepsional 1: Belum Ada Aset

**Prakondisi**: Database kosong

**Pascakondisi**: Dashboard tampil dengan angka 0

**Langkah-langkah**:
1. User login
2. Sistem cari data aset
3. Tidak ada data
4. Sistem tampilkan semua kartu dengan nilai 0
5. Grafik tampilkan "Tidak ada data"
6. Tabel tampilkan "Belum ada aset"

---

## 1.4.12 Fitur Laporan & Export Excel/PDF

### 1.4.12.1 Deskripsi
User melihat daftar aset lengkap dan mengekspornya dalam format Excel atau PDF dengan styling professional.

### 1.4.12.2 Trigger
User klik menu "Reports" lalu klik "Export Excel" atau "Export PDF"

### 1.4.12.3 Input
- Filter kategori (opsional)
- Sort by (opsional)

### 1.4.12.4 Output
- File Excel (.xlsx) atau PDF ter-download
- File berisi semua aset dengan format rapi

### 1.4.12.5 Skenario Utama: Export Excel

**Prakondisi**: Ada data aset

**Pascakondisi**: File Excel ter-download

**Langkah-langkah**:
1. User klik menu "Reports"
2. User lihat daftar aset
3. User klik "Export Excel"
4. Sistem ambil semua data aset
5. Sistem buat file Excel dengan:
   - Header bold dan berwarna
   - Data aset per baris
   - Format currency untuk kolom harga
   - Total di bawah
6. Browser download file: `assets_report_2026-01-17.xlsx`
7. User buka file Excel

### 1.4.12.6 Skenario Eksepsional 1: Export PDF

**Prakondisi**: User pilih export PDF

**Pascakondisi**: File PDF ter-download

**Langkah-langkah**:
1. User klik "Export PDF"
2. Sistem ambil data aset
3. Sistem buat file PDF landscape
4. Browser download file: `assets_report_2026-01-17.pdf`

---

## 1.4.13 Fitur Manajemen User (SuperAdmin)

### 1.4.13.1 Deskripsi
SuperAdmin membuat, melihat, mengedit, dan menghapus user. Bisa mengatur role user (SuperAdmin/Admin/User).

### 1.4.13.2 Trigger
SuperAdmin klik menu "Users" (menu ini tidak muncul untuk Admin/User biasa)

### 1.4.13.3 Input
- Nama, email, password
- Role (minimal 1: SuperAdmin/Admin/User)
- Avatar (opsional)

### 1.4.13.4 Output
- User baru tersimpan
- Email verifikasi terkirim
- User muncul di daftar

### 1.4.13.5 Skenario Utama: Tambah User

**Prakondisi**: SuperAdmin login

**Pascakondisi**: User baru tersimpan

**Langkah-langkah**:
1. SuperAdmin klik "Users"
2. SuperAdmin klik "Tambah User"
3. SuperAdmin isi nama, email, password
4. SuperAdmin pilih role: "Admin"
5. SuperAdmin klik "Simpan"
6. Sistem simpan user
7. Sistem kirim email verifikasi
8. User baru muncul di daftar

### 1.4.13.6 Skenario Eksepsional 1: Email Sudah Ada

**Prakondisi**: Email yang diinput sudah terdaftar

**Pascakondisi**: User tidak tersimpan

**Langkah-langkah**:
1. SuperAdmin isi email: "admin@yarsi.ac.id"
2. SuperAdmin klik "Simpan"
3. Sistem cek email di database
4. Email sudah ada
5. Sistem tampilkan error: "Email sudah digunakan"

---

## 1.4.14 Fitur Notifikasi

### 1.4.14.1 Deskripsi
Sistem mengirim notifikasi ke admin saat ada event penting (aset dibuat, formula diaktifkan, auto-depreciation selesai). Notifikasi muncul di bell icon dengan badge jumlah yang belum dibaca.

### 1.4.14.2 Trigger
- **Otomatis**: Event sistem (create aset, activate formula, dll)
- **Manual**: User klik bell icon untuk lihat notifikasi

### 1.4.14.3 Input
- Event dari sistem (otomatis)

### 1.4.14.4 Output
- Badge angka di bell icon (jumlah unread)
- Dropdown list notifikasi
- Status read/unread

### 1.4.14.5 Skenario Utama

**Prakondisi**: Admin login

**Pascakondisi**: Notifikasi diterima dan dibaca

**Langkah-langkah**:
1. Admin A buat aset baru
2. Sistem kirim notifikasi ke semua admin
3. Admin B lihat badge di bell icon: angka 1
4. Admin B klik bell icon
5. Dropdown terbuka, tampilkan notifikasi:
   "Admin A created asset: Laptop HP"
6. Admin B klik notifikasi
7. Notifikasi berubah status jadi "read"
8. Badge berkurang jadi 0

### 1.4.14.6 Skenario Eksepsional 1: Mark All as Read

**Prakondisi**: Admin punya 10 notifikasi unread

**Pascakondisi**: Semua jadi read

**Langkah-langkah**:
1. Admin klik bell icon (badge: 10)
2. Admin klik "Mark All as Read"
3. Sistem update semua notifikasi jadi read
4. Badge jadi 0

---

## 1.4.15 Fitur Pengaturan Profil

### 1.4.15.1 Deskripsi
User mengubah data profil (nama, email, password, avatar).

### 1.4.15.2 Trigger
User klik menu "Settings"

### 1.4.15.3 Input
- Nama baru
- Email baru
- Password lama & baru (jika ubah password)
- Avatar (opsional)

### 1.4.15.4 Output
- Profil terupdate
- Avatar baru tampil
- Notifikasi berhasil

### 1.4.15.5 Skenario Utama

**Prakondisi**: User login

**Pascakondisi**: Profil terupdate

**Langkah-langkah**:
1. User klik "Settings"
2. User ubah nama: "John Doe"
3. User upload foto profil baru
4. User klik "Save"
5. Sistem update database
6. Sistem tampilkan notifikasi berhasil
7. Avatar baru muncul di header

### 1.4.15.6 Skenario Eksepsional 1: Ubah Password Salah Input Password Lama

**Prakondisi**: User mau ubah password

**Pascakondisi**: Password tidak berubah

**Langkah-langkah**:
1. User isi password lama yang salah
2. User isi password baru
3. User klik "Save"
4. Sistem cek password lama
5. Tidak cocok
6. Sistem tampilkan error: "Password lama salah"

---

## 1.4.16 Fitur Two-Factor Authentication (2FA)

### 1.4.16.1 Deskripsi
User mengaktifkan keamanan tambahan dengan 2FA. Setelah aktif, login butuh kode 6 digit dari aplikasi authenticator (Google Authenticator/Authy).

### 1.4.16.2 Trigger
User klik "Enable 2FA" di Settings

### 1.4.16.3 Input
- Scan QR code dengan aplikasi authenticator
- Input kode 6 digit untuk konfirmasi

### 1.4.16.4 Output
- 2FA aktif
- QR code ditampilkan
- 8 recovery codes untuk backup

### 1.4.16.5 Skenario Utama: Aktifkan 2FA

**Prakondisi**: User login dan 2FA belum aktif

**Pascakondisi**: 2FA aktif

**Langkah-langkah**:
1. User klik "Settings"
2. User klik "Enable 2FA"
3. Sistem generate QR code
4. Sistem tampilkan QR code
5. User scan dengan Google Authenticator
6. Aplikasi mulai generate kode 6 digit
7. User input kode dari aplikasi
8. User klik "Confirm"
9. Sistem verifikasi kode
10. Kode valid → 2FA aktif
11. Sistem tampilkan 8 recovery codes
12. User simpan recovery codes
13. Login berikutnya butuh kode 2FA

### 1.4.16.6 Skenario Eksepsional 1: Kode 2FA Salah

**Prakondisi**: User input kode yang salah

**Pascakondisi**: 2FA tidak aktif

**Langkah-langkah**:
1. User input kode: "123456" (salah)
2. User klik "Confirm"
3. Sistem verifikasi kode
4. Kode invalid
5. Sistem tampilkan error: "Kode tidak valid"
6. User tunggu kode baru dari aplikasi (setiap 30 detik)
7. User coba lagi dengan kode baru

---

## Ringkasan Fitur

Dokumentasi ini mencakup **16 fitur utama** sistem YAMS:

1. **Login** - Autentikasi dengan email & password
2. **Tambah Aset** - Menambahkan aset dengan perhitungan otomatis
3. **Lihat Detail Aset** - Melihat informasi lengkap aset
4. **Edit Aset** - Mengubah data aset dengan recalculation
5. **Hapus Aset** - Menghapus aset permanen
6. **Import Excel** - Import batch aset dari file Excel
7. **Buat Formula** - Membuat rumus depresiasi/apresiasi custom
8. **Aktifkan Formula** - Mengaktifkan formula dengan recalculation
9. **Kalkulator** - Testing formula dengan nilai sampel
10. **Auto-Depreciation** - Perhitungan otomatis tahunan (scheduler + fallback)
11. **Dashboard** - Overview statistik dan grafik
12. **Export Laporan** - Export ke Excel/PDF
13. **Manajemen User** - CRUD user oleh SuperAdmin
14. **Notifikasi** - Sistem notifikasi real-time
15. **Pengaturan Profil** - Update profil user
16. **2FA** - Two-Factor Authentication untuk keamanan

Setiap fitur dijelaskan dengan struktur: Deskripsi, Trigger, Input, Output, Skenario Utama, dan Skenario Eksepsional.
