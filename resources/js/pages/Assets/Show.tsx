import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

const absRoute = (name: string, params?: any) => {
    const r = (route as any)(name, params);
    if (typeof r === 'string' && !r.match(/^https?:\/\//) && !r.startsWith('/')) return '/' + r;
    return r;
};
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface DepreciationHistory {
    id: number; year: number; book_value_start: string;
    depreciation_value: string; book_value_end: string;
}

interface Asset {
    id: number; name: string; photo: string | null; room_name: string;
    location: string; floor: string;
    asset_code: string; unit_code: string; received_date: string; type: string;
    depreciation_type: string;
    custom_depreciation_rate: number | null;
    brand: string; serial_number: string; purchase_price: string;
    useful_life: number; salvage_value: string;
    quantity: number; status: string; description: string | null;
    user_assigned: string; inventory_status: string;
    accumulated_depreciation: number; book_value: number;
    current_book_value?: number | null;
    last_depreciation_date?: string | null;
    is_appreciating?: boolean;
    depreciation_histories: DepreciationHistory[];
}

const formatPrice = (value: number | string) => { const numberValue = typeof value === 'string' ? parseFloat(value) : value; if (isNaN(numberValue)) { return '-'; } return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numberValue); };
const formatChange = (value: number | string) => { const numberValue = typeof value === 'string' ? parseFloat(value) : value; if (isNaN(numberValue)) { return '-'; } const isIncrease = numberValue < 0; const absolute = Math.abs(numberValue); const formatted = formatPrice(absolute); return `${isIncrease ? '+' : '-'}${formatted}`; };
const DetailItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => ( <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"><dt className="text-sm font-medium leading-6 text-gray-500">{label}</dt><dd className="mt-1 text-sm font-semibold leading-6 text-gray-900 sm:col-span-2 sm:mt-0">{value || '-'}</dd></div> );

export default function Show({ asset }: { asset: Asset }) {

    return (
        <>
            <Head title={`Detail Aset - ${asset.name}`} />

            <div>
                <Link href={absRoute('assets.index')} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Kembali ke Daftar Aset
                </Link>
            </div>

            <div className="mb-6 bg-white rounded-lg shadow">
                <img
                    src={asset.photo ? `/storage/${asset.photo}` : 'https://via.placeholder.com/1200x600.png?text=No+Image+Available'}
                    alt={`Foto ${asset.name}`}
                    className="w-full h-auto max-h-96 object-contain rounded-t-lg bg-gray-100"
                />
            </div>

            <div className="space-y-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl leading-7 font-bold text-gray-900">{asset.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">ID Aset: ASSET-{asset.id.toString().padStart(3, '0')}</p>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-2">
                        <dl className="divide-y divide-gray-200">
                            <DetailItem label="Kode Aktiva" value={asset.asset_code} />
                            <DetailItem label="Kode Satuan" value={asset.unit_code} />
                            <DetailItem label="Nama Ruang / Lokasi" value={asset.room_name} />
                            <DetailItem label="Lokasi" value={asset.location} />
                            <DetailItem label="Lantai" value={asset.floor} />
                            <DetailItem label="Pengguna" value={asset.user_assigned} />
                            <DetailItem label="Status Inventaris" value={asset.inventory_status} />
                            <DetailItem label="Kondisi" value={asset.status} />
                            <DetailItem label="Tanggal Terima" value={asset.received_date} />
                            <DetailItem label="Jumlah" value={asset.quantity} />
                            <DetailItem label="Merk / Brand" value={asset.brand} />
                            <DetailItem label="Tipe" value={asset.type} />
                            <DetailItem 
                                label="Tipe Perhitungan" 
                                value={asset.depreciation_type === 'appreciation' ? '📈 Kenaikan (Appreciation)' : '📉 Penyusutan (Depreciation)'} 
                            />
                            <DetailItem 
                                label="Persentase Custom" 
                                value={asset.custom_depreciation_rate ? `${asset.custom_depreciation_rate}% per tahun` : 'Menggunakan rumus sistem'} 
                            />
                            <DetailItem label="Serial Number" value={asset.serial_number} />
                            <DetailItem label="Keterangan" value={asset.description} />
                        </dl>
                    </div>
                    <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
                        <dl className="divide-y divide-gray-200">
                            <DetailItem label="Harga Beli" value={formatPrice(asset.purchase_price)} />
                            <DetailItem label="Masa Manfaat" value={`${asset.useful_life} Tahun`} />
                            <DetailItem label="Nilai Sisa" value={formatPrice(asset.salvage_value)} />
                            <DetailItem label="Akumulasi Penyusutan" value={formatPrice(asset.accumulated_depreciation)} />
                            <DetailItem label="Harga Saat Ini Tersimpan" value={formatPrice(asset.current_book_value ?? asset.book_value)} />
                            <DetailItem label="Terakhir Diperbarui" value={asset.last_depreciation_date || asset.received_date || '-'} />
                        </dl>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl leading-6 font-bold text-gray-900">Riwayat Penyusutan (History Log)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tahun</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Harga Awal</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Penyusutan Tahun Ini</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Harga Akhir</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {asset.depreciation_histories && asset.depreciation_histories.length > 0 ? (
                                    asset.depreciation_histories.map(history => (
                                        <tr key={history.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{history.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(history.book_value_start)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseFloat(history.depreciation_value) < 0 ? 'text-green-600' : 'text-red-600'}`}>{formatChange(history.depreciation_value)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatPrice(history.book_value_end)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                            Belum ada riwayat penyusutan yang dicatat untuk aset ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactElement) => <AppLayout title="Detail Aset" children={page} />;
