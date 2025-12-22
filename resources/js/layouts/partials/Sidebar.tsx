import { logout } from '@/routes';
import { ArrowLeftIcon, ArrowLeftOnRectangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import React from 'react'; // Pastikan React di-import
import { route } from 'ziggy-js';

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
                'fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-lg transform transition-transform duration-200 pt-16 z-30 ' +
                (isOpen ? 'translate-x-0' : '-translate-x-full')
            }
            style={{
                borderRight: `2px solid rgba(12, 126, 70, 0.15)`,
                backgroundImage: `radial-gradient(circle at 50% 30%, rgba(12, 126, 70, 0.08) 0%, transparent 60%)`
            }}
        >
            <div className="relative flex h-16 shrink-0 items-center justify-center px-4">
                <h1 className="text-2xl font-bold" style={{ color: '#0C7E46' }}>YAMS</h1>
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full text-white shadow-lg flex items-center justify-center hover:opacity-90 transition"
                    style={{ backgroundColor: '#0C7E46' }}
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
                                        className={classNames(
                                            component.toLowerCase().startsWith(item.check.toLowerCase())
                                                ? 'text-white'
                                                : 'text-gray-700 hover:bg-gray-100',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                                        )}
                                        style={component.toLowerCase().startsWith(item.check.toLowerCase()) ? { backgroundColor: '#0C7E46' } : {}}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto p-4">
                        <Link href={logout()} method="post" as="button" className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100 transition-colors">
                            <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" style={{ color: '#0C7E46' }} aria-hidden="true" />
                            Keluar
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
