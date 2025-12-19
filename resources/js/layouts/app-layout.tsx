import { useEffect, useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import Sidebar from '@/layouts/partials/Sidebar';
import { type SharedData } from '@/types';
import toast from 'react-hot-toast';
import React from 'react';
import { HomeIcon, ArchiveBoxIcon, ChartPieIcon, UsersIcon, Cog6ToothIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';

// --- PERBAIKAN UTAMA DI SINI ---
// Definisikan tipe props yang diterima oleh AppLayout
interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    // Kita tidak perlu lagi mengambil 'title' dari usePage
    const { props } = usePage<SharedData>();
    const { auth, flash } = props;
    const roles = auth.roles || [];
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const allNavLinks = [
        { name: 'Dashboard', routeName: 'dashboard', check: 'dashboard', icon: HomeIcon, allowed: ['superadmin', 'admin', 'user'] },
        { name: 'Manajemen Aset', routeName: 'assets.index', check: 'Assets', icon: ArchiveBoxIcon, allowed: ['superadmin', 'admin'] },
        { name: 'Laporan', routeName: 'reports.index', check: 'Reports', icon: ChartPieIcon, allowed: ['superadmin', 'admin'] },
        { name: 'Manajemen Pengguna', routeName: 'users.index', check: 'Users', icon: UsersIcon, allowed: ['superadmin'] },
        { name: 'Manajemen Rumus', routeName: 'formulas.index', check: 'Formulas', icon: UsersIcon, allowed: ['superadmin'] },
        { name: 'Pengaturan', routeName: 'settings.show', check: 'settings', icon: Cog6ToothIcon, allowed: ['superadmin', 'admin', 'user'] },
    ];

    const filteredNavLinks = allNavLinks.filter(link =>
        link.allowed.some(allowedRole => roles.includes(allowedRole))
    );

    const mainPaddingClass = sidebarOpen ? 'pl-64' : 'pl-6';
    const headerContentPadding = sidebarOpen ? 'pl-72' : 'pl-6';

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />

            <Sidebar navLinks={filteredNavLinks} isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

            <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
                <div className={`flex items-center justify-between gap-3 px-6 py-4 transition-all duration-200 ${headerContentPadding}`}>
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
                        >
                            <img
                                src={auth.user.avatar || '/images/default-avatar.png'}
                                alt={auth.user.name}
                                className="h-9 w-9 rounded-full object-cover border-2 border-[#7ACAB0]"
                            />
                            <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <Link
                                    href={route('settings.show')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    Pengaturan Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Keluar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className={mainPaddingClass + ' transition-all duration-200 pt-20'}>
                <main>
                    <div className="p-8">
                       {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
