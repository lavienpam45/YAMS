import { type PropsWithChildren, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '@/layouts/partials/Sidebar';
import { type SharedData } from '@/types';
import toast from 'react-hot-toast';
import React from 'react';
import { HomeIcon, ArchiveBoxIcon, ChartPieIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AppLayout({ children }: PropsWithChildren) {
    const { props } = usePage<SharedData & { title?: string }>();
    const { auth, flash, title } = props;
    const roles = auth.roles || [];

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Definisikan semua kemungkinan link menu beserta peran yang diizinkan
    const allNavLinks = [
        { name: 'Dashboard', routeName: 'dashboard', check: 'dashboard', icon: HomeIcon, allowed: ['superadmin', 'admin', 'user'] },
        { name: 'Manajemen Aset', routeName: 'assets.index', check: 'Assets', icon: ArchiveBoxIcon, allowed: ['superadmin', 'admin'] },
        { name: 'Laporan', routeName: 'reports.index', check: 'Reports', icon: ChartPieIcon, allowed: ['superadmin', 'admin'] }, // Dihapus 'user'
        { name: 'Manajemen Pengguna', routeName: 'users.index', check: 'Users', icon: UsersIcon, allowed: ['superadmin'] },
        { name: 'Pengaturan', routeName: 'settings.show', check: 'settings', icon: Cog6ToothIcon, allowed: ['superadmin'] },
    ];

    // Logika untuk memfilter menu berdasarkan peran pengguna yang login
    const filteredNavLinks = allNavLinks.filter(link =>
        link.allowed.some(allowedRole => roles.includes(allowedRole))
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title || 'YAMS'} />

            <Sidebar navLinks={filteredNavLinks} />

            <div className="pl-64">
                <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                </header>
                <main>
                    <div className="p-8">
                       {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
