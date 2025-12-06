import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react'; // Pastikan Head diimpor

// Komponen Card
const SettingsCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {children}
        </div>
    </div>
);

export default function General() {
    return (
        // Hapus AppLayout dari sini
        <>
            {/* --- PERBAIKAN UTAMA: GUNAKAN <Head> UNTUK MENGATUR JUDUL --- */}
            <Head title="Pengaturan" />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h1>
            <div className="space-y-6">

                <SettingsCard title="Tampilan">
                    <div className="flex items-center justify-between">
                        <span className="flex-grow flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Mode Gelap</span>
                            <span className="text-sm text-gray-500">Aktifkan atau nonaktifkan mode gelap.</span>
                        </span>
                        <button type="button" className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-gray-200" disabled>
                            <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0" />
                        </button>
                    </div>
                </SettingsCard>

                <SettingsCard title="Pengaturan Penyusutan (Super Admin)">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="depreciation_method" className="block text-sm font-medium text-gray-700">
                                Metode Penyusutan Default
                            </label>
                            <select id="depreciation_method" name="depreciation_method"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:max-w-xs sm:text-sm">
                                <option>Straight-line (Garis Lurus)</option>
                                <option disabled>Double-declining (Saldo Menurun Ganda)</option>
                            </select>
                            <p className="mt-2 text-sm text-gray-500">
                                Metode ini akan digunakan untuk menghitung nilai buku semua aset secara global.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                                Simpan Metode
                            </button>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard title="Profil Perusahaan">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
                            <input type="text" id="company_name" defaultValue="PT Aset Sejahtera"
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="company_address" className="block text-sm font-medium text-gray-700">Alamat</label>
                            <textarea id="company_address" rows={3} defaultValue={"Jl. Jend. Sudirman Kav. 52-53, Jakarta"}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </SettingsCard>

            </div>
        </>
    );
}

// === PERBAIKAN FINAL: Gunakan pola yang sama persis seperti Index.tsx ===
General.layout = (page: React.ReactElement) => <AppLayout children={page} />;
