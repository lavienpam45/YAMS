import { type PropsWithChildren, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '@/layouts/partials/Sidebar';
import { type SharedData } from '@/types';
import toast from 'react-hot-toast';
import React from 'react';

// Tipe untuk props yang akan diterima oleh layout ini
interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />
            <Sidebar />
            <div className="pl-64">
                <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                </header>
                <main>
                    <div className="p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
