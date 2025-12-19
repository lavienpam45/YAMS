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

interface ActivityLog {
    id: number;
    action: string;
    target_name: string | null;
    target_id: number | null;
    target_type?: string | null;
    created_at: string;
    actor: {
        id: number;
        name: string;
        email: string;
    } | null;
    target_user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    metadata?: Record<string, unknown>;
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
    activityLogs: ActivityLog[];
}

export default function Index({ users, activityLogs }: UserIndexProps) {
    // Mengambil informasi auth lengkap, termasuk roles
    const { auth } = usePage<SharedData>().props;
    // Variabel boolean untuk memeriksa apakah user saat ini adalah superadmin
    const isSuperAdmin = auth.roles.includes('superadmin');

    // State dan Logika untuk Modal Hapus (tidak ada perubahan)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [activityTab, setActivityTab] = useState<'all' | 'user' | 'asset'>('all');
    const [activityPage, setActivityPage] = useState(1);
    const itemsPerPage = 10;
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

    const renderActionLabel = (action: string) => {
        if (action === 'user.created') return 'Tambah pengguna';
        if (action === 'user.updated') return 'Ubah pengguna';
        if (action === 'user.deleted') return 'Hapus pengguna';
        if (action === 'asset.created') return 'Tambah aset';
        if (action === 'asset.updated') return 'Ubah aset';
        if (action === 'asset.deleted') return 'Hapus aset';
        return action;
    };

    const filteredActivityLogs = activityLogs.filter((log) => {
        if (activityTab === 'all') return true;
        const type = log.target_type || (log.action.startsWith('asset.') ? 'asset' : log.action.startsWith('user.') ? 'user' : undefined);
        if (activityTab === 'user') return type === 'user';
        if (activityTab === 'asset') return type === 'asset';
        return true;
    });

    const totalPages = Math.ceil(filteredActivityLogs.length / itemsPerPage);
    const paginatedActivityLogs = filteredActivityLogs.slice((activityPage - 1) * itemsPerPage, activityPage * itemsPerPage);

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>

                {/* --- PERUBAHAN #1: Tampilkan Tombol HANYA jika Super Admin --- */}
                {isSuperAdmin && (
                    <Link href={route('users.create')} className="rounded-md bg-[#7ACAB0] px-4 py-2 font-semibold text-white hover:bg-[#5FA18C]">
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

            {isSuperAdmin && (
                <div className="mt-6 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Riwayat Aktivitas Admin</h2>
                            <p className="text-xs text-gray-500">Terbaru (maks 30)</p>
                        </div>
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'Semua' },
                                { key: 'user', label: 'Pengguna' },
                                { key: 'asset', label: 'Aset' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActivityTab(tab.key as 'all' | 'user' | 'asset')}
                                    className={`rounded-md px-3 py-1 text-sm font-medium border ${activityTab === tab.key ? 'bg-[#7ACAB0] text-white border-[#7ACAB0]' : 'bg-white text-gray-700 border-gray-300'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {paginatedActivityLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">Belum ada aktivitas</td>
                                    </tr>
                                )}
                                {paginatedActivityLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.actor?.name || 'Sistem'}<div className="text-xs text-gray-500">{log.actor?.email || '-'}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{renderActionLabel(log.action)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.target_name || '—'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {(() => {
                                                const meta = log.metadata as Record<string, unknown> | undefined;
                                                const changes = (meta as any)?.changes as Record<string, any> | undefined;
                                                const fields = (meta as any)?.fields as Record<string, unknown> | undefined;
                                                const role = meta?.role;
                                                const assetCode = meta?.asset_code;

                                                if (changes && Object.keys(changes).length > 0) {
                                                    return (
                                                        <div className="space-y-1">
                                                            {Object.entries(changes).map(([field, data]) => {
                                                                // Handle both string messages and {old, new} objects
                                                                if (typeof data === 'string') {
                                                                    return (
                                                                        <div key={field} className="text-xs text-gray-700">
                                                                            {data}
                                                                        </div>
                                                                    );
                                                                }
                                                                if (typeof data === 'object' && data.old !== undefined && data.new !== undefined) {
                                                                    return (
                                                                        <div key={field} className="text-xs">
                                                                            <strong>{field}:</strong> {String(data.old)} → {String(data.new)}
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    );
                                                }
                                                if (fields && Object.keys(fields).length > 0) {
                                                    return (
                                                        <div className="space-y-1">
                                                            {Object.entries(fields).slice(0, 5).map(([field, value]) => (
                                                                <div key={field} className="text-xs">
                                                                    <strong>{field}:</strong> {String(value)}
                                                                </div>
                                                            ))}
                                                            {Object.keys(fields).length > 5 && <div className="text-xs italic text-gray-400">+{Object.keys(fields).length - 5} field lainnya</div>}
                                                        </div>
                                                    );
                                                }
                                                if (role) {
                                                    return <span>Peran: {String(role)}</span>;
                                                }
                                                if (assetCode) {
                                                    return <span>Kode Aset: {String(assetCode)}</span>;
                                                }
                                                return <span className="text-gray-400">-</span>;
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="text-sm text-gray-600">
                                Halaman {activityPage} dari {totalPages} (Total: {filteredActivityLogs.length} aktivitas)
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActivityPage(Math.max(1, activityPage - 1))}
                                    disabled={activityPage === 1}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setActivityPage(Math.min(totalPages, activityPage + 1))}
                                    disabled={activityPage === totalPages}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
