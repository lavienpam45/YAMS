import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/Pagination'; // Import komponen paginasi
import { Head, Link, router } from '@inertiajs/react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';
import ConfirmationModal from '@/components/ConfirmationModal';

// Interface untuk data Aset (tidak berubah)
interface Asset {
    id: number;
    name: string;
    category: string;
    purchase_date: string;
    purchase_price: string;
    location: string;
    status: string;
}

// PERUBAHAN #1: Tipe props untuk Index sekarang mengharapkan objek paginasi
interface IndexProps {
    assets: {
        data: Asset[];   // Data aset ada di dalam 'data'
        links: any[];      // Informasi link untuk tombol 'prev' & 'next'
        from: number;      // Nomor awal item pada halaman saat ini
    };
}

export default function Index({ assets }: IndexProps) {
    // Logika state modal (tidak ada perubahan)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

    const openDeleteModal = (asset: Asset) => {
        setAssetToDelete(asset);
        setIsModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setAssetToDelete(null);
    };
    const confirmDelete = () => {
        if (!assetToDelete) return;
        router.delete(route('assets.destroy', assetToDelete.id), {
            onSuccess: () => closeDeleteModal(),
        });
    };

    // Fungsi helper format (tidak ada perubahan)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    };
    const formatPrice = (priceString: string) => {
        const priceNumber = parseFloat(priceString);
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(priceNumber);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Aset</h1>
                <Link href={route('assets.create')} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Tambah Aset
                </Link>
            </div>

            {/* Kita bungkus tabel dan paginasi dalam satu div */}
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* PERUBAHAN #2: Tambah kolom '#' */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Nama Aset</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl. Beli</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Beli</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                             {/* PERUBAHAN #3: Gunakan assets.data untuk mapping */}
                            {assets.data.map((asset, index) => (
                                <tr key={asset.id}>
                                    {/* PERUBAHAN #4: Tampilkan nomor urut */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assets.from + index}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(asset.purchase_date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(asset.purchase_price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-x-2">
                                            <button className="text-yellow-600 hover:text-yellow-900"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => openDeleteModal(asset)} className="text-red-600 hover:text-red-900">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* PERUBAHAN #5: Tambahkan komponen Pagination di bawah */}
                <Pagination links={assets.links} />
            </div>

            {/* Komponen modal (tidak berubah) */}
            <ConfirmationModal
                show={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Hapus Aset"
                message={`Apakah Anda yakin ingin menghapus aset "${assetToDelete?.name}"? Aksi ini tidak dapat dibatalkan.`}
            />
        </>
    );
}

// Menerapkan layout persisten (tidak ada perubahan)
Index.layout = (page: React.ReactElement<{ title: string }>) => <AppLayout title="Manajemen Aset" children={page} />;
