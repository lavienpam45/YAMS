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
    current_book_value?: number | null;
    last_depreciation_date?: string | null;
    is_appreciating: boolean;
}

interface IndexProps {
    assets: {
        data: Asset[];
        links: PaginatorLink[];
        from: number;
    };
    filters: {
        search: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    flash?: {
        message?: string;
        error?: string;
    };
}

export default function Index({ assets, filters }: IndexProps) {
    // Helper: pastikan route yang dihasilkan absolut (memulai dengan `/`)
    const absRoute = (name: string, params?: any) => {
        const r = (route as any)(name, params);
        if (typeof r === 'string' && !r.match(/^https?:\/\//) && !r.startsWith('/')) return '/' + r;
        return r;
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    // Sort-by Kategori dihapus sesuai permintaan; hanya pencarian yang dipertahankan
    const hasMountedRef = useRef(false);

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
        router.delete(absRoute('assets.destroy', assetToDelete.id), {
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

    // Helper: Hitung akumulasi penyusutan (untuk depreciating asset)
    const getAccumulatedDepreciation = (asset: Asset): number => {
        const purchasePrice = parseFloat(asset.purchase_price as string);
        const currentValue = asset.current_book_value ?? asset.book_value ?? purchasePrice;

        if (asset.is_appreciating) {
            return 0; // Tidak ada penyusutan untuk asset yang appreciating
        }

        return Math.max(0, purchasePrice - currentValue);
    };

    // Helper: Hitung akumulasi kenaikan (untuk appreciating asset)
    const getAccumulatedAppreciation = (asset: Asset): number => {
        const purchasePrice = parseFloat(asset.purchase_price as string);
        const currentValue = asset.current_book_value ?? asset.book_value ?? purchasePrice;

        if (!asset.is_appreciating) {
            return 0; // Tidak ada kenaikan untuk asset yang depreciating
        }

        return Math.max(0, currentValue - purchasePrice);
    };

    function handleImportSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.file) {
            alert('Silakan pilih file untuk diimpor terlebih dahulu.');
            return;
        }
        post(absRoute('assets.import'));
    }

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

    return (
        <>
            <Head title="Manajemen Aset" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Aset</h1>
                <Link
                    href={absRoute('assets.create')}
                    className="rounded-md bg-[#7ACAB0] px-4 py-2 font-semibold text-white hover:bg-[#5FA18C]"
                >
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
                        <button type="submit" disabled={processing || !data.file} className="inline-flex items-center gap-x-1.5 rounded-md bg-[#7ACAB0] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5FA18C] disabled:opacity-50">
                            <DocumentArrowUpIcon className="-ml-0.5 h-5 w-5" />
                            Import
                        </button>
                    </div>
                    {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                    <p className="mt-2 text-xs text-gray-500">File harus dalam format .xlsx, .xls, atau .csv.</p>
                </form>
            </div>
            <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="relative rounded-md shadow-sm md:col-span-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="search"
                            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#7ACAB0] sm:text-sm"
                            placeholder="Cari berdasarkan nama barang, kode, atau serial number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akumulasi Kenaikan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Saat Ini</th>
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
                            {(assets?.data?.length ?? 0) > 0 ? (
                                (assets?.data ?? []).map((asset, index) => (
                                    <Link as="tr" href={absRoute('assets.show', asset.id)} key={asset.id} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{(assets?.from ?? 0) + index}</td>
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
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className="text-red-600">
                                                📉 {formatPrice(getAccumulatedDepreciation(asset))}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className="text-green-600">
                                                📈 +{formatPrice(getAccumulatedAppreciation(asset))}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatPrice(asset.current_book_value ?? asset.book_value)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${asset.is_appreciating ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                    {asset.is_appreciating ? '📈 Apresiasi' : '📉 Penyusutan'}
                                                </span>
                                                <span className="text-gray-700">{asset.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.brand}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serial_number}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.quantity}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500"><span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(asset.status)}`}>{asset.status}</span></td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.description || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.user_assigned}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{asset.inventory_status}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-x-3">
                                                <Link href={absRoute('assets.edit', asset.id)} onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-[#7ACAB0]" title="Edit"><PencilSquareIcon className="w-5 h-5" /></Link>
                                                <button onClick={(e) => openDeleteModal(e, asset)} className="text-gray-400 hover:text-red-600" title="Hapus"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </Link>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={20} className="px-6 py-12 text-center text-sm text-gray-500">
                                        Tidak ada aset yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={assets?.links ?? []} />
            </div>
            <ConfirmationModal show={isModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} title="Hapus Aset" message={`Apakah Anda yakin ingin menghapus aset "${assetToDelete?.name}"? Aksi ini tidak dapat dibatalkan.`} />
        </>
    );
}

Index.layout = (page: React.ReactElement<{ title: string }>) => (<AppLayout title="Manajemen Aset" children={page} />);
