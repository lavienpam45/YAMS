import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/Pagination'; // Import komponen paginasi
import {
    CreditCardIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

// Tipe untuk Aset yang datang dari Backend
interface Asset {
    id: number;
    name: string;
    category: string;
    status: string;
    location: string;
    purchase_price: string;
}

// PERUBAHAN #1: Tipe props untuk Dashboard sekarang mengharapkan objek paginasi
interface DashboardProps {
    latestAssets: {
        data: Asset[]; // Data aset ada di dalam 'data'
        links: any[];    // Informasi link untuk tombol 'prev' & 'next'
        from: number;    // Nomor awal item pada halaman saat ini
    };
}

// Komponen Kartu Statistik (tidak ada perubahan)
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string; }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <span className="text-gray-500">{title}</span>
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Komponen Dashboard sekarang menerima props paginasi
export default function Dashboard({ latestAssets }: DashboardProps) {

    // Fungsi helper (tidak ada perubahan)
    const getStatusColor = (status: string) => {
        if (status === 'Rusak Ringan') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Rusak Berat') return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };
    const formatPrice = (priceString: string) => {
        const priceNumber = parseFloat(priceString);
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(priceNumber);
    };

    return (
        <>
            {/* Bagian judul & kartu statistik (tidak ada perubahan) */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Ringkasan Aset</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<BuildingOfficeIcon className="w-8 h-8 text-blue-500" />} title="Total Aset" value="6" />
                <StatCard icon={<BanknotesIcon className="w-8 h-8 text-green-500" />} title="Total Nilai Aset" value="Rp 10,318 M" />
                <StatCard icon={<CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />} title="Total Penyusutan" value="Rp 3,525 M" />
                <StatCard icon={<CreditCardIcon className="w-8 h-8 text-red-500" />} title="Nilai Buku Terkini" value="Rp 6,793 M" />
            </div>
            {/* Bagian Grafik (tidak ada perubahan) */}
            <div className="mt-8">
                 <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700">Grafik Penyusutan Aset (Nilai Buku)</h2>
                    <div className="mt-4 flex items-center justify-center h-64 bg-gray-100 rounded">
                        <p className="text-gray-500">Komponen Grafik akan diimplementasikan di sini</p>
                    </div>
                </div>
            </div>

            {/* Bagian Daftar Aset Terbaru */}
            <div className="mt-8">
                {/* Kita bungkus tabel dan paginasi dalam satu div agar shadow-nya menyatu */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-700">Daftar Aset Terbaru</h2>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 table-fixed">
                                <thead>
                                    <tr>
                                        {/* PERUBAHAN #2: Tambah kolom '#' */}
                                        <th scope="col" className="w-[5%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">#</th>
                                        <th scope="col" className="w-[35%] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">Nama Aset</th>
                                        <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
                                        <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nilai Buku</th>
                                        <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {/* PERUBAHAN #3: Gunakan latestAssets.data untuk mapping */}
                                    {latestAssets.data.map((asset, index) => (
                                        <tr key={asset.id}>
                                            {/* PERUBAHAN #4: Tampilkan nomor urut */}
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{latestAssets.from + index}</td>
                                            <td className="py-4 pr-3 text-sm font-medium text-gray-900 truncate" title={asset.name}>
                                                {asset.name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 truncate">{asset.category}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 truncate">{formatPrice(asset.purchase_price)}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(asset.status)}`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 truncate">{asset.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     {/* PERUBAHAN #5: Tambahkan komponen Pagination di bawah tabel */}
                    <Pagination links={latestAssets.links} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactElement<{ title: string }>) => <AppLayout title="Dashboard" children={page} />;
