import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/Pagination';
import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';
import { SharedData } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

// Tipe Data untuk Role
interface Role {
    id: number;
    name: string;
    label: string;
}

// Tipe Data untuk User
interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

// Tipe untuk link paginasi agar tidak 'any'
interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Tipe Props untuk Halaman Index
interface UserIndexProps {
    users: {
        data: User[];
        links: PaginatorLink[];
    };
}

export default function Index({ users }: UserIndexProps) {
    // Mengambil informasi auth lengkap, termasuk roles
    const { auth } = usePage<SharedData>().props;
    // Variabel boolean untuk memeriksa apakah user saat ini adalah superadmin
    const isSuperAdmin = auth.roles.includes('superadmin');

    // State dan Logika untuk Modal Hapus (tidak ada perubahan)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const openDeleteModal = (user: User) => { setUserToDelete(user); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setUserToDelete(null); };
    const confirmDelete = () => { if (!userToDelete) return; router.delete(route('users.destroy', userToDelete.id), { onSuccess: () => closeDeleteModal(), preserveScroll: true }); };

    // Fungsi helper untuk styling label peran (tidak ada perubahan)
    const getRoleLabel = (roles: Role[]) => {
        if (roles.length === 0) return <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">No Role</span>;
        const role = roles[0];
        let color = 'bg-blue-100 text-blue-700';
        if (role.name === 'superadmin') color = 'bg-red-100 text-red-700';
        if (role.name === 'admin') color = 'bg-yellow-100 text-yellow-700';
        return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${color}`}>{role.label}</span>;
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>

                {/* --- PERUBAHAN #1: Tampilkan Tombol HANYA jika Super Admin --- */}
                {isSuperAdmin && (
                    <Link href={route('users.create')} className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
                        Tambah Pengguna
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peran</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.data.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getRoleLabel(user.roles)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-x-3">
                                            {/* --- PERUBAHAN #2: Logika Aksi Disesuaikan --- */}
                                            {isSuperAdmin && !user.roles.find(role => role.name === 'superadmin') ? (
                                                <>
                                                    <Link href={route('users.edit', user.id)} className="text-gray-400 hover:text-indigo-600" title="Edit">
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </Link>
                                                    <button onClick={() => openDeleteModal(user)} className="text-gray-400 hover:text-red-600" title="Hapus">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : user.roles.find(role => role.name === 'superadmin') ? (
                                                <span className="text-xs text-gray-400 italic">Tidak ada aksi</span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Hanya Admin</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={users.links} />
            </div>

            <ConfirmationModal
                show={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.name}"? Aksi ini tidak dapat dibatalkan.`}
            />
        </>
    );
}

Index.layout = (page: React.ReactElement) => <AppLayout title="Manajemen Pengguna" children={page} />;
