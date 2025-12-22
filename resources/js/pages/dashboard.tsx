import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import {
    BanknotesIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

// --- IMPORT BARU UNTUK GRAFIK ---
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Daftarkan semua elemen Chart.js yang akan kita gunakan
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
);
// ------------------------------------

// Interface Asset (dari pesan sebelumnya)
interface Asset {
    id: number;
    name: string;
    status: string;
    room_name: string;
    accumulated_depreciation: number;
    book_value: number;
}

// Perbarui Tipe Props Halaman
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

export default function Dashboard({
    latestAssets,
    summaryData,
    chartData,
}: DashboardProps) {
    // Fungsi-fungsi helper (tidak berubah)
    const getStatusColor = (status: string) => {
        if (status === 'Rusak Ringan') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Rusak Berat') return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };
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
                borderWidth: 1,
            },
        ],
    };

    // Konfigurasi Tampilan untuk Grafik Batang
    const barChartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { beginAtZero: true },
        },
    };

    return (
        <>
            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                Dashboard Ringkasan Aset
            </h1>

            {/* Kartu Ringkasan Dinamis */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={
                        <BuildingOfficeIcon className="h-8 w-8 text-[#7ACAB0]" />
                    }
                    title="Total Aset"
                    value={summaryData.total_assets.toString()}
                />
                <StatCard
                    icon={<BanknotesIcon className="h-8 w-8 text-[#7ACAB0]" />}
                    title="Total Nilai Aset"
                    value={formatCardValue(summaryData.total_purchase_value)}
                />
                <StatCard
                    icon={
                        <CurrencyDollarIcon className="h-8 w-8 text-[#5FA18C]" />
                    }
                    title="Total Penyusutan"
                    value={formatCardValue(summaryData.total_depreciation)}
                />
                <StatCard
                    icon={<CreditCardIcon className="h-8 w-8 text-[#3D7F6A]" />}
                    title="Nilai Buku Terkini"
                    value={formatCardValue(summaryData.current_book_value)}
                />
            </div>

            {/* Blok untuk Menampilkan Dua Grafik Berdampingan */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Aset per Kategori
                    </h2>
                    <div className="mt-4 flex h-80 items-center justify-center">
                        <Pie
                            data={pieChartData}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow lg:col-span-3">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Aset per Lokasi
                    </h2>
                    <div className="relative mt-4 h-80">
                        <Bar options={barChartOptions} data={barChartData} />
                    </div>
                </div>
            </div>

            {/* Tabel Aset Terbaru */}
            <div className="mt-8">
                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Daftar Aset Terbaru
                        </h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            No
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Nama Barang
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Nilai Buku
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Kondisi
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Lokasi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {latestAssets.data.map((asset, index) => (
                                        <tr
                                            key={asset.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {latestAssets.from + index}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                {asset.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold whitespace-nowrap text-gray-700">
                                                {formatPrice(asset.book_value)}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(asset.status)}`}
                                                >
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {asset.room_name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination links={latestAssets.links} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactElement<{ title: string }>) => (
    <AppLayout title="Dashboard" children={page} />
);
