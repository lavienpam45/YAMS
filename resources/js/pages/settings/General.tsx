import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type SharedData } from '@/types';

const SettingsCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow border border-gray-100">
        <div className="px-4 py-5 sm:px-6"><h3 className="text-lg font-semibold text-gray-800">{title}</h3></div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">{children}</div>
    </div>
);

export default function General() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        avatar: null as File | null,
        current_password: '',
        password: '',
        password_confirmation: '',
        _method: 'PUT',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('settings.update'), {
            onSuccess: () => reset('current_password', 'password', 'password_confirmation', 'avatar'),
        });
    }

    return (
        <>
            <Head title="Pengaturan Profil" />
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Profil</h1>
            <div className="space-y-6 max-w-3xl">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <SettingsCard title="Informasi Profil">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Profil
                                </label>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={data.avatar ? URL.createObjectURL(data.avatar) : (auth.user.avatar ? `/storage/${auth.user.avatar}` : '/images/default-avatar.png')}
                                        alt={auth.user.name}
                                        className="h-20 w-20 rounded-full object-cover border-2 border-[#7ACAB0]"
                                    />
                                    <div>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/*"
                                            onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e6f4ef] file:text-[#3d7f6a] hover:file:bg-[#d7efe6]"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG maksimal 2MB</p>
                                    </div>
                                </div>
                                {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>
                    </SettingsCard>

                    <SettingsCard title="Ubah Password">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                    Password Lama
                                </label>
                                <input
                                    type="password"
                                    id="current_password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                />
                                {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                <p className="mt-1 text-sm text-gray-500">Biarkan kosong jika tidak ingin mengubah password</p>
                            </div>
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                />
                            </div>
                        </div>
                    </SettingsCard>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="rounded-md bg-[#7ACAB0] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5FA18C] disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
}

General.layout = (page: React.ReactElement) => <AppLayout title="Pengaturan Profil" children={page} />;
