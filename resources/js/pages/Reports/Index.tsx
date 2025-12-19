import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import Pagination from '@/components/Pagination';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useDebounce } from 'use-debounce'; // Kita akan manfaatkan debounce

// Tipe Data (tidak berubah)
interface Asset { id: number; asset_code: string | null; name: string; type: string; received_date: string; room_name: string; book_value: number; }
interface PaginatorLink { url: string | null; label: string; active: boolean; }
interface ReportProps {
    assets: { data: Asset[]; links: PaginatorLink[]; from: number; };
    filters: { category: string | null; sort_by: string | null; };
    categories: string[];
    summary: { total_assets: number; total_purchase_value: number; total_book_value: number; };
}

export default function Index({ assets, filters, categories, summary }: ReportProps) {
    // --- PERBAIKAN LOGIKA FILTER DAN SORTING ---
    const [category, setCategory] = useState(filters.category || 'Semua');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');

    // Gunakan useDebounce untuk nilai-nilai yang akan memicu pencarian ulang
    const [debouncedCategory] = useDebounce(category, 300);
    const [debouncedSortBy] = useDebounce(sortBy, 300);

    const isInitialMount = React.useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const queryParams: Record<string, string> = {};
        if (debouncedCategory !== 'Semua') queryParams.category = debouncedCategory;
        if (debouncedSortBy !== 'id') queryParams.sort_by = debouncedSortBy;

        // Kirim request ke server, Inertia akan otomatis menambahkan parameter 'page' jika ada
        router.get(route('reports.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedCategory, debouncedSortBy]);
    // --- AKHIR PERBAIKAN ---

    // Fungsi format harga (tidak berubah)
    const formatPrice = (value: number) => { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value); };

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Aset</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"><div className="text-sm text-gray-500">Total Aset</div><div className="text-2xl font-bold text-gray-800 mt-1">{summary.total_assets} item</div></div>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"><div className="text-sm text-gray-500">Total Harga Beli</div><div className="text-2xl font-bold text-gray-800 mt-1">{formatPrice(summary.total_purchase_value)}</div></div>
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"><div className="text-sm text-gray-500">Total Nilai Buku</div><div className="text-2xl font-bold text-gray-800 mt-1">{formatPrice(summary.total_book_value)}</div></div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Filter Tipe</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm">
                            <option value="Semua">Semua</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Urutkan</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm">
                            <option value="id">Default (ID)</option>
                            <option value="received_date">Tahun Pembelian</option>
                            <option value="type">Kategori</option>
                            <option value="room_name">Lokasi</option>
                        </select>
                    </div>
                    <div className="lg:col-span-2 flex justify-end space-x-2">
                         <a href={route('reports.export.excel', { category, sort_by: sortBy })} className="inline-flex items-center justify-center gap-x-2 rounded-md bg-[#7ACAB0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5FA18C]">
                             <DocumentArrowDownIcon className="h-5 w-5" /> Export Excel
                         </a>
                         <a href={route('reports.export.pdf', { category, sort_by: sortBy })} className="inline-flex items-center justify-center gap-x-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                             <DocumentArrowDownIcon className="h-5 w-5" /> Export PDF
                         </a>
                    </div>
                </div>

                <div className="mt-6 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Barang</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tahun</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nilai Buku</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {assets.data.map(asset => (
                                        <tr key={asset.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ASSET-{asset.id.toString().padStart(3, '0')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.received_date ? new Date(asset.received_date).getFullYear() : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.room_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatPrice(asset.book_value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Pagination links={assets.links} />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactElement) => <AppLayout title="Laporan Aset" children={page} />;
