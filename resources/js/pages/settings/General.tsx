import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head, useForm } from '@inertiajs/react'; // <-- Tambahkan useForm
import { route } from 'ziggy-js'; // <-- Tambahkan route

// Komponen Card (tetap berguna)
const SettingsCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6"><h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3></div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">{children}</div>
    </div>
);

export default function General() {
    // Siapkan form untuk menyimpan pengaturan
    const { data, setData, post, processing, errors } = useForm({
        depreciation_method: 'straight_line', // Nilai default
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Nanti kita akan buat rute 'settings.update'
        // post(route('settings.update'), data);
        alert('Fungsi simpan belum diimplementasikan.');
    }

    return (
        <>
            <Head title="Pengaturan" />
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h1>
            <div className="space-y-6">

                <form onSubmit={handleSubmit}>
                    <SettingsCard title="Pengaturan Penyusutan">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="depreciation_method" className="block text-sm font-medium text-gray-700">
                                    Metode Perhitungan Penyusutan
                                </label>
                                <select
                                    id="depreciation_method"
                                    name="depreciation_method"
                                    value={data.depreciation_method}
                                    onChange={(e) => setData('depreciation_method', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:max-w-xs sm:text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="straight_line">Straight-line (Garis Lurus)</option>
                                    <option value="double_declining" disabled>Double-declining (Saldo Menurun Ganda) - Segera Hadir</option>
                                </select>
                                <p className="mt-2 text-sm text-gray-500">
                                    Pilih metode default yang akan digunakan untuk semua kalkulasi penyusutan aset.
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Metode'}
                                </button>
                            </div>
                        </div>
                    </SettingsCard>
                </form>

            </div>
        </>
    );
}

General.layout = (page: React.ReactElement) => <AppLayout title="Pengaturan" children={page} />;
