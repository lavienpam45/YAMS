import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React from 'react';
import AppLayout from '@/layouts/app-layout'; // <-- Tambahkan import layout

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        purchase_date: '',
        purchase_price: '',
        location: '',
        status: 'Baik',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('assets.store'));
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Aset Baru</h1>
            <div className="p-6 bg-white rounded-lg shadow max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Aset</label>
                            <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                            <input type="text" id="category" value={data.category} onChange={e => setData('category', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.category && <div className="text-sm text-red-600 mt-1">{errors.category}</div>}
                        </div>
                        <div>
                            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">Tanggal Beli</label>
                            <input type="date" id="purchase_date" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.purchase_date && <div className="text-sm text-red-600 mt-1">{errors.purchase_date}</div>}
                        </div>
                        <div>
                            <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">Harga Beli</label>
                            <input type="number" id="purchase_price" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: 5000000" />
                            {errors.purchase_price && <div className="text-sm text-red-600 mt-1">{errors.purchase_price}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasi</label>
                            <input type="text" id="location" value={data.location} onChange={e => setData('location', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            {errors.location && <div className="text-sm text-red-600 mt-1">{errors.location}</div>}
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" value={data.status} onChange={e => setData('status', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option>Baik</option>
                                <option>Rusak Ringan</option>
                                <option>Rusak Berat</option>
                            </select>
                            {errors.status && <div className="text-sm text-red-600 mt-1">{errors.status}</div>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={route('assets.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                            {processing ? 'Menyimpan...' : 'Simpan Aset'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

// === Terapkan Layout di Sini ===
Create.layout = (page: React.ReactElement<{ title: string }>) => <AppLayout title="Tambah Aset Baru" children={page} />;
