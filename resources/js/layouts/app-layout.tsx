import Sidebar from '@/layouts/partials/Sidebar';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

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
                <header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h1>
                </header>
                <main>
                    <div className="p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
