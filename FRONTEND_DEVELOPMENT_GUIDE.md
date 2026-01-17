# 🎨 MANUAL PENGEMBANGAN FRONTEND - YAMS

**Yet Another Management System (YAMS)**  
**Sistem Manajemen Aset & Depresiasi Universitas Yarsi**

---

## 📋 DAFTAR ISI

1. [Arsitektur Frontend](#arsitektur-frontend)
2. [Setup & Instalasi](#setup--instalasi)
3. [Struktur Direktori](#struktur-direktori)
4. [Tech Stack & Dependencies](#tech-stack--dependencies)
5. [Pages & Routing](#pages--routing)
6. [Components](#components)
7. [Layouts](#layouts)
8. [State Management](#state-management)
9. [Forms & Validation](#forms--validation)
10. [Styling & UI](#styling--ui)
11. [Inertia.js Integration](#inertiajs-integration)
12. [TypeScript Types](#typescript-types)
13. [Best Practices](#best-practices)
14. [Testing](#testing)

---

## 🏗️ ARSITEKTUR FRONTEND

### **Tech Stack**

```
├── Framework: React 19.2
├── Language: TypeScript 5.7
├── Bridge: Inertia.js 2.1.4
├── Build Tool: Vite 7.0.4
├── Styling: Tailwind CSS 4.0
├── UI Library: Radix UI + Custom Components
├── Icons: Heroicons + Lucide React
├── Charts: Chart.js + react-chartjs-2
├── Notifications: react-hot-toast
├── Forms: useForm (Inertia.js)
└── Routing: Ziggy (Laravel routes di frontend)
```

### **Design Pattern**

- **Component-Based Architecture**: Reusable UI components
- **Page Components**: Full-page components rendered oleh Inertia
- **Layout Components**: Wrapper untuk authenticated/non-authenticated pages
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Composition over Inheritance**: React hooks & composition

### **Key Features**

1. **SSR-Ready** dengan Inertia.js (Server-Side Rendering optional)
2. **Type-Safe** dengan TypeScript
3. **Responsive Design** mobile-first approach
4. **Accessible** WCAG 2.1 AA compliant
5. **Real-time Updates** via Inertia.js
6. **Optimistic UI** untuk better UX
7. **Code Splitting** automatic dengan Vite

---

## 🚀 SETUP & INSTALASI

### **Prerequisites**

```bash
- Node.js >= 18.x
- npm >= 9.x atau pnpm >= 8.x
- Git
```

### **Instalasi Dependencies**

```bash
# Install semua dependencies
npm install

# Atau gunakan pnpm (lebih cepat)
pnpm install
```

### **Development**

```bash
# Start Vite dev server
npm run dev

# Dev server akan jalan di http://localhost:5173
# Laravel Vite plugin akan proxy ke Laravel app

# Build untuk production
npm run build

# Build dengan SSR
npm run build:ssr

# Type checking
npm run types

# Linting
npm run lint

# Format code
npm run format
```

### **Environment Variables**

```env
# .env
VITE_APP_NAME=YAMS
VITE_APP_URL=http://localhost:8000
```

---

## 📁 STRUKTUR DIREKTORI

```
resources/js/
├── actions/                     # Server actions (optional)
│
├── components/                  # ⭐ Reusable components
│   ├── ui/                     # ⭐ Base UI components (Radix UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   └── ...
│   │
│   ├── ConfirmationModal.tsx   # Confirmation dialog
│   ├── NotificationBell.tsx    # ⭐ Notification dropdown
│   ├── Pagination.tsx          # Custom pagination
│   └── landing-navbar.tsx      # Landing page navbar
│
├── hooks/                      # Custom React hooks
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── layouts/                    # ⭐ Layout components
│   ├── app-layout.tsx          # ⭐ Main authenticated layout
│   ├── auth-layout.tsx         # Auth pages layout
│   ├── settings-layout.tsx     # Settings pages layout
│   └── partials/
│       ├── Sidebar.tsx         # ⭐ Navigation sidebar
│       └── Header.tsx          # Header component
│
├── lib/                        # Utility functions
│   └── utils.ts                # Helper functions (cn, etc)
│
├── pages/                      # ⭐ Page components
│   ├── welcome.tsx             # ⭐ Landing page
│   ├── dashboard.tsx           # ⭐ Dashboard
│   │
│   ├── Assets/                 # ⭐ Asset management
│   │   ├── Index.tsx           # List view
│   │   ├── Create.tsx          # Create form
│   │   ├── Edit.tsx            # Edit form
│   │   └── Show.tsx            # Detail view
│   │
│   ├── Formulas/               # Formula management
│   │   └── Index.tsx
│   │
│   ├── Calculator/             # Formula calculator
│   │   └── Index.tsx
│   │
│   ├── Reports/                # Reports
│   │   └── Index.tsx
│   │
│   ├── Users/                  # User management
│   │   ├── Index.tsx
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   │
│   ├── settings/               # Settings
│   │   └── General.tsx
│   │
│   └── auth/                   # Authentication
│       ├── login.tsx
│       ├── register.tsx
│       ├── forgot-password.tsx
│       ├── reset-password.tsx
│       ├── verify-email.tsx
│       ├── two-factor-challenge.tsx
│       └── confirm-password.tsx
│
├── routes/                     # Route definitions (optional)
│
├── types/                      # ⭐ TypeScript type definitions
│   └── index.ts                # ⭐ Global types
│
├── wayfinder/                  # Laravel Wayfinder (optional)
│
├── app.tsx                     # ⭐ Root App component
├── ssr.tsx                     # SSR entry point
└── ziggy.js                    # Laravel routes helper

public/
└── storage/
    └── asset-photos/           # Uploaded asset photos

resources/css/
└── app.css                     # Global CSS & Tailwind imports
```

---

## 🧩 TECH STACK & DEPENDENCIES

### **Core Dependencies**

```json
{
  "dependencies": {
    // React & Core
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "typescript": "^5.7.2",
    
    // Inertia.js (Laravel-React Bridge)
    "@inertiajs/react": "^2.1.4",
    
    // Routing
    "ziggy-js": "^2.6.0",
    "react-router-dom": "^7.9.6",
    
    // UI Components
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@headlessui/react": "^2.2.9",
    
    // Styling
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.1.11",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.1",
    
    // Icons
    "@heroicons/react": "^2.2.0",
    "lucide-react": "^0.475.0",
    
    // Charts
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    
    // Utilities
    "react-hot-toast": "^2.6.0",
    "use-debounce": "^10.0.6",
    "input-otp": "^1.4.2"
  },
  
  "devDependencies": {
    // Build Tools
    "vite": "^7.0.4",
    "laravel-vite-plugin": "^2.0",
    "@vitejs/plugin-react": "^5.0.0",
    
    // TypeScript
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@types/node": "^22.13.5",
    
    // Linting & Formatting
    "eslint": "^9.17.0",
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.11",
    
    // React Compiler (optional)
    "babel-plugin-react-compiler": "^1.0.0"
  }
}
```

---

## 🗺️ PAGES & ROUTING

### **Routing dengan Inertia.js**

Inertia.js menggunakan **server-side routing** dari Laravel. Frontend tidak perlu define routes sendiri.

**Cara navigasi:**

```tsx
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

// Method 1: Link component (recommended)
<Link href={route('assets.index')}>
  Lihat Aset
</Link>

// Method 2: router.visit()
router.visit(route('assets.show', { asset: 123 }));

// Method 3: router.get/post/put/delete
router.get(route('dashboard'));
router.post(route('assets.store'), formData);
router.put(route('assets.update', { asset: 123 }), formData);
router.delete(route('assets.destroy', { asset: 123 }));
```

### **Page: welcome.tsx** (Landing Page)

```tsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import LandingNavbar from '@/components/landing-navbar';

interface WelcomeProps {
  canRegister: boolean;
}

export default function Welcome({ canRegister }: WelcomeProps) {
  return (
    <>
      <Head title="Selamat Datang - YAMS" />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <LandingNavbar canRegister={canRegister} />
        
        {/* Hero Section */}
        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Kelola Aset Kampus dengan <span className="text-[#0C7E46]">Cerdas</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Sistem manajemen aset terintegrasi dengan perhitungan depresiasi otomatis
                  untuk Universitas Yarsi.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href={route('login')}
                    className="rounded-md bg-[#0C7E46] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0a6838] transition"
                  >
                    Mulai Sekarang
                  </Link>
                  <a
                    href="#fitur"
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#0C7E46] transition"
                  >
                    Pelajari Fitur <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative">
                <img
                  src="/images/kampus-yarsi.jpg"
                  alt="Universitas Yarsi"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16">
              Fitur Unggulan YAMS
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature Card 1 */}
              <div className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="mb-4 inline-flex rounded-lg bg-[#0C7E46]/10 p-3">
                  <ChartBarIcon className="h-6 w-6 text-[#0C7E46]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Penyusutan Otomatis
                </h3>
                <p className="text-sm text-gray-600">
                  Perhitungan depresiasi/apresiasi aset secara otomatis dengan formula yang dapat disesuaikan
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="mb-4 inline-flex rounded-lg bg-[#0C7E46]/10 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-[#0C7E46]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Pelacakan Lengkap
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor semua aset dengan detail lokasi, pengguna, dan riwayat perubahan nilai
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="mb-4 inline-flex rounded-lg bg-[#0C7E46]/10 p-3">
                  <DocumentArrowDownIcon className="h-6 w-6 text-[#0C7E46]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Laporan Komprehensif
                </h3>
                <p className="text-sm text-gray-600">
                  Export laporan ke Excel dan PDF dengan filtering dan sorting yang fleksibel
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="mb-4 inline-flex rounded-lg bg-[#0C7E46]/10 p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-[#0C7E46]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Akses Berbasis Role
                </h3>
                <p className="text-sm text-gray-600">
                  Sistem keamanan dengan role SuperAdmin, Admin, dan User untuk kontrol akses yang jelas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0C7E46] px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Siap Memulai?
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Bergabunglah dengan sistem manajemen aset modern untuk institusi Anda
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={route('login')}
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#0C7E46] shadow-sm hover:bg-gray-100 transition"
              >
                Masuk Sekarang
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 px-6 py-12">
          <div className="mx-auto max-w-7xl text-center text-sm text-gray-400">
            <p>&copy; 2025 YAMS - Universitas Yarsi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
```

### **Page: dashboard.tsx**

```tsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardProps {
  stats: {
    totalAssets: number;
    totalPurchaseValue: number;
    totalCurrentValue: number;
    totalAccumulatedDepreciation: number;
  };
  assetsByType: Array<{ type: string; count: number }>;
  assetsByLocation: Array<{ location: string; count: number }>;
  latestAssets: Array<any>;
}

export default function Dashboard({ stats, assetsByType, assetsByLocation, latestAssets }: DashboardProps) {
  const pieData = {
    labels: assetsByType.map(item => item.type),
    datasets: [{
      data: assetsByType.map(item => item.count),
      backgroundColor: [
        'rgba(12, 126, 70, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    }],
  };

  return (
    <AppLayout title="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Aset"
            value={stats.totalAssets}
            icon={<ArchiveBoxIcon className="h-6 w-6" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Nilai Beli"
            value={`Rp ${stats.totalPurchaseValue.toLocaleString('id-ID')}`}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            color="bg-green-500"
          />
          <StatCard
            title="Harga Saat Ini"
            value={`Rp ${stats.totalCurrentValue.toLocaleString('id-ID')}`}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="bg-[#0C7E46]"
          />
          <StatCard
            title="Total Depresiasi"
            value={`Rp ${stats.totalAccumulatedDepreciation.toLocaleString('id-ID')}`}
            icon={<ArrowTrendingDownIcon className="h-6 w-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Aset Berdasarkan Jenis</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={pieData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aset Berdasarkan Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: assetsByLocation.map(item => item.location),
                  datasets: [{
                    label: 'Jumlah Aset',
                    data: assetsByLocation.map(item => item.count),
                    backgroundColor: 'rgba(12, 126, 70, 0.8)',
                  }],
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Latest Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Aset Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Beli</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Saat Ini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {latestAssets.map(asset => (
                    <tr key={asset.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{asset.asset_code}</td>
                      <td className="px-4 py-3 text-sm">{asset.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        Rp {asset.purchase_price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        Rp {asset.current_book_value?.toLocaleString('id-ID') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full ${color} p-3 text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **Page: Assets/Create.tsx**

```tsx
import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface CreateProps {
  nextAssetCode: string;
  nextUnitCode: string;
}

export default function Create({ nextAssetCode, nextUnitCode }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    room_name: '',
    location: '',
    floor: '',
    received_date: '',
    purchase_price: '',
    useful_life: '5',
    salvage_value: '',
    type: '',
    depreciation_type: 'depreciation',
    custom_depreciation_rate: '',
    brand: '',
    serial_number: '',
    quantity: '1',
    status: 'Aktif',
    description: '',
    user_assigned: '',
    inventory_status: '',
    photo: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('assets.store'), {
      onSuccess: () => {
        toast.success('Aset berhasil ditambahkan');
      },
      onError: () => {
        toast.error('Gagal menambahkan aset');
      },
    });
  };

  return (
    <AppLayout title="Tambah Aset">
      <Head title="Tambah Aset" />

      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tambah Aset Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nama Aset *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Jenis Aset</Label>
                  <Input
                    id="type"
                    value={data.type}
                    onChange={e => setData('type', e.target.value)}
                    placeholder="Elektronik, Furniture, dll"
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Merek</Label>
                  <Input
                    id="brand"
                    value={data.brand}
                    onChange={e => setData('brand', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input
                    id="serial_number"
                    value={data.serial_number}
                    onChange={e => setData('serial_number', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lokasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={data.location}
                    onChange={e => setData('location', e.target.value)}
                    placeholder="Gedung A"
                  />
                </div>

                <div>
                  <Label htmlFor="floor">Lantai</Label>
                  <Input
                    id="floor"
                    value={data.floor}
                    onChange={e => setData('floor', e.target.value)}
                    placeholder="Lantai 1"
                  />
                </div>

                <div>
                  <Label htmlFor="room_name">Nama Ruangan</Label>
                  <Input
                    id="room_name"
                    value={data.room_name}
                    onChange={e => setData('room_name', e.target.value)}
                    placeholder="R.101"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Keuangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="received_date">Tanggal Terima *</Label>
                  <Input
                    id="received_date"
                    type="date"
                    value={data.received_date}
                    onChange={e => setData('received_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="purchase_price">Harga Beli (Rp) *</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.purchase_price}
                    onChange={e => setData('purchase_price', e.target.value)}
                    required
                  />
                  {errors.purchase_price && <p className="text-sm text-red-600 mt-1">{errors.purchase_price}</p>}
                </div>

                <div>
                  <Label htmlFor="useful_life">Umur Manfaat (Tahun) *</Label>
                  <Input
                    id="useful_life"
                    type="number"
                    min="1"
                    value={data.useful_life}
                    onChange={e => setData('useful_life', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salvage_value">Nilai Sisa (Rp) *</Label>
                  <Input
                    id="salvage_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.salvage_value}
                    onChange={e => setData('salvage_value', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="depreciation_type">Tipe Perhitungan *</Label>
                  <Select
                    value={data.depreciation_type}
                    onValueChange={value => setData('depreciation_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depreciation">Penyusutan (Depreciation)</SelectItem>
                      <SelectItem value="appreciation">Kenaikan (Appreciation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="custom_depreciation_rate">Custom Rate (%) - Opsional</Label>
                  <Input
                    id="custom_depreciation_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={data.custom_depreciation_rate}
                    onChange={e => setData('custom_depreciation_rate', e.target.value)}
                    placeholder="Kosongkan untuk gunakan formula"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jika diisi, sistem akan menggunakan rate ini dan mengabaikan formula aktif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Lainnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="quantity">Jumlah *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={data.quantity}
                    onChange={e => setData('quantity', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={data.status}
                    onValueChange={value => setData('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Rusak">Rusak</SelectItem>
                      <SelectItem value="Diperbaiki">Diperbaiki</SelectItem>
                      <SelectItem value="Hilang">Hilang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="user_assigned">Pengguna</Label>
                  <Input
                    id="user_assigned"
                    value={data.user_assigned}
                    onChange={e => setData('user_assigned', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="photo">Foto Aset</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={e => setData('photo', e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-1">Max 2MB</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Simpan Aset'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(route('assets.index'))}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
```

---

## 🧩 COMPONENTS

### **UI Components (Radix UI)**

File: `resources/js/components/ui/button.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#0C7E46] text-white hover:bg-[#0a6838]',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        link: 'text-[#0C7E46] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### **NotificationBell Component**

File: `resources/js/components/NotificationBell.tsx`

```tsx
import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
}

export function NotificationBell({ notifications, unreadCount }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (notificationId: number) => {
    router.post(route('notifications.mark-as-read', { notification: notificationId }), {}, {
      preserveScroll: true,
      onSuccess: () => {
        // Notification updated
      },
    });
  };

  const handleMarkAllAsRead = () => {
    router.post(route('notifications.mark-all-as-read'), {}, {
      preserveScroll: true,
    });
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="relative rounded-full p-2 hover:bg-gray-100 transition">
          {unreadCount > 0 ? (
            <BellIconSolid className="h-6 w-6 text-[#0C7E46]" />
          ) : (
            <BellIcon className="h-6 w-6 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          sideOffset={5}
          align="end"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#0C7E46] hover:underline"
              >
                Tandai semua sudah dibaca
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => router.visit(route('notifications.index'))}
                className="w-full text-center text-sm text-[#0C7E46] hover:underline"
              >
                Lihat Semua Notifikasi
              </button>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

---

## 🎨 LAYOUTS

### **AppLayout.tsx** (Main Authenticated Layout)

```tsx
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Sidebar from '@/layouts/partials/Sidebar';
import { NotificationBell } from '@/components/NotificationBell';
import { type SharedData } from '@/types';
import toast from 'react-hot-toast';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const { props } = usePage<SharedData>();
  const { auth, flash } = props;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show flash messages
  useEffect(() => {
    if (flash?.message) {
      toast.success(flash.message);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Auto logout after 30 minutes of inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const idleTimeoutMs = 30 * 60 * 1000; // 30 minutes

    const handleIdleLogout = () => {
      toast.error('Anda otomatis keluar setelah 30 menit tidak aktif.');
      router.post(route('logout'));
    };

    const resetTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(handleIdleLogout, idleTimeoutMs);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <>
      <Head title={title} />
      
      <div className="min-h-screen bg-[rgba(12,126,70,0.02)]">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>

              <div className="flex items-center gap-4">
                <NotificationBell
                  notifications={auth.notifications || []}
                  unreadCount={auth.unreadNotificationsCount || 0}
                />

                <div className="relative">
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
                    <img
                      src={auth.user.avatar || '/images/default-avatar.png'}
                      alt={auth.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
```

---

## 📘 TYPESCRIPT TYPES

File: `resources/js/types/index.ts`

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: 'superadmin' | 'admin' | 'user';
  display_name: string;
}

export interface Asset {
  id: number;
  name: string;
  asset_code: string;
  unit_code: string;
  type: string;
  room_name?: string;
  location?: string;
  floor?: string;
  received_date?: string;
  purchase_price: number;
  current_book_value?: number;
  last_depreciation_date?: string;
  useful_life: number;
  salvage_value: number;
  depreciation_type: 'depreciation' | 'appreciation';
  custom_depreciation_rate?: number;
  brand?: string;
  serial_number?: string;
  quantity: number;
  status: string;
  description?: string;
  user_assigned?: string;
  inventory_status?: string;
  photo?: string;
  is_appreciating: boolean;
  asset_age_in_years: number;
  annual_depreciation: number;
  accumulated_depreciation: number;
  book_value: number;
  created_at: string;
  updated_at: string;
}

export interface DepreciationFormula {
  id: number;
  name: string;
  expression: string;
  type: 'depreciation' | 'appreciation';
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  action_data?: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedData<T> {
  data: T[];
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface SharedData {
  auth: {
    user: User;
    roles: string[];
    notifications?: Notification[];
    unreadNotificationsCount?: number;
  };
  flash?: {
    message?: string;
    error?: string;
  };
  ziggy: {
    location: string;
    query: Record<string, any>;
  };
}

export type PageProps<T = {}> = T & {
  auth: SharedData['auth'];
  flash?: SharedData['flash'];
};
```

---

## ✅ BEST PRACTICES

### **1. TypeScript Usage**

```tsx
// ✅ GOOD: Define proper types
interface DashboardProps {
  stats: {
    totalAssets: number;
    totalValue: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  // ...
}

// ❌ BAD: Using any
export default function Dashboard({ stats }: any) {
  // ...
}
```

### **2. Form Handling**

```tsx
// ✅ GOOD: Use Inertia's useForm
const { data, setData, post, processing, errors } = useForm({
  name: '',
  price: '',
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post(route('assets.store'));
};

// ❌ BAD: Manual state management
const [name, setName] = useState('');
const [errors, setErrors] = useState({});
// ...manual axios call
```

### **3. Navigation**

```tsx
// ✅ GOOD: Use Inertia Link
<Link href={route('assets.index')}>View Assets</Link>

// ✅ GOOD: Use router for programmatic navigation
router.visit(route('dashboard'));

// ❌ BAD: Using window.location
window.location.href = '/dashboard';
```

### **4. Component Organization**

```tsx
// ✅ GOOD: Extract reusable components
function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <div>{icon}</div>
        <h3>{title}</h3>
        <p>{value}</p>
      </CardContent>
    </Card>
  );
}

// ✅ GOOD: Use composition
<Dashboard>
  <StatCard title="Total" value={100} icon={<Icon />} />
  <StatCard title="Active" value={75} icon={<Icon />} />
</Dashboard>
```

### **5. Performance**

```tsx
// ✅ GOOD: Memoization untuk expensive calculations
const expensiveValue = useMemo(() => {
  return assets.reduce((sum, asset) => sum + asset.price, 0);
}, [assets]);

// ✅ GOOD: Debounce search input
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebounce(searchTerm, 300);

useEffect(() => {
  router.get(route('assets.index'), { search: debouncedSearch }, {
    preserveState: true,
    replace: true,
  });
}, [debouncedSearch]);

// ✅ GOOD: Lazy loading images
<img loading="lazy" src={asset.photo} alt={asset.name} />
```

---

## 🧪 TESTING

### **Setup Testing**

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### **Component Test Example**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from '@/components/StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Assets" value={100} />);
    
    expect(screen.getByText('Total Assets')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
```

---

**Dibuat dengan ❤️ untuk YAMS Development Team**  
**Last Updated: 17 Januari 2026**
