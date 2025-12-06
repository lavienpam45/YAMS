import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/Pagination';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { TrashIcon, PencilSquareIcon, MagnifyingGlassIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useDebounce } from 'use-debounce';

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Asset {
    id: number;
    photo: string | null;
    room_name: string;
    asset_code: string;
    unit_code: string;
    name: string;
    received_date: string;
    type: string;
    brand: string;
    serial_number: string;
    purchase_price: string;
    quantity: number;
    status: string;
    description: string | null;
    user_assigned: string;
    inventory_status: string;
    accumulated_depreciation: number;
    book_value: number;
}

interface IndexProps {
    assets: {
        data: Asset[];
        links: PaginatorLink[];
        from: number;
    };
    filters: { search: string; };
    flash: { message?: string; error?: string; };
}

export default function Index({ assets, filters, flash }: IndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const isInitialMount = useRef(true);
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const openDeleteModal = (e: React.MouseEvent, asset: Asset) => {
        e.stopPropagation();
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
    const getStatusColor = (status: string) => {
        if (status === 'Rusak Ringan') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Rusak Berat') return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };
    const formatPrice = (priceValue: number | string) => {
        const priceNumber = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(priceNumber);
    };

    function handleImportSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.file) {
            alert('Silakan pilih file untuk diimpor terlebih dahulu.');
            return;
        }
        post(route('assets.import'));
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        router.get(
            route('assets.index'),
            { search: debouncedSearchTerm },
            { preserveState: true, replace: true }
        );
    }, [debouncedSearchTerm]);

    return (
        <>
            <Head title="Manajemen Aset" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Aset</h1>
                <Link href={route('assets.create')} className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700">
                    Tambah Aset
                </Link>
            </div>

            <div className="mb-6 p-6 bg-white rounded-lg shadow">
                <form onSubmit={handleImportSubmit}>
                    <label htmlFor="import_file" className="block text-sm font-medium leading-6 text-gray-900">Import Data dari File</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button type="submit" disabled={processing || !data.file} className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                            <DocumentArrowUpIcon className="-ml-0.5 h-5 w-5" />
                            Import
                        </button>
                    </div>
                    {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                    <p className="mt-2 text-xs text-gray-500">File harus dalam format .xlsx, .xls, atau .csv.</p>
                </form>
            </div>

            <div className="mb-4">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input type="search" className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" placeholder="Cari berdasarkan nama barang, kode, atau serial number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Ruang</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Aktiva</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Satuan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Terima</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Beli</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akumulasi Penyusutan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai Buku</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merk</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jml</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kondisi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Inv.</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {assets.data.map((asset, index) => (
                                <Link as="tr" href={route('assets.show', asset.id)} key={asset.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{assets.from + index}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {asset.photo ? (
                                            <img src={`/storage/${asset.photo}`} alt={asset.name} className="h-10 w-10 object-cover rounded" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">No Pic</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{asset.room_name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.asset_code}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.unit_code}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.received_date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(asset.purchase_price)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">({formatPrice(asset.accumulated_depreciation)})</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatPrice(asset.book_value)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.type}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.brand}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serial_number}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.quantity}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"><span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(asset.status)}`}>{asset.status}</span></td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.description || '-'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.user_assigned}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.inventory_status}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-x-3">
                                            <Link href={route('assets.edit', asset.id)} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-indigo-600" title="Edit"><PencilSquareIcon className="w-5 h-5" /></Link>
                                            <button onClick={(e) => openDeleteModal(e, asset)} className="text-gray-400 hover:text-red-600" title="Hapus"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </Link>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={assets.links} />
            </div>
            <ConfirmationModal show={isModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} title="Hapus Aset" message={`Apakah Anda yakin ingin menghapus aset "${assetToDelete?.name}"? Aksi ini tidak dapat dibatalkan.`} />
        </>
    );
}

Index.layout = (page: React.ReactElement<{ title: string }>) => (<AppLayout title="Manajemen Aset" children={page} />);
