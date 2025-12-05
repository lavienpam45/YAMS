import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';

// Props dari controller akan berisi daftar peran yang bisa dipilih
interface Role { id: number; label: string; name: string; }
interface CreateUserProps { roles: Role[]; }

export default function Create({ roles }: CreateUserProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '3', // Default ke 'user' (ID 3)
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Pengguna Baru</h1>
            <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                            <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
                        </div>
                         <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <input type="password" id="password_confirmation" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Peran</label>
                            <select id="role_id" value={data.role_id} onChange={e => setData('role_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={route('users.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md">Batal</Link>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactElement) => <AppLayout title="Tambah Pengguna" children={page} />;
