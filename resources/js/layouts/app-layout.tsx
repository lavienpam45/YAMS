import Sidebar from '@/layouts/partials/Sidebar';
import { type SharedData } from '@/types';
import { ArchiveBoxIcon, ChartPieIcon, ChevronDownIcon, Cog6ToothIcon, HomeIcon, UsersIcon, Square3Stack3DIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';
import { NotificationBell } from '@/components/NotificationBell';

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
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const idleTimeoutMs = 30 * 60 * 1000; // 30 menit

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        const handleIdleLogout = () => {
            toast.error('Anda otomatis keluar setelah 30 menit tidak aktif.');
            router.post(route('logout'));
        };

        const resetTimer = () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            idleTimerRef.current = setTimeout(handleIdleLogout, idleTimeoutMs);
        };

        const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, []);

    const allNavLinks = [
        { name: 'Dashboard', routeName: 'dashboard', check: 'dashboard', icon: HomeIcon, allowed: ['superadmin', 'admin', 'user'] },
        { name: 'Manajemen Aset', routeName: 'assets.index', check: 'Assets', icon: ArchiveBoxIcon, allowed: ['superadmin', 'admin'] },
        { name: 'Laporan', routeName: 'reports.index', check: 'Reports', icon: ChartPieIcon, allowed: ['superadmin', 'admin', 'user'] },
        { name: 'Manajemen Pengguna', routeName: 'users.index', check: 'Users', icon: UsersIcon, allowed: ['superadmin'] },
        { name: 'Manajemen Rumus', routeName: 'formulas.index', check: 'Formulas', icon: ArrowTrendingDownIcon, allowed: ['superadmin'] },
        { name: 'Kalkulator Aset', routeName: 'calculator.index', check: 'Calculator', icon: Square3Stack3DIcon, allowed: ['superadmin', 'admin'] },
        { name: 'Pengaturan', routeName: 'settings.show', check: 'settings', icon: Cog6ToothIcon, allowed: ['superadmin', 'admin', 'user'] },
    ];

    const filteredNavLinks = allNavLinks.filter(link =>
        link.allowed.some(allowedRole => roles.includes(allowedRole))
    );

    const mainPaddingClass = sidebarOpen ? 'pl-64' : 'pl-6';
    const headerContentPadding = sidebarOpen ? 'pl-72' : 'pl-6';

    return (
        <div className="min-h-screen" style={{
            backgroundColor: '#f9fafb',
            backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.10) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.08) 0%, transparent 50%)
            `
        }}>
            <Head title={title} />

            <Sidebar navLinks={filteredNavLinks} isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

            <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm" style={{
                borderBottom: `2px solid rgba(12, 126, 70, 0.2)`,
                backgroundImage: `radial-gradient(circle at 50% 0%, rgba(12, 126, 70, 0.06) 0%, transparent 60%)`
            }}>
                <div className={`flex items-center justify-between gap-3 px-6 py-4 transition-all duration-200 ${headerContentPadding}`}>
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

                    <div className="flex items-center gap-2">
                        <NotificationBell />

                        {/* Profile Dropdown */}
                        <div className="relative">
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
                        >
                            <img
                                src={auth.user.avatar || '/images/default-avatar.png'}
                                alt={auth.user.name}
                                className="h-9 w-9 rounded-full object-cover border-2"
                                style={{ borderColor: '#0C7E46' }}
                            />
                            <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <Link
                                    href={route('settings.show')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                    onClick={() => setProfileDropdownOpen(false)}
                                    style={{ color: '#0C7E46' }}
                                >
                                    Pengaturan Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                    style={{ color: '#0C7E46' }}
                                >
                                    Keluar
                                </Link>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </header>

            <div className={mainPaddingClass + ' transition-all duration-200 pt-20'}>
                <main>
                    <div className="p-8" style={{
                        backgroundImage: `radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)`
                    }}>
                       {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
