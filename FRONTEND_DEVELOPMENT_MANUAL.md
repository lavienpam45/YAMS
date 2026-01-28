# 📘 Manual Pengembangan Frontend YAMS

**Yarsi Asset Management System - Frontend Development Guide**  
Version: 1.0  
Last Updated: January 28, 2026

---

## 📑 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Teknologi Stack](#teknologi-stack)
3. [Struktur Direktori](#struktur-direktori)
4. [Setup & Instalasi](#setup--instalasi)
5. [Inertia.js Integration](#inertiajs-integration)
6. [Pages & Components](#pages--components)
7. [UI Components Library](#ui-components-library)
8. [Layouts](#layouts)
9. [Routing & Navigation](#routing--navigation)
10. [Form Handling](#form-handling)
11. [State Management](#state-management)
12. [Charts & Visualization](#charts--visualization)
13. [Authentication UI](#authentication-ui)
14. [Styling & Theming](#styling--theming)
15. [Best Practices](#best-practices)
16. [Build & Deployment](#build--deployment)

---

## 🎯 Pengenalan

YAMS Frontend dibangun menggunakan React 18+ dengan TypeScript, menggunakan Inertia.js sebagai jembatan antara Laravel backend dan React frontend. Aplikasi ini menggunakan Radix UI components dan Tailwind CSS untuk styling modern dan responsive.

### Fitur Utama Frontend:
- ✅ React 18+ dengan TypeScript
- ✅ Inertia.js SSR (Server-Side Rendering)
- ✅ Radix UI Components
- ✅ Tailwind CSS v4
- ✅ Chart.js untuk visualisasi data
- ✅ Real-time notifications
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support (optional)

---

## 🛠 Teknologi Stack

### Core Framework
```json
{
  "@inertiajs/react": "^2.1.4",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "^5.7.3"
}
```

### UI Components
```json
{
  "@radix-ui/react-avatar": "^1.1.3",
  "@radix-ui/react-checkbox": "^1.1.4",
  "@radix-ui/react-dialog": "^1.1.6",
  "@radix-ui/react-dropdown-menu": "^2.1.6",
  "@radix-ui/react-label": "^2.1.2",
  "@radix-ui/react-select": "^2.1.6",
  "@radix-ui/react-tooltip": "^1.1.8",
  "@headlessui/react": "^2.2.9",
  "@heroicons/react": "^2.2.0"
}
```

### Styling
```json
{
  "@tailwindcss/vite": "^4.1.11",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### Charts & Visualization
```json
{
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^6.0.1"
}
```

### Utilities
```json
{
  "ziggy-js": "^2.6.1",
  "date-fns": "^4.1.0",
  "sonner": "^1.7.3"
}
```

---

## 📂 Struktur Direktori

```
resources/
├── css/
│   └── app.css                 # Tailwind imports & custom styles
└── js/
    ├── app.tsx                 # Main entry point
    ├── bootstrap.ts            # Axios & app configuration
    ├── components/
    │   ├── ui/                 # Reusable UI components
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── avatar.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── spinner.tsx
    │   │   └── tooltip.tsx
    │   ├── app-logo.tsx
    │   ├── app-logo-icon.tsx
    │   ├── landing-navbar.tsx
    │   ├── notification-bell.tsx
    │   ├── sidebar.tsx
    │   ├── user-menu.tsx
    │   ├── user-menu-content.tsx
    │   └── Pagination.tsx
    ├── hooks/
    │   ├── use-mobile-navigation.ts
    │   ├── use-sidebar.ts
    │   └── use-toast.ts
    ├── layouts/
    │   ├── app-layout.tsx      # Main application layout
    │   ├── auth-layout.tsx     # Authentication layout
    │   └── guest-layout.tsx    # Guest/landing layout
    ├── lib/
    │   └── utils.ts            # Utility functions
    ├── pages/
    │   ├── auth/
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   ├── forgot-password.tsx
    │   │   ├── reset-password.tsx
    │   │   ├── verify-email.tsx
    │   │   └── two-factor-challenge.tsx
    │   ├── Assets/
    │   │   ├── Index.tsx       # Asset list
    │   │   ├── Create.tsx      # Create asset
    │   │   ├── Edit.tsx        # Edit asset
    │   │   └── Show.tsx        # Asset detail
    │   ├── Calculator/
    │   │   └── Index.tsx       # Depreciation calculator
    │   ├── Formulas/
    │   │   └── Index.tsx       # Formula management
    │   ├── Reports/
    │   │   └── Index.tsx       # Reports page
    │   ├── settings/
    │   │   └── General.tsx     # User settings
    │   ├── Users/
    │   │   ├── Index.tsx       # User list
    │   │   ├── Create.tsx      # Create user
    │   │   └── Edit.tsx        # Edit user
    │   ├── dashboard.tsx       # Main dashboard (417 lines)
    │   └── welcome.tsx         # Landing page
    ├── routes/
    │   ├── index.ts            # Route helpers
    │   └── verification.ts     # Email verification routes
    └── types/
        ├── index.d.ts          # Global TypeScript types
        └── inertia.d.ts        # Inertia.js types
```

---

## 🚀 Setup & Instalasi

### 1. Install Dependencies

```bash
# Install Node packages
npm install

# Or using Yarn
yarn install

# Or using pnpm
pnpm install
```

### 2. Development Server

```bash
# Start Vite dev server
npm run dev

# Or
yarn dev
```

### 3. Build for Production

```bash
# Build assets
npm run build

# Build SSR
npm run build:ssr
```

### 4. Type Checking

```bash
# Check TypeScript types
npm run types

# Or continuous type checking
npm run types -- --watch
```

### 5. Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

---

## 🔗 Inertia.js Integration

### Main App Entry Point

**File**: `resources/js/app.tsx`

```tsx
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@laravel/vite-plugin-wayfinder/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'YAMS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#0C7E46',
        showSpinner: true,
    },
});
```

### Shared Props Type

**File**: `resources/js/types/index.d.ts`

```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    display_name?: string;
}

export interface SharedData {
    name: string;
    quote: {
        message: string;
        author: string;
    };
    auth: {
        user: User | null;
        roles: string[];
    };
    sidebarOpen: boolean;
    flash: {
        message?: string;
        error?: string;
        registration_success?: boolean;
    };
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = 
    T & SharedData;
```

### Using Inertia in Components

```tsx
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function MyComponent() {
    const { auth, flash } = usePage<PageProps>().props;
    
    // Form handling
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assets.store'));
    };

    // Manual visits
    const handleClick = () => {
        router.visit(route('dashboard'));
    };

    return (
        <>
            <Head title="Page Title" />
            
            <Link href={route('dashboard')} className="...">
                Dashboard
            </Link>
            
            {/* Your component JSX */}
        </>
    );
}
```

---

## 📄 Pages & Components

### 1. Dashboard Page

**File**: `resources/js/pages/dashboard.tsx` (417 lines)

```tsx
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import {
    BanknotesIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

// Chart.js imports
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
);

interface Asset {
    id: number;
    name: string;
    status: string;
    room_name: string;
    accumulated_depreciation: number;
    book_value: number;
}

interface SummaryData {
    total_assets: number;
    total_purchase_value: number;
    total_depreciation: number;
    current_book_value: number;
}

interface ChartData {
    by_category: Record<string, number>;
    by_location: Record<string, number>;
}

interface TrendData {
    labels: string[];
    depreciation: number[];
    appreciation: number[];
}

interface DashboardProps {
    latestAssets: {
        data: Asset[];
        current_page: number;
        last_page: number;
        total: number;
    };
    summaryData: SummaryData;
    chartData: ChartData;
    trendData: TrendData;
}

export default function Dashboard({
    latestAssets,
    summaryData,
    chartData,
    trendData,
}: DashboardProps) {
    // Helper functions
    const formatPrice = (priceValue: number | string) => {
        const priceNumber =
            typeof priceValue === 'string'
                ? parseFloat(priceValue)
                : priceValue;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(priceNumber);
    };

    const formatCardValue = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            notation: 'compact',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Pie Chart Data
    const pieChartData = {
        labels: Object.keys(chartData.by_category),
        datasets: [
            {
                label: 'Jumlah Aset',
                data: Object.values(chartData.by_category),
                backgroundColor: [
                    '#3B82F6', '#EF4444', '#F59E0B',
                    '#10B981', '#8B5CF6', '#EC4899',
                ],
                borderColor: 'white',
                borderWidth: 2,
            },
        ],
    };

    // Bar Chart Data
    const barChartData = {
        labels: Object.keys(chartData.by_location),
        datasets: [
            {
                label: 'Jumlah Aset',
                data: Object.values(chartData.by_location),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Line Chart Data - Depreciation
    const depreciationLineChartData = {
        labels: trendData.labels,
        datasets: [
            {
                label: 'Total Nilai Buku Aset Penyusutan (Juta Rp)',
                data: trendData.depreciation,
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#EF4444',
            },
        ],
    };

    // Line Chart Data - Appreciation
    const appreciationLineChartData = {
        labels: trendData.labels,
        datasets: [
            {
                label: 'Total Nilai Buku Aset Kenaikan (Juta Rp)',
                data: trendData.appreciation,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#10B981',
            },
        ],
    };

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Aset
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {summaryData.total_assets}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Nilai Pembelian
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCardValue(summaryData.total_purchase_value)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CreditCardIcon className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Total Penyusutan
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCardValue(summaryData.total_depreciation)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BanknotesIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Nilai Buku Saat Ini
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCardValue(summaryData.current_book_value)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Pie Chart */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Distribusi Aset per Kategori
                        </h3>
                        <div className="h-64">
                            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Distribusi Aset per Lokasi
                        </h3>
                        <div className="h-64">
                            <Bar
                                data={barChartData}
                                options={{
                                    indexAxis: 'y',
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Line Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Trend Nilai Aset Penyusutan
                        </h3>
                        <div className="h-64">
                            <Line
                                data={depreciationLineChartData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Trend Nilai Aset Kenaikan
                        </h3>
                        <div className="h-64">
                            <Line
                                data={appreciationLineChartData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Assets Table */}
                <div className="rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Aset Terbaru
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nama Aset
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nilai Buku
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {latestAssets.data.map((asset) => (
                                    <tr key={asset.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {asset.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {asset.room_name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                            {formatPrice(asset.book_value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4">
                        <Pagination data={latestAssets} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
```

### 2. Asset Create Page

**File**: `resources/js/pages/Assets/Create.tsx` (295 lines)

```tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

interface CreateProps {
    nextAssetCode: string;
    nextUnitCode: string;
}

export default function Create({ nextAssetCode, nextUnitCode }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        room_name: string;
        location: string;
        floor: string;
        purchase_price: string;
        useful_life: number;
        salvage_value: number;
        depreciation_type: string;
        custom_depreciation_rate: string;
        type: string;
        brand: string;
        serial_number: string;
        quantity: number;
        status: string;
        description: string;
        photo: File | null;
    }>({
        name: '',
        room_name: '',
        location: '',
        floor: '',
        purchase_price: '',
        useful_life: 5,
        salvage_value: 0,
        depreciation_type: 'depreciation',
        custom_depreciation_rate: '',
        type: '',
        brand: '',
        serial_number: '',
        quantity: 1,
        status: 'Baik',
        description: '',
        photo: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('assets.store'));
    }

    return (
        <AppLayout title="Tambah Aset Baru">
            <Head title="Tambah Aset Baru" />
            
            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                Tambah Aset Baru
            </h1>

            <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Location Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Ruang
                            </label>
                            <input
                                type="text"
                                value={data.room_name}
                                onChange={(e) => setData('room_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.room_name && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.room_name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Lantai
                            </label>
                            <input
                                type="text"
                                value={data.floor}
                                onChange={(e) => setData('floor', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Asset Name */}
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Nama Aset <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            {errors.name && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Depreciation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Jenis Perhitungan <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={data.depreciation_type}
                                onChange={(e) => setData('depreciation_type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="depreciation">Penyusutan</option>
                                <option value="appreciation">Kenaikan</option>
                            </select>
                        </div>

                        {/* Custom Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Custom Rate (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.custom_depreciation_rate}
                                onChange={(e) => setData('custom_depreciation_rate', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                placeholder="Kosongkan jika pakai rumus"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Opsional: Isi jika ingin pakai custom rate, kosongkan jika pakai rumus aktif
                            </p>
                        </div>

                        {/* Photo Upload */}
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Foto Aset
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                                className="mt-1 block w-full"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Maksimal 2MB (JPG, PNG)
                            </p>
                            {errors.photo && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.photo}
                                </div>
                            )}
                        </div>

                        {/* More fields... */}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-4">
                        <Link
                            href={route('assets.index')}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Aset'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
```

### 3. Authentication Pages

**File**: `resources/js/pages/auth/login.tsx`

```tsx
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { route } from 'ziggy-js';

export default function Login({ status }: { status?: string }) {
    const { flash } = usePage().props as { 
        flash?: { 
            error?: string; 
            registration_success?: boolean;
        } 
    };

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

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Left Side: Image */}
            <div className="hidden lg:block relative h-full w-full overflow-hidden bg-muted">
                <img
                    src="/images/kampus-yarsi.jpg"
                    alt="Kampus Universitas Yarsi"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/60" />
                
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center text-lg font-medium">
                        YAMS (Yarsi Asset Management System)
                    </div>
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "Sistem manajemen aset modern untuk transparansi dan akuntabilitas kampus."
                        </p>
                        <footer className="text-sm font-semibold opacity-90">
                            — Universitas Yarsi
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center py-12 px-4 bg-background">
                <Head title="Masuk" />

                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Selamat Datang</h1>
                        <p className="text-balance text-muted-foreground">
                            Masuk ke akun YAMS Anda untuk melanjutkan
                        </p>
                    </div>

                    {/* Error Flash Message */}
                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <div>
                                    <h3 className="text-sm font-semibold text-red-800">
                                        Akses Ditolak
                                    </h3>
                                    <p className="text-sm text-red-700">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Registration Success Banner */}
                    {flash?.registration_success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <h3 className="text-sm font-semibold text-green-800">
                                        Pendaftaran Berhasil
                                    </h3>
                                    <p className="text-sm text-green-700">
                                        Akun Anda telah berhasil didaftarkan. Silakan hubungi Super Admin untuk mengaktifkan akun Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@yarsi.ac.id"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Link
                                    href={route('password.request')}
                                    className="ml-auto text-sm underline"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', !!checked)}
                            />
                            <Label htmlFor="remember" className="text-sm">
                                Ingat saya di perangkat ini
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Masuk
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="underline">
                            Daftar di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

---

## 🎨 UI Components Library

### Button Component

**File**: `resources/js/components/ui/button.tsx`

```tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
                    'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Input Component

**File**: `resources/js/components/ui/input.tsx`

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };
```

### Utility Function

**File**: `resources/js/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}
```

---

## 📐 Layouts

### App Layout

**File**: `resources/js/layouts/app-layout.tsx`

```tsx
import NotificationBell from '@/components/notification-bell';
import Sidebar from '@/components/sidebar';
import UserMenu from '@/components/user-menu';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
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

    // Auto logout after 30 minutes idle
    useEffect(() => {
        const idleTimeoutMs = 30 * 60 * 1000; // 30 minutes
        let idleTimer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                toast.error('Anda otomatis keluar setelah 30 menit tidak aktif.');
                router.post(route('logout'));
            }, idleTimeoutMs);
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        resetTimer();

        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <Toaster position="top-right" richColors />

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {title || 'YAMS'}
                    </h1>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <UserMenu user={auth.user} />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

---

## 🎯 Best Practices

### 1. TypeScript Usage
```typescript
// ✅ Good: Define proper types
interface AssetFormData {
    name: string;
    purchase_price: number;
    useful_life: number;
}

// ✅ Use type-safe hooks
const { data, setData } = useForm<AssetFormData>({
    name: '',
    purchase_price: 0,
    useful_life: 5,
});

// ❌ Avoid: Using 'any'
const data: any = useForm({ ... });
```

### 2. Component Organization
```tsx
// ✅ Good: Extract reusable components
function AssetCard({ asset }: { asset: Asset }) {
    return (
        <div className="rounded-lg bg-white p-4 shadow">
            {/* Card content */}
        </div>
    );
}

// ✅ Good: Use composition
<AppLayout title="Assets">
    <AssetList assets={assets} />
</AppLayout>
```

### 3. Form Handling
```tsx
// ✅ Good: Use Inertia forms
const { data, setData, post, errors } = useForm({
    name: '',
    email: '',
});

const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
};

// ✅ Show validation errors
{errors.name && (
    <p className="text-sm text-red-600">{errors.name}</p>
)}
```

### 4. Performance Optimization
```tsx
// ✅ Use React.memo for expensive components
const AssetCard = React.memo(({ asset }: { asset: Asset }) => {
    return <div>{asset.name}</div>;
});

// ✅ Use useMemo for expensive calculations
const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.book_value, 0);
}, [assets]);
```

---

## 🚀 Build & Deployment

### Development
```bash
# Start dev server
npm run dev

# Type checking in watch mode
npm run types -- --watch
```

### Production Build
```bash
# Build assets
npm run build

# Build SSR
npm run build:ssr
```

### Environment Variables
```env
VITE_APP_NAME=YAMS
VITE_APP_URL=https://yams.yarsi.ac.id
```

---

## 📞 Support & Resources

### Documentation
- React: https://react.dev
- Inertia.js: https://inertiajs.com
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com

### Contact
- Developer: YAMS Development Team
- Institution: Universitas Yarsi
- Email: support@yarsi.ac.id

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0  
**Framework**: React 18+ with TypeScript
