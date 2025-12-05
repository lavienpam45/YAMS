import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ArchiveBoxIcon,
    ChartPieIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';
import { logout } from '@/routes';

const navLinks = [
    { name: 'Dashboard', routeName: 'dashboard', check: 'dashboard', icon: HomeIcon },
    { name: 'Manajemen Aset', routeName: 'assets.index', check: 'Assets', icon: ArchiveBoxIcon },
    { name: 'Laporan', routeName: 'reports.index', check: 'Reports', icon: ChartPieIcon },
    // --- PERBAIKI RUTE DI SINI ---
    { name: 'Manajemen Pengguna', routeName: 'users.index', check: 'Users', icon: UsersIcon },
    { name: 'Pengaturan', routeName: '#', check: 'Pengaturan', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
    const { component } = usePage();

    return (
        <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-md">
            <div className="flex h-16 shrink-0 items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-indigo-600">YAMS</h1>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1 p-4">
                            {navLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.routeName === '#' ? '#' : route(item.routeName)}
                                        className={classNames(
                                            component.toLowerCase().startsWith(item.check.toLowerCase())
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto p-4">
                         <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                            Keluar
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
