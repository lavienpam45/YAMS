# MANUAL BOOK PENGEMBANGAN (FRONTEND)

## PENGEMBANGAN DAN IMPLEMENTASI SISTEM MANAJEMEN ASET BERBASIS WEB
# "YAMS"
### YARSI Asset Management System

---

## DOKUMENTASI MANUAL BOOK PENGEMBANGAN (FRONTEND)

**Disusun oleh:**

**[Nama Dosen Pembimbing]**

| Nama | NIM |
|------|-----|
| [Nama Pengembang 1] | [NIM] |
| [Nama Pengembang 2] | [NIM] |
| [Nama Pengembang 3] | [NIM] |

---

**PROGRAM SARJANA TEKNIK INFORMATIKA**  
**FAKULTAS TEKNOLOGI INFORMASI**  
**UNIVERSITAS YARSI**  
**JAKARTA**  
**JANUARI 2026**

---

## KATA PENGANTAR

Puji syukur kami panjatkan ke hadirat Allah SWT, karena atas berkat dan rahmat-Nya, kami dapat menyelesaikan penulisan Manual Book Pengembangan (Frontend) untuk aplikasi YAMS (YARSI Asset Management System). Shalawat serta salam semoga senantiasa dilimpahkan kepada Nabi Muhammad SAW, keluarganya, Para Sahabat, serta seluruh umatnya hingga hari akhir.

Manual Book Pengembangan (Frontend) ini disusun sebagai panduan untuk memudahkan pengembang selanjutnya aplikasi YAMS pada bagian Front-End. Dengan adanya Manual Book ini, diharapkan tim pengembang selanjutnya dapat memahami fitur-fitur yang telah diterapkan dan memahami teknis atau cara kerja sebagai pengembang front-end.

Aplikasi YAMS ini merupakan sistem manajemen aset terintegrasi yang dirancang khusus untuk Universitas YARSI. Sistem ini memungkinkan pengelolaan aset kampus secara efisien dengan fitur perhitungan depresiasi otomatis, pelacakan aset, dan pelaporan yang komprehensif. Front-End sangat berperan penting karena semakin bagus tampilan dan pengalaman pengguna, akan semakin efektif penggunaan sistem dalam mengelola aset-aset institusi.

Akhir kata, kami berterima kasih kepada semua pihak yang berkontribusi terciptanya aplikasi ini. Semoga Manual Book Pengembangan (Frontend) ini dapat berguna baik dari sisi Pengembang selanjutnya maupun pengguna yang bertujuan dapat mengembangkan aplikasi ini secara berkala dari fitur yang semakin maju dan bermanfaat.

Semoga Allah SWT memberikan keberkahan yang berlimpah dari segala sisi baik.

**Jakarta, Januari 2026**  
**Tim Pengembang YAMS**

---

## DAFTAR ISI

