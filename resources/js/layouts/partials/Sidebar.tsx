import { Link, usePage } from '@inertiajs/react';
import { HomeIcon, ArchiveBoxIcon, ChartPieIcon, UsersIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';
import { logout } from '@/routes';
import React from 'react'; // Pastikan React di-import

interface NavLink {
    name: string;
    routeName: string;
    check: string;
    icon: React.ElementType;
}

interface SidebarProps {
    navLinks: NavLink[];
    isOpen: boolean;
    onToggle: () => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ navLinks, isOpen, onToggle }: SidebarProps) {
    const { component } = usePage();

    return (
        <aside
            className={
                'fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-md transform transition-transform duration-200 pt-16 z-30 ' +
                (isOpen ? 'translate-x-0' : '-translate-x-full')
            }
        >
            <div className="relative flex h-16 shrink-0 items-center justify-center px-4">
                <h1 className="text-2xl font-bold text-[#7ACAB0]">YAMS</h1>
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#3D7F6A] text-white shadow-lg flex items-center justify-center hover:bg-[#5FA18C] transition"
                    aria-label={isOpen ? 'Tutup sidebar' : 'Buka sidebar'}
                >
                    {isOpen ? <ArrowLeftIcon className="h-5 w-5" /> : <ArrowRightIcon className="h-5 w-5" />}
                </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1 p-4">
                            {navLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.routeName === '#' ? '#' : route(item.routeName)}
                                        className={classNames( component.toLowerCase().startsWith(item.check.toLowerCase()) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto p-4">
                        <Link href={logout()} method="post" as="button" className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100">
                            <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                            Keluar
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
