import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { route } from 'ziggy-js';

const absRoute = (name: string, params?: any) => {
    const r = (route as any)(name, params);
    if (typeof r === 'string' && !r.match(/^https?:\/\//) && !r.startsWith('/')) return '/' + r;
    return r;
};

// Tipe untuk Aset yang datang dari Controller
interface Asset {
    id: number;
    name: string;
    room_name: string | null;
    location: string | null;
    floor: string | null;
    asset_code: string | null;
    unit_code: string | null;
    received_date: string | null;
    purchase_price: string | null;
    useful_life: number | null;
    salvage_value: string | null;
    type: string | null;
    depreciation_type: string | null;
    custom_depreciation_rate: number | null;
    brand: string | null;
    serial_number: string | null;
    quantity: number;
    status: string;
    description: string | null;
    user_assigned: string | null;
    inventory_status: string | null;
    photo: string | null; // Untuk foto yang sudah ada, ini adalah URL (string)
}

export default function Edit({ asset }: { asset: Asset }) {
    // Inisialisasi useForm dengan data aset yang sudah ada
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        room_name: string;
        location: string;
        floor: string;
        asset_code: string;
        unit_code: string;
        received_date: string;
        purchase_price: string;
        useful_life: number;
        salvage_value: string;
        type: string;
        depreciation_type: string;
        custom_depreciation_rate: string;
        brand: string;
        serial_number: string;
        quantity: number;
        status: string;
        description: string;
        user_assigned: string;
        inventory_status: string;
        photo: File | null;
        _method: 'put'; // Trik untuk Inertia agar bisa mengirim file saat update
    }>({
        name: asset.name || '',
        room_name: asset.room_name || '',
        location: asset.location || '',
        floor: asset.floor || '',
        asset_code: asset.asset_code || '',
        unit_code: asset.unit_code || '',
        received_date: asset.received_date || '',
        purchase_price: asset.purchase_price || '',
        useful_life: asset.useful_life || 5,
        salvage_value: asset.salvage_value || '0',
        type: asset.type || '',
        depreciation_type: asset.depreciation_type || 'depreciation',
        custom_depreciation_rate: asset.custom_depreciation_rate?.toString() || '',
        brand: asset.brand || '',
        serial_number: asset.serial_number || '',
        quantity: asset.quantity || 1,
        status: asset.status || 'Baik',
        description: asset.description || '',
        user_assigned: asset.user_assigned || '',
        inventory_status: asset.inventory_status || '',
        photo: null,
        _method: 'put',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Gunakan metode 'post' karena kita mengirim file,
        // Laravel akan menganggapnya sebagai 'PUT' karena ada '_method'
        post(absRoute('assets.update', asset.id));
    }

    return (
        <>
            <Head title={`Edit Aset - ${asset.name}`} />
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
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasi</label>
                            <input type="text" id="location" value={data.location} onChange={e => setData('location', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Lantai</label>
                            <input type="text" id="floor" value={data.floor} onChange={e => setData('floor', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="asset_code" className="block text-sm font-medium text-gray-700">Kode Aktiva (otomatis)</label>
                            <input type="text" id="asset_code" value={data.asset_code} readOnly
                                className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 text-gray-600 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="unit_code" className="block text-sm font-medium text-gray-700">Kode Satuan (otomatis)</label>
                            <input type="text" id="unit_code" value={data.unit_code} readOnly
                                className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100 text-gray-600 shadow-sm" />
                        </div>
                        <div className="lg:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Barang</label>
                            <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="received_date" className="block text-sm font-medium text-gray-700">Tanggal Terima</label>
                            <input type="date" id="received_date" value={data.received_date} onChange={e => setData('received_date', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">Harga Beli</label>
                            <input type="number" id="purchase_price" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="useful_life" className="block text-sm font-medium text-gray-700">Masa Manfaat (Tahun)</label>
                            <input type="number" id="useful_life" value={data.useful_life} onChange={e => setData('useful_life', parseInt(e.target.value))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="salvage_value" className="block text-sm font-medium text-gray-700">Nilai Sisa (Residu)</label>
                            <input type="number" id="salvage_value" value={data.salvage_value.toString()} onChange={e => setData('salvage_value', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Kategori</label>
                            <input 
                                type="text" 
                                id="type" 
                                value={data.type} 
                                onChange={e => setData('type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Contoh: Bangunan, Elektronik, Furniture"
                            />
                        </div>
                        <div>
                            <label htmlFor="depreciation_type" className="block text-sm font-medium text-gray-700">Tipe Perhitungan <span className="text-red-500">*</span></label>
                            <select
                                id="depreciation_type"
                                value={data.depreciation_type}
                                onChange={e => setData('depreciation_type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="depreciation">📉 Penyusutan (Depreciation)</option>
                                <option value="appreciation">📈 Kenaikan (Appreciation)</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Pilih apakah nilai aset akan menyusut atau naik seiring waktu</p>
                        </div>
                        <div>
                            <label htmlFor="custom_depreciation_rate" className="block text-sm font-medium text-gray-700">Persentase Custom (Opsional)</label>
                            <div className="relative mt-1">
                                <input 
                                    type="number" 
                                    id="custom_depreciation_rate" 
                                    value={data.custom_depreciation_rate} 
                                    onChange={e => setData('custom_depreciation_rate', e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                                    placeholder="5"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Kosongkan untuk menggunakan rumus dari sistem. Isi jika ingin custom rate.</p>
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
                                <option value="">-- Pilih Status --</option>
                                <option value="Yayasan">Yayasan</option>
                                <option value="Hibah">Hibah</option>
                            </select>
                        </div>
                        <div className="lg:col-span-3">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Keterangan</label>
                            <textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" rows={3}></textarea>
                        </div>
                        <div className="lg:col-span-3">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Ganti Foto (Opsional)</label>
                            {asset.photo && <img src={`/storage/${asset.photo}`} alt="Foto saat ini" className="mt-2 h-20 w-auto rounded" />}
                            <input type="file" onChange={(e) => setData('photo', e.target.files ? e.target.files[0] : null)}
                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100" />
                            {errors.photo && <div className="text-sm text-red-600 mt-1">{errors.photo}</div>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={absRoute('assets.index')} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactElement) => <AppLayout title="Edit Aset" children={page} />;
