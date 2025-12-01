import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';

// Tipe untuk Aset yang datang dari Controller
interface Asset {
    id: number;
    name: string;
    room_name: string | null;
    asset_code: string | null;
    unit_code: string | null;
    received_date: string | null;
    purchase_price: string | null;
    useful_life: number | null;
    salvage_value: string | null;
    type: string | null;
    brand: string | null;
    serial_number: string | null;
    quantity: number;
    status: string;
    description: string | null;
    user_assigned: string | null;
    inventory_status: string | null;
}

export default function Edit({ asset }: { asset: Asset }) {
    // Inisialisasi useForm dengan data aset yang sudah ada
    const { data, setData, put, processing, errors } = useForm({
        name: asset.name || '',
        room_name: asset.room_name || '',
        asset_code: asset.asset_code || '',
        unit_code: asset.unit_code || '',
        received_date: asset.received_date || '',
        purchase_price: asset.purchase_price || '',
        useful_life: asset.useful_life || 5,
        salvage_value: asset.salvage_value || 0,
        type: asset.type || '',
        brand: asset.brand || '',
        serial_number: asset.serial_number || '',
        quantity: asset.quantity || 1,
        status: asset.status || 'Baik',
        description: asset.description || '',
        user_assigned: asset.user_assigned || '',
        inventory_status: asset.inventory_status || 'Tercatat',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Menggunakan metode 'put' untuk update
        put(route('assets.update', asset.id));
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Aset</h1>
            <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <label htmlFor="room_name" className="block text-sm font-medium text-gray-700">Nama Ruang</label>
                            <input type="text" id="room_name" value={data.room_name} onChange={e => setData('room_name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="asset_code" className="block text-sm font-medium text-gray-700">Kode Aktiva</label>
                            <input type="text" id="asset_code" value={data.asset_code} onChange={e => setData('asset_code', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.asset_code && <div className="text-sm text-red-600 mt-1">{errors.asset_code}</div>}
                        </div>

                        <div>
                            <label htmlFor="unit_code" className="block text-sm font-medium text-gray-700">Kode Satuan</label>
                            <input type="text" id="unit_code" value={data.unit_code} onChange={e => setData('unit_code', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div className="lg:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Barang</label>
                            <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label htmlFor="received_date" className="block text-sm font-medium text-gray-700">Tanggal Terima</label>
                            <input type="date" id="received_date" value={data.received_date} onChange={e => setData('received_date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">Harga Beli</label>
                            <input type="number" id="purchase_price" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 5000000" />
                            {errors.purchase_price && <div className="text-sm text-red-600 mt-1">{errors.purchase_price}</div>}
                        </div>

                        <div>
                            <label htmlFor="useful_life" className="block text-sm font-medium text-gray-700">Masa Manfaat (Tahun)</label>
                            <input type="number" id="useful_life" value={data.useful_life} onChange={e => setData('useful_life', parseInt(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.useful_life && <div className="text-sm text-red-600 mt-1">{errors.useful_life}</div>}
                        </div>

                        <div>
                            <label htmlFor="salvage_value" className="block text-sm font-medium text-gray-700">Nilai Sisa (Residu)</label>
                            <input type="number" id="salvage_value" value={data.salvage_value} onChange={e => setData('salvage_value', parseInt(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 0" />
                            {errors.salvage_value && <div className="text-sm text-red-600 mt-1">{errors.salvage_value}</div>}
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                            <input type="text" id="type" value={data.type} onChange={e => setData('type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Merk</label>
                            <input type="text" id="brand" value={data.brand} onChange={e => setData('brand', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">Serial Number</label>
                            <input type="text" id="serial_number" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Jumlah</label>
                            <input type="number" id="quantity" value={data.quantity} onChange={e => setData('quantity', parseInt(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.quantity && <div className="text-sm text-red-600 mt-1">{errors.quantity}</div>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Kondisi</label>
                            <select id="status" value={data.status} onChange={e => setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Baik</option>
                                <option>Rusak Ringan</option>
                                <option>Rusak Berat</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="user_assigned" className="block text-sm font-medium text-gray-700">Pengguna</label>
                            <input type="text" id="user_assigned" value={data.user_assigned} onChange={e => setData('user_assigned', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                         <div>
                            <label htmlFor="inventory_status" className="block text-sm font-medium text-gray-700">Status Inventaris</label>
                            <select id="inventory_status" value={data.inventory_status} onChange={e => setData('inventory_status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Tercatat</option>
                                <option>Dalam Perbaikan</option>
                                <option>Hilang</option>
                            </select>
                        </div>

                        <div className="lg:col-span-3">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Keterangan</label>
                             <textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" rows={3}></textarea>
                        </div>

                        <div className="lg:col-span-3">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Foto</label>
                            <input type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={route('assets.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactElement) => <AppLayout title="Edit Aset" children={page} />;
