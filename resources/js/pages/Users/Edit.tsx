import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';

// Tipe data yang diterima dari controller
interface Role { id: number; label: string; name: string; }
interface User { id: number; name: string; email: string; roles: Role[]; }
interface EditUserProps { user: User; roles: Role[]; }

export default function Edit({ user, roles }: EditUserProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        role_id: user.roles[0]?.id.toString() || '', // Ambil ID peran pertama, atau default ke '' (No Role)
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <>
            <Head title={`Edit Pengguna - ${user.name}`} />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Pengguna</h1>

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
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600">{user.email}</p>
                            <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah oleh admin.</p>
                        </div>
                        <div>
                            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Peran</label>
                            <select id="role_id" value={data.role_id} onChange={e => setData('role_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">No Role (Tidak dapat login)</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Pengguna dengan "No Role" tidak dapat login sampai diberi role oleh Super Admin.</p>
                        </div>

                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link href={route('users.index')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md">Batal</Link>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md disabled:opacity-50">
                            {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactElement) => <AppLayout title="Edit Pengguna" children={page} />;