- [BAB 1 PENDAHULUAN](#bab-1-pendahuluan)
  - [1.1 Latar Belakang](#11-latar-belakang)
  - [1.2 Tujuan Penggunaan](#12-tujuan-penggunaan)
  - [1.3 Tech-Stack](#13-tech-stack)
- [BAB 2 PENGEMBANGAN](#bab-2-pengembangan)
  - [2.1 Persiapan](#21-persiapan)
  - [2.2 Deskripsi Folder & File](#22-deskripsi-folder--file)
  - [2.3 Penambahan Fitur](#23-penambahan-fitur)
- [BAB 3 PENUTUP](#bab-3-penutup)
  - [3.1 Kesimpulan](#31-kesimpulan)
  - [3.2 Saran](#32-saran)

---

## DAFTAR GAMBAR

| No | Keterangan |
|----|------------|
| Gambar 1 | Halaman Github Repository "YAMS" |
| Gambar 2 | Halaman Command Prompt - Git Clone |
| Gambar 3 | Halaman VS CODE - Terminal |
| Gambar 4 | Halaman VS CODE - npm install |
| Gambar 5 | Halaman VS CODE - npm run dev |
| Gambar 6 | Halaman YAMS "Landing Page" |
| Gambar 7 | Halaman YAMS "Dashboard" |
| Gambar 8 | Struktur Folder resources/js |
| Gambar 9 | Halaman Daftar Aset |
| Gambar 10 | Halaman Tambah Aset |
| Gambar 11 | Halaman Edit Aset |
| Gambar 12 | Halaman Detail Aset |
| Gambar 13 | Halaman Manajemen Formula |
| Gambar 14 | Halaman Kalkulator Formula |
| Gambar 15 | Halaman Laporan |
| Gambar 16 | Halaman Manajemen User |
| Gambar 17 | Komponen NotificationBell |
| Gambar 18 | Komponen Sidebar |
| Gambar 19 | Komponen Card |
| Gambar 20 | Struktur Kode - Button Component |
| Gambar 21 | Struktur Kode - useForm Hook |
| Gambar 22 | Struktur Kode - AppLayout |
| Gambar 23 | Halaman Login |
| Gambar 24 | Halaman Register |

---

# BAB 1 PENDAHULUAN

## 1.1 LATAR BELAKANG

YAMS (YARSI Asset Management System) merupakan aplikasi web yang dirancang untuk menunjang pengelolaan aset di lingkungan Universitas YARSI. Dengan adanya aplikasi ini, pengguna dapat dengan mudah dan nyaman mengelola berbagai data aset kampus kapanpun dan dimanapun. Aplikasi ini dikembangkan untuk menggantikan sistem pencatatan aset manual yang kurang efisien.

Salah satu fitur utama YAMS adalah **Manajemen Aset** yang memungkinkan pengguna untuk mencatat, memperbarui, dan melacak semua aset yang dimiliki institusi. Sistem ini dilengkapi dengan fitur **Perhitungan Depresiasi Otomatis** yang mendukung dua metode: penyusutan (depreciation) dan kenaikan nilai (appreciation). Pengguna dapat mengatur formula perhitungan sesuai kebutuhan dan sistem akan secara otomatis menghitung nilai buku aset berdasarkan umur dan parameter yang ditentukan.

Selain itu, YAMS menawarkan fitur **Dashboard Interaktif** dengan visualisasi data menggunakan grafik pie dan bar chart yang menampilkan statistik aset berdasarkan jenis, lokasi, dan nilai. Fitur **Laporan Komprehensif** memungkinkan pengguna mengekspor data ke format Excel dan PDF dengan berbagai filter yang fleksibel.

YAMS juga dilengkapi dengan sistem **Role-Based Access Control** yang membagi akses berdasarkan peran: SuperAdmin, Admin, dan User. Sistem **Notifikasi Real-time** akan memberitahu pengguna tentang perubahan penting pada aset mereka.

Aplikasi YAMS dikembangkan menggunakan teknologi modern dengan arsitektur **Laravel + Inertia.js + React** yang memungkinkan pengalaman Single Page Application (SPA) dengan kekuatan server-side rendering. YAMS menjadi solusi lengkap bagi institusi yang ingin meningkatkan efisiensi pengelolaan aset.

## 1.2 TUJUAN PENGGUNAAN

Tujuan dibuatnya Manual Book (Front-end) ini adalah sebagai pedoman bagi pengembang Front-End dari Aplikasi YAMS versi selanjutnya. Front-End adalah sisi bagian depan pengguna yang dimana seorang pengguna bisa melihat suatu hal secara visual atau sekaligus bisa melakukan sebuah interaksi sesuai fitur yang telah disediakan seperti tombol, form, tabel, dan lainnya.

Front-End sangat berperan penting karena semakin bagus tampilan dan User Experience (UX), akan semakin betah seorang pengguna menggunakan aplikasi. Sebaliknya, meskipun aplikasi memiliki banyak fitur canggih, jika tampilan tidak user-friendly, pengguna akan kesulitan mengoperasikan sistem.

Seorang pengembang Front-End dalam platform web harus menerapkan **responsif design** dalam aplikasi yang dikembangkannya sehingga mempertahankan kerapian tampilan aplikasi bila dibuka menggunakan berbagai ukuran layar (desktop, tablet, mobile). Seorang Front-End juga harus memikirkan bagaimana struktur kode yang baik dan tidak terjadi pemborosan kode.

Jika terjadi pemborosan kode, performa aplikasi akan mengalami gangguan, lambatnya dalam merender sebuah konten, bahkan terjadi hal yang tidak diinginkan seperti crash-nya sebuah aplikasi. Maka dari itu pengembang harus memikirkan sebuah logika yang baik, menggunakan **TypeScript** untuk type-safety, dan memilih Library serta Framework yang tepat.

## 1.3 TECH-STACK

### 1.3.1 REACT 19.2 (TypeScript)

React adalah Library JavaScript yang dikembangkan oleh Facebook (Meta) yang digunakan dalam pengembangan user interface berbasis komponen. YAMS menggunakan **React versi 19.2** dengan **TypeScript** untuk type-safety dan developer experience yang lebih baik. React memiliki fasilitas pembuatan komponen antarmuka yang interaktif dan stateful sehingga dapat digunakan secara berulang kali (reusable components).

**Contoh penggunaan di YAMS:**

> 📁 **File:** `resources/js/pages/dashboard.tsx`  
> 📍 **Baris:** 63-82

```tsx
function StatCard({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-lg bg-white p-6 shadow border" style={{ borderColor: 'rgba(12, 126, 70, 0.15)' }}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">{title}</span>
                    <span className="text-2xl font-bold text-gray-900">
                        {value}
                    </span>
                </div>
                <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>{icon}</div>
            </div>
        </div>
    );
}
```

### 1.3.2 TAILWIND CSS 4.0

Tailwind CSS adalah utility-first Framework CSS yang didesain untuk mempermudah dan mempercepat pembuatan tampilan aplikasi yang lebih interaktif. YAMS menggunakan **Tailwind CSS versi 4.0** yang merupakan versi terbaru dengan performa lebih cepat. Tailwind menyediakan utility class yang lengkap dan dapat dikustomisasi sesuai kebutuhan melalui file konfigurasi.

**Contoh penggunaan di YAMS:**

> 📁 **File:** `resources/js/layouts/app-layout.tsx`  
> 📍 **Baris:** 83-90

```tsx
<div className="min-h-screen" style={{
    backgroundColor: '#f9fafb',
    backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.10) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.08) 0%, transparent 50%)
    `
}}>
```

### 1.3.3 RADIX UI

Radix UI adalah library komponen UI primitif yang accessible dan unstyled. YAMS menggunakan berbagai komponen Radix UI seperti:
- `@radix-ui/react-dialog` - Modal dan dialog
- `@radix-ui/react-dropdown-menu` - Menu dropdown
- `@radix-ui/react-select` - Select/combobox
- `@radix-ui/react-checkbox` - Checkbox
- `@radix-ui/react-tooltip` - Tooltip

Komponen Radix UI dikombinasikan dengan Tailwind CSS untuk styling yang konsisten.

### 1.3.4 INERTIA.JS 2.1.4

Inertia.js adalah adapter yang menghubungkan Laravel (backend) dengan React (frontend) tanpa memerlukan API terpisah. Dengan Inertia.js, YAMS mendapatkan keuntungan:
- **Server-side routing** - Routing didefinisikan di Laravel
- **No API needed** - Data dikirim langsung sebagai props ke komponen React
- **SPA Experience** - Navigasi tanpa full page reload
- **Form handling** - Hook `useForm` untuk pengelolaan form

**Contoh penggunaan di YAMS:**

> 📁 **File:** `resources/js/pages/Assets/Create.tsx`  
> 📍 **Baris:** 17-62

```tsx
export default function Create({ nextAssetCode, nextUnitCode }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        room_name: string;
        location: string;
        floor: string;
        asset_code: string;
        unit_code: string;
        received_date: string;
        purchase_price: string;
        useful_life: number;
        salvage_value: number;
        type: string;
        depreciation_type: string;
        custom_depreciation_rate: string;
        brand: string;
        serial_number: string;
        quantity: number;
        status: string;
        description: string;
        user_assigned: string;
        inventory_status: string;
        photo: File | null;
    }>({
        name: '',
        room_name: '',
        location: '',
        // ... nilai awal lainnya
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(absRoute('assets.store'));
    }
    // ...
}
```

### 1.3.5 CHART.JS + React-ChartJS-2

Chart.js adalah library untuk membuat grafik interaktif. YAMS menggunakan Chart.js melalui wrapper **react-chartjs-2** untuk menampilkan:
- **Pie Chart** - Distribusi aset berdasarkan jenis
- **Bar Chart** - Distribusi aset berdasarkan lokasi
- **Line Chart** - Trend nilai aset

**Contoh penggunaan di YAMS:**

> 📁 **File:** `resources/js/pages/dashboard.tsx`  
> 📍 **Baris:** 118-148

```tsx
// Konfigurasi Data untuk Grafik Pie (Aset per Kategori)
const pieChartData = {
    labels: Object.keys(chartData.by_category),
    datasets: [
        {
            label: 'Jumlah Aset',
            data: Object.values(chartData.by_category),
            backgroundColor: [
                '#3B82F6', // blue-500
                '#EF4444', // red-500
                '#F59E0B', // amber-500
                '#10B981', // emerald-500
                '#8B5CF6', // violet-500
                '#EC4899', // pink-500
            ],
            borderColor: 'white',
            borderWidth: 2,
        },
    ],
};

// Konfigurasi Data untuk Grafik Batang (Aset per Lokasi)
const barChartData = {
    labels: Object.keys(chartData.by_location),
    datasets: [
        {
            label: 'Jumlah Aset',
            data: Object.values(chartData.by_location),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
        },
    ],
};
```

### 1.3.6 VITE 7.0.4

Vite adalah build tool modern yang sangat cepat untuk development dan production build. YAMS menggunakan **Vite versi 7.0.4** dengan plugin:
- `@vitejs/plugin-react` - Dukungan React dengan Fast Refresh
- `laravel-vite-plugin` - Integrasi dengan Laravel

**Commands:**
```bash
npm run dev      # Development server
npm run build    # Production build
```

### 1.3.7 HEROICONS & LUCIDE REACT

YAMS menggunakan dua library icon:
- **@heroicons/react** - Icon set dari tim Tailwind CSS
- **lucide-react** - Icon set yang ringan dan konsisten

**Contoh penggunaan:**
```tsx
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Settings, User } from 'lucide-react';
```

### 1.3.8 REACT-HOT-TOAST

Library untuk menampilkan notifikasi toast yang ringan dan customizable.

**Contoh penggunaan di YAMS:**

> 📁 **File:** `resources/js/layouts/app-layout.tsx`  
> 📍 **Baris:** 27-35

```tsx
useEffect(() => {
    if (flash?.message) {
        toast.success(flash.message);
    }
    if (flash?.error) {
        toast.error(flash.error);
    }
}, [flash]);
```

### 1.3.9 ZIGGY-JS

Ziggy memungkinkan penggunaan Laravel named routes di JavaScript/TypeScript.

**Contoh penggunaan:**
```tsx
import { route } from 'ziggy-js';

// Generate URL dari nama route Laravel
const url = route('assets.show', { asset: 123 });
// Output: /assets/123
```

### 1.3.10 NODE.JS

Node.js adalah runtime environment untuk JavaScript yang bersifat open-source dan cross-platform. YAMS memerlukan **Node.js versi 18.x atau lebih tinggi** untuk menjalankan development server dan build tools.

### 1.3.11 GIT & GITHUB

Git adalah version control system (VCS) yang digunakan untuk mengelola perubahan kode. GitHub digunakan sebagai platform kolaborasi untuk menyimpan repository kode YAMS.

### 1.3.12 TYPESCRIPT 5.7

TypeScript adalah superset JavaScript yang menambahkan static typing. YAMS menggunakan TypeScript untuk:
- Mencegah bug pada compile time
- Autocomplete dan IntelliSense yang lebih baik
- Dokumentasi kode yang lebih jelas

---

# BAB 2 PENGEMBANGAN

## 2.1 PERSIAPAN

### 2.1.1 Tahap Pertama – Prerequisites

Sebelum memulai pengembangan, pastikan komputer Anda sudah terinstall:

| Software | Versi Minimum | Keterangan |
|----------|---------------|------------|
| Node.js | 18.x | Runtime JavaScript |
| npm | 9.x | Package manager |
| Git | 2.x | Version control |
| PHP | 8.2 | Backend Laravel |
| Composer | 2.x | PHP package manager |
| VS Code | Latest | Text editor (recommended) |

### 2.1.2 Tahap Kedua – Clone Repository

Buka Command Prompt atau Terminal, navigasi ke folder yang diinginkan, lalu jalankan perintah berikut:

```bash
git clone <URL_REPOSITORY_YAMS>
```

> **📸 Gambar 1** - Tampilan halaman Github Repository "YAMS"

> **📸 Gambar 2** - Tampilan Command Prompt saat melakukan git clone

### 2.1.3 Tahap Ketiga – Menuju Folder Project

Setelah clone selesai, masuk ke folder project:

```bash
cd YAMS
```

Kemudian buka dengan VS Code:

```bash
code .
```

> **📸 Gambar 3** - Tampilan VS Code setelah membuka folder project

### 2.1.4 Tahap Keempat – Install Dependencies

Buka Terminal di VS Code (Ctrl + `) atau klik menu **Terminal > New Terminal**, lalu jalankan:

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

> **📸 Gambar 4** - Tampilan terminal saat npm install

Tunggu proses instalasi selesai. Folder `node_modules` akan muncul di project.

### 2.1.5 Tahap Kelima – Konfigurasi Environment

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Sesuaikan konfigurasi database di file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yams
DB_USERNAME=root
DB_PASSWORD=
```

### 2.1.6 Tahap Keenam – Menjalankan Aplikasi

Jalankan development server untuk frontend dan backend:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

> **📸 Gambar 5** - Tampilan terminal saat menjalankan npm run dev

Aplikasi akan berjalan di:
- Backend: `http://localhost:8000`
- Frontend Dev Server: `http://localhost:5173`

> **📸 Gambar 6** - Tampilan Landing Page YAMS

> **📸 Gambar 7** - Tampilan Dashboard YAMS setelah login

---

## 2.2 DESKRIPSI FOLDER & FILE

Pada source code yang sudah diunduh, terdapat beberapa folder dan file penting yang akan dijelaskan sebagai berikut:

> **📸 Gambar 8** - Struktur folder resources/js

### 2.2.1 /resources/js

Folder utama yang berisi semua kode frontend React/TypeScript.

```
resources/js/
├── actions/                    # Server actions (optional)
├── components/                 # ⭐ Reusable components
│   ├── ui/                    # Base UI components (Radix UI)
│   ├── ConfirmationModal.tsx  # Modal konfirmasi
│   ├── NotificationBell.tsx   # Komponen notifikasi
│   ├── Pagination.tsx         # Komponen pagination
│   └── landing-navbar.tsx     # Navbar landing page
├── hooks/                     # Custom React hooks
│   ├── use-debounce.ts       # Hook untuk debounce
│   └── use-media-query.ts    # Hook untuk responsive
├── layouts/                   # Layout components
│   ├── app-layout.tsx        # Layout utama (authenticated)
│   ├── auth-layout.tsx       # Layout halaman auth
│   └── settings-layout.tsx   # Layout settings
├── lib/                       # Utility functions
│   └── utils.ts              # Helper functions (cn, dll)
├── pages/                     # ⭐ Page components
│   ├── welcome.tsx           # Landing page
│   ├── dashboard.tsx         # Dashboard
│   ├── Assets/               # Halaman manajemen aset
│   ├── Formulas/             # Halaman formula
│   ├── Calculator/           # Halaman kalkulator
│   ├── Reports/              # Halaman laporan
│   ├── Users/                # Halaman manajemen user
│   ├── settings/             # Halaman settings
│   └── auth/                 # Halaman authentication
├── types/                     # TypeScript type definitions
├── app.tsx                    # Root App component
├── ssr.tsx                    # SSR entry point
└── ziggy.js                   # Laravel routes helper
```

### 2.2.2 /resources/js/components

Folder ini berisi komponen-komponen reusable yang dapat digunakan di berbagai halaman.

#### /components/ui

Berisi komponen UI dasar yang dibangun dengan Radix UI + Tailwind CSS:

| File | Deskripsi |
|------|-----------|
| `button.tsx` | Komponen tombol dengan berbagai variant |
| `card.tsx` | Komponen card/container |
| `dialog.tsx` | Modal dialog |
| `input.tsx` | Input field |
| `select.tsx` | Dropdown select |
| `checkbox.tsx` | Checkbox input |
| `badge.tsx` | Badge/label |
| `tooltip.tsx` | Tooltip hover |
| `skeleton.tsx` | Loading skeleton |
| `spinner.tsx` | Loading spinner |

#### Komponen Utama

| File | Deskripsi |
|------|-----------|
| `NotificationBell.tsx` | Dropdown notifikasi di header |
| `ConfirmationModal.tsx` | Modal konfirmasi untuk aksi delete |
| `Pagination.tsx` | Komponen pagination untuk tabel |
| `app-sidebar.tsx` | Sidebar navigasi utama |

### 2.2.3 /resources/js/pages

Folder ini berisi komponen halaman yang di-render oleh Inertia.js.

#### /pages/Assets

| File | Deskripsi |
|------|-----------|
| `Index.tsx` | Daftar semua aset (tabel + filter) |
| `Create.tsx` | Form tambah aset baru |
| `Edit.tsx` | Form edit aset |
| `Show.tsx` | Detail aset |

#### /pages/auth

| File | Deskripsi |
|------|-----------|
| `login.tsx` | Halaman login |
| `register.tsx` | Halaman registrasi |
| `forgot-password.tsx` | Halaman lupa password |
| `reset-password.tsx` | Halaman reset password |
| `verify-email.tsx` | Halaman verifikasi email |
| `two-factor-challenge.tsx` | Halaman 2FA |

### 2.2.4 /resources/js/types

Folder ini berisi definisi TypeScript types untuk seluruh aplikasi.

**Contoh types utama:**

```typescript
// User type
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  two_factor_enabled: boolean;
}

// Asset type
export interface Asset {
  id: number;
  name: string;
  asset_code: string;
  unit_code: string;
  type: string;
  purchase_price: number;
  current_book_value?: number;
  useful_life: number;
  salvage_value: number;
  depreciation_type: 'depreciation' | 'appreciation';
  status: string;
  // ... dan lainnya
}

// Paginated data type
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
```

### 2.2.5 /resources/js/layouts

Folder ini berisi komponen layout yang membungkus halaman.

| File | Deskripsi |
|------|-----------|
| `app-layout.tsx` | Layout utama dengan sidebar & header |
| `auth-layout.tsx` | Layout untuk halaman login/register |
| `settings-layout.tsx` | Layout untuk halaman settings |

### 2.2.6 File Konfigurasi Penting

| File | Deskripsi |
|------|-----------|
| `vite.config.ts` | Konfigurasi Vite build tool |
| `tsconfig.json` | Konfigurasi TypeScript |
| `tailwind.config.js` | Konfigurasi Tailwind CSS |
| `package.json` | Dependencies dan scripts |
| `components.json` | Konfigurasi shadcn/ui |

---

## 2.3 PENAMBAHAN FITUR

### 2.3.1 MENAMBAH HALAMAN BARU

#### Langkah 1 - Buat Route di Laravel

Buka file `routes/web.php` dan tambahkan route baru:

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    // Route yang sudah ada...
    
    // Tambahkan route baru
    Route::get('/nama-fitur', [NamaController::class, 'index'])
        ->name('nama-fitur.index');
});
```

#### Langkah 2 - Buat Controller

Buat controller baru di `app/Http/Controllers`:

```php
// app/Http/Controllers/NamaController.php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class NamaController extends Controller
{
    public function index()
    {
        return Inertia::render('NamaFitur/Index', [
            'data' => [], // Data yang dikirim ke frontend
        ]);
    }
}
```

#### Langkah 3 - Buat Komponen Page

Buat file baru di `resources/js/pages/NamaFitur/Index.tsx`:

```tsx
// resources/js/pages/NamaFitur/Index.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IndexProps {
  data: any[];
}

export default function Index({ data }: IndexProps) {
  return (
    <AppLayout title="Nama Fitur">
      <Head title="Nama Fitur" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Nama Fitur</h1>

        <Card>
          <CardHeader>
            <CardTitle>Konten Fitur</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Isi konten di sini */}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
```

#### Langkah 4 - Tambahkan Menu di Sidebar

Buka file `resources/js/components/app-sidebar.tsx` dan tambahkan menu baru:

```tsx
// Di bagian array navItems, tambahkan:
{
  title: 'Nama Fitur',
  href: route('nama-fitur.index'),
  icon: <IconComponent className="h-5 w-5" />,
}
```

> **📸 Gambar 9** - Contoh tampilan halaman baru yang ditambahkan

---

### 2.3.2 MANAJEMEN ASET

Fitur Manajemen Aset adalah fitur utama YAMS. Berikut penjelasan struktur kodenya:

#### File: pages/Assets/Index.tsx

File ini menampilkan daftar semua aset dalam bentuk tabel dengan fitur:
- Search/filter
- Pagination
- Sorting
- Export Excel/PDF

> **📸 Gambar 9** - Tampilan halaman Daftar Aset

**Struktur Kode Utama:**

> 📁 **File:** `resources/js/pages/Assets/Index.tsx`  
> 📍 **Baris:** 59-80 (Interface & State)

```tsx
export default function Index({ assets, filters }: IndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const hasMountedRef = useRef(false);

    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });
    // ...
}
```

> 📍 **Baris:** 139-158 (useEffect untuk Search)

```tsx
useEffect(() => {
    // Hindari menimpa query ?page saat first render
    if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
    }

    const baseUrl = absRoute('assets.index');
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);

    const target = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

    router.visit(target, {
        preserveState: true,
        replace: true,
        preserveScroll: true,
    });
}, [debouncedSearchTerm]);
```

#### File: pages/Assets/Create.tsx

File ini berisi form untuk menambahkan aset baru.

> **📸 Gambar 10** - Tampilan halaman Tambah Aset

**Struktur Form dengan useForm:**

> 📁 **File:** `resources/js/pages/Assets/Create.tsx`  
> 📍 **Baris:** 17-68

```tsx
export default function Create({ nextAssetCode, nextUnitCode }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        room_name: string;
        location: string;
        floor: string;
        asset_code: string;
        unit_code: string;
        received_date: string;
        purchase_price: string;
        useful_life: number;
        salvage_value: number;
        type: string;
        depreciation_type: string;
        custom_depreciation_rate: string;
        brand: string;
        serial_number: string;
        quantity: number;
        status: string;
        description: string;
        user_assigned: string;
        inventory_status: string;
        photo: File | null;
    }>({
        name: '',
        room_name: '',
        location: '',
        floor: '',
        asset_code: nextAssetCode,
        unit_code: nextUnitCode,
        received_date: '',
        purchase_price: '',
        useful_life: 5,
        salvage_value: 0,
        type: '',
        depreciation_type: 'depreciation',
        custom_depreciation_rate: '',
        brand: '',
        serial_number: '',
        quantity: 1,
        status: 'Baik',
        description: '',
        user_assigned: '',
        inventory_status: '',
        photo: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(absRoute('assets.store'));
    }
    // ...
}
```

> 📍 **Baris:** 76-86 (Contoh Form Input)

```tsx
<div>
    <label htmlFor="room_name" className="block text-sm font-medium text-gray-700">Nama Ruang</label>
    <input type="text" id="room_name" value={data.room_name} onChange={(e) => setData('room_name', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
    {errors.room_name && <div className="mt-1 text-sm text-red-600">{errors.room_name}</div>}
</div>
```

#### File: pages/Assets/Edit.tsx

File ini mirip dengan Create.tsx, namun menggunakan data aset yang sudah ada.

> **📸 Gambar 11** - Tampilan halaman Edit Aset

**Perbedaan dengan Create:**

> 📁 **File:** `resources/js/pages/Assets/Edit.tsx`  
> 📍 **Baris:** 38-42

```tsx
export default function Edit({ asset }: { asset: Asset }) {
    // Initialize form dengan data existing dari asset
    // ...
}
```

#### File: pages/Assets/Show.tsx

File ini menampilkan detail lengkap dari satu aset.

> **📸 Gambar 12** - Tampilan halaman Detail Aset

---

### 2.3.3 MANAJEMEN FORMULA DEPRESIASI

Fitur Formula memungkinkan admin mengatur rumus perhitungan depresiasi/apresiasi.

> **📸 Gambar 13** - Tampilan halaman Manajemen Formula

**File: pages/Formulas/Index.tsx**

> 📁 **File:** `resources/js/pages/Formulas/Index.tsx`  
> 📍 **Baris:** 24-35 (State & Filter)

```tsx
export default function FormulaIndex({ formulas, variables }: FormulaPageProps) {
    const { data, setData, post, reset } = useForm({
        name: '',
        expression: '',
        description: '',
        type: 'depreciation' as 'depreciation' | 'appreciation',
    });

    const depreciationFormulas = formulas.filter(f => f.type === 'depreciation');
    const appreciationFormulas = formulas.filter(f => f.type === 'appreciation');
    // ...
}
```

> 📍 **Baris:** 56-79 (Card Rumus Penyusutan)

```tsx
{depreciationFormulas.map((formula: Formula) => (
    <div key={formula.id} className={`p-4 border rounded-lg ${formula.is_active ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start mb-2">
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold">{formula.name}</h3>
                    {formula.is_active && <Badge className="bg-red-500">Aktif</Badge>}
                </div>
                <code className="text-sm bg-gray-100 p-1 rounded mt-1 block w-fit">
                    {formula.expression}
                </code>
            </div>
        </div>
        <div className="flex gap-2 mt-2">
            {!formula.is_active && (
                <Button size="sm" variant="outline" onClick={() => router.post(route('formulas.activate', formula.id))}>
                    Gunakan
                </Button>
            )}
            <Button size="sm" variant="destructive" onClick={() => router.delete(route('formulas.destroy', formula.id))}>
                Hapus
            </Button>
        </div>
    </div>
))}
```
---

### 2.3.4 KALKULATOR FORMULA

Fitur kalkulator untuk menguji formula depresiasi sebelum diterapkan.

> **📸 Gambar 14** - Tampilan halaman Kalkulator Formula

**File: pages/Calculator/Index.tsx**

> 📁 **File:** `resources/js/pages/Calculator/Index.tsx`  
> 📍 **Baris:** 45-dst

Lihat file asli untuk struktur lengkap kalkulator.

---

### 2.3.5 LAPORAN

Fitur laporan untuk mengekspor data aset ke Excel dan PDF.

> **📸 Gambar 15** - Tampilan halaman Laporan

**File: pages/Reports/Index.tsx**

> 📁 **File:** `resources/js/pages/Reports/Index.tsx`  
> 📍 **Baris:** 19-51 (State & useEffect Filter)

```tsx
export default function Index({ assets, filters, categories, summary }: ReportProps) {
    const [category, setCategory] = useState(filters.category || 'Semua');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [year, setYear] = useState(filters.year || '');

    const currentYear = new Date().getFullYear();

    const [debouncedCategory] = useDebounce(category, 300);
    const [debouncedSortBy] = useDebounce(sortBy, 300);
    const [debouncedYear] = useDebounce(year, 300);

    const isInitialMount = React.useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const queryParams: Record<string, string> = {};
        if (debouncedCategory !== 'Semua') queryParams.category = debouncedCategory;
        if (debouncedSortBy !== 'id') queryParams.sort_by = debouncedSortBy;
        if (debouncedYear !== '') queryParams.year = debouncedYear;

        router.get(route('reports.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedCategory, debouncedSortBy, debouncedYear]);
    // ...
}
```

> 📍 **Baris:** 56-62 (Summary Cards)

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
        <div className="text-sm text-gray-500">Total Aset</div>
        <div className="text-2xl font-bold text-gray-800 mt-1">{summary.total_assets} item</div>
    </div>
    {/* ... card lainnya */}
</div>
```

---

### 2.3.6 MANAJEMEN USER

Fitur untuk SuperAdmin mengelola user dan role.

> **📸 Gambar 16** - Tampilan halaman Manajemen User

**File: pages/Users/Index.tsx**

> 📁 **File:** `resources/js/pages/Users/Index.tsx`  
> 📍 **Baris:** 61-77 (State & Handler)

```tsx
export default function Index({ users, activityLogs }: UserIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.roles.includes('superadmin');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [activityTab, setActivityTab] = useState<'all' | 'user' | 'asset'>('all');
    const [activityPage, setActivityPage] = useState(1);
    const itemsPerPage = 10;

    const openDeleteModal = (user: User) => { 
        setUserToDelete(user); 
        setIsDeleteModalOpen(true); 
    };
    const closeDeleteModal = () => { 
        setIsDeleteModalOpen(false); 
        setUserToDelete(null); 
    };
    const confirmDelete = () => { 
        if (!userToDelete) return; 
        router.delete(route('users.destroy', userToDelete.id), { 
            onSuccess: () => closeDeleteModal(), 
            preserveScroll: true 
        }); 
    };
    // ...
}
```

---

### 2.3.7 KOMPONEN NOTIFIKASI

Komponen NotificationBell menampilkan notifikasi real-time di header.

> **📸 Gambar 17** - Tampilan komponen NotificationBell

**File: components/NotificationBell.tsx**

> 📁 **File:** `resources/js/components/NotificationBell.tsx`  
> 📍 **Baris:** 1-13 (Interface)

```tsx
import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    created_at: string;
}
```

> 📍 **Baris:** 14-44 (State & loadNotifications)

```tsx
export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = async () => {
        try {
            const response = await fetch(route('notifications.index'), {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (!response.ok) throw new Error(`Load failed: ${response.status}`);
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);
    // ...
}
```

> 📍 **Baris:** 45-60 (handleMarkAsRead)

```tsx
const handleMarkAsRead = async (notificationId: number) => {
    try {
        const response = await fetch(route('notifications.mark-as-read', notificationId), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        });
        if (!response.ok) throw new Error(`Mark read failed: ${response.status}`);
        const data = await response.json();
        setUnreadCount(typeof data.unread_count === 'number' ? data.unread_count : unreadCount);
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};
```

---

### 2.3.8 MEMBUAT KOMPONEN UI BARU

Untuk membuat komponen UI baru yang konsisten dengan design system YAMS:

#### Langkah 1 - Buat File Komponen

**Contoh komponen Button yang sudah ada:**

> 📁 **File:** `resources/js/components/ui/button.tsx`  
> 📍 **Baris:** 1-57 (Seluruh file)

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

> **📸 Gambar 20** - Struktur kode komponen Button dengan CVA

#### Langkah 2 - Export dari Index

Tambahkan export di file index atau gunakan langsung:

```tsx
// Penggunaan
import { Alert } from '@/components/ui/alert';

<Alert variant="success">
  Aset berhasil ditambahkan!
</Alert>
```

---

### 2.3.9 AUTHENTICATION PAGES

YAMS menggunakan Laravel Fortify untuk authentication dengan UI React.

> **📸 Gambar 23** - Tampilan halaman Login

> **📸 Gambar 24** - Tampilan halaman Register

**File: pages/auth/login.tsx**

> 📁 **File:** `resources/js/pages/auth/login.tsx`  
> 📍 **Baris:** 11-26 (useForm & submit)

```tsx
export default function Login({ status }: { status?: string }) {
    const { flash } = usePage().props as { flash?: { error?: string } };

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
    // ...
}
```

> 📍 **Baris:** 29-66 (Layout Visual Kiri - Gambar Kampus)

```tsx
return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">

        {/* BAGIAN KIRI (Visual: Gambar Kampus) */}
        <div className="hidden lg:block relative h-full w-full overflow-hidden bg-muted">
            <img
                src="/images/kampus-yarsi.jpg"
                alt="Kampus Universitas Yarsi"
                className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
            />
            <div className="absolute inset-0 bg-zinc-900/80 mix-blend-multiply" />
            
            <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                <div className="flex items-center text-lg font-medium">
                    <ShieldCheck className="mr-2 h-6 w-6" />
                    YAMS (Yarsi Asset Management System)
                </div>
                <div className="space-y-4">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-light leading-relaxed drop-shadow-md">
                            &ldquo;Sistem terintegrasi untuk pengelolaan aset kampus...&rdquo;
                        </p>
                        <footer className="text-sm font-semibold opacity-90">
                            — Universitas Yarsi
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>

        {/* BAGIAN KANAN (Form Login) */}
        {/* ... */}
    </div>
);
```

---

## 2.4 BEST PRACTICES            <div className="mt-4 text-center text-sm">
              Belum punya akun?{' '}
              <Link href={route('register')} className="text-[#0C7E46] hover:underline">
                Daftar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
```

---

## 2.4 BEST PRACTICES

### 2.4.1 TypeScript Usage

> 📁 **Contoh dari:** `resources/js/pages/dashboard.tsx` Baris 45-58

```tsx
// ✅ GOOD: Define proper types
interface DashboardProps {
    latestAssets: {
        data: Asset[];
        links: any[];
        from: number;
    };
    summaryData: {
        total_assets: number;
        total_purchase_value: number;
        total_depreciation: number;
        current_book_value: number;
    };
    chartData: {
        by_category: Record<string, number>;
        by_location: Record<string, number>;
    };
}

export default function Dashboard({ latestAssets, summaryData, chartData }: DashboardProps) {
  // ...
}

// ❌ BAD: Using any
export default function Dashboard({ stats }: any) {
  // ...
}
```

### 2.4.2 Form Handling

> 📁 **Contoh dari:** `resources/js/pages/Assets/Create.tsx` Baris 17-68

```tsx
// ✅ GOOD: Use Inertia's useForm
const { data, setData, post, processing, errors } = useForm({
  name: '',
  purchase_price: '',
  // ...
});

function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(absRoute('assets.store'));
}

// ❌ BAD: Manual state management dengan axios
const [name, setName] = useState('');
const [errors, setErrors] = useState({});
// axios.post('/api/assets', { name })...
```

### 2.4.3 Navigation

> 📁 **Contoh dari:** `resources/js/pages/Assets/Index.tsx` Baris 139-158

```tsx
// ✅ GOOD: Use Inertia router
router.visit(target, {
    preserveState: true,
    replace: true,
    preserveScroll: true,
});

// ✅ GOOD: Use Inertia Link
<Link href={absRoute('assets.create')}>Tambah Aset</Link>

// ❌ BAD: Using window.location
window.location.href = '/dashboard';
```

### 2.4.4 Component Organization

- Gunakan **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- Pisahkan logic ke **custom hooks** jika reusable
- Gunakan **composition over inheritance**

### 2.4.5 Performance

> 📁 **Contoh dari:** `resources/js/pages/Assets/Index.tsx` Baris 67-68

```tsx
// ✅ GOOD: Debounce search input
const [searchTerm, setSearchTerm] = useState(filters.search || '');
const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

// ✅ GOOD: Lazy loading images
<img loading="lazy" src={asset.photo} alt={asset.name} />
```

---

# BAB 3 PENUTUP

## 3.1 KESIMPULAN

Alhamdulillah, dengan rahmat dan berkah dari Allah SWT, Manual Book Pengembangan (Front-End) untuk aplikasi YAMS telah berhasil disusun. Manual Book ini telah dirancang untuk memberikan panduan yang jelas dan praktis bagi pengembang selanjutnya dalam mengembangkan aplikasi YAMS.

Dengan adanya panduan ini, diharapkan tim pengembang berikutnya dapat memahami dan melanjutkan pengembangan aplikasi dengan lebih efektif dan efisien. Beberapa poin penting yang telah dibahas:

1. **Tech Stack Modern** - YAMS menggunakan React 19, TypeScript, Tailwind CSS 4, dan Inertia.js yang merupakan teknologi terkini dalam pengembangan web.

2. **Arsitektur yang Terstruktur** - Kode diorganisir dengan baik menggunakan pola komponen, hooks, dan layouts yang memudahkan maintenance dan scaling.

3. **Type-Safe Development** - Penggunaan TypeScript memastikan kode lebih aman dan mudah di-debug.

4. **UI Konsisten** - Design system menggunakan Radix UI dan Tailwind CSS memastikan tampilan yang konsisten di seluruh aplikasi.

5. **Integrasi Seamless** - Inertia.js menjembatani Laravel dan React tanpa perlu API terpisah.

## 3.2 SARAN

Kami menyarankan agar tim pengembang selanjutnya terus melakukan inovasi dan pengembangan fitur-fitur aplikasi YAMS, antara lain:

### Fitur yang Dapat Dikembangkan:

1. **QR Code Scanner** - Scan QR code pada aset untuk melihat detail dan update status secara cepat menggunakan kamera smartphone.

2. **Mobile App (React Native)** - Mengembangkan aplikasi mobile native menggunakan React Native yang dapat share codebase dengan web.

3. **Dashboard Analytics Lanjutan** - Menambahkan visualisasi data yang lebih kompleks seperti trend analysis, forecasting, dan comparison reports.

4. **Bulk Operations** - Fitur untuk melakukan operasi massal seperti import data dari Excel, bulk update, dan bulk delete.

5. **Audit Trail** - Sistem pencatatan semua perubahan pada data aset untuk keperluan audit dan compliance.

6. **Integration API** - Menyediakan REST API untuk integrasi dengan sistem lain seperti ERP atau sistem keuangan kampus.

7. **Dark Mode** - Implementasi dark mode untuk kenyamanan pengguna.

8. **Multi-language Support** - Dukungan bahasa Indonesia dan Inggris.

### Catatan Teknis:

- Selalu update dependencies secara berkala untuk keamanan
- Implementasikan unit testing dan integration testing
- Gunakan CI/CD untuk automated deployment
- Dokumentasikan setiap perubahan di changelog

Terima kasih kepada semua pihak yang telah berkontribusi dalam proyek ini. Semoga Allah SWT selalu memberikan keberkahan dan kemudahan dalam setiap langkah kita.

---

**Dibuat dengan ❤️ untuk Tim Pengembang YAMS**  
**Last Updated: Januari 2026**

---

## LAMPIRAN

### A. Daftar Commands

| Command | Deskripsi |
|---------|-----------|
| `npm install` | Install semua dependencies |
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run lint` | Jalankan ESLint |
| `npm run format` | Format kode dengan Prettier |
| `npm run types` | Type checking TypeScript |

### B. Environment Variables

```env
# Application
APP_NAME=YAMS
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Vite
VITE_APP_NAME="${APP_NAME}"

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yams
DB_USERNAME=root
DB_PASSWORD=
```

### C. Referensi

- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Radix UI Documentation](https://radix-ui.com)
- [TypeScript Documentation](https://typescriptlang.org)
- [Laravel Documentation](https://laravel.com/docs)
