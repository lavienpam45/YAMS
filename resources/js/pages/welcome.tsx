import { Head, Link } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to YAMS" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
                {/* Header dengan Tombol Login */}
                <header className="absolute top-0 right-0 p-6 w-full flex justify-end">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                        >
                            Dashboard
                        </Link>
                    ) : (
                         <Link
                            href={login()}
                            className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                        >
                            Login
                        </Link>
                    )}
                </header>

                {/* Konten Utama */}
                <main className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Selamat Datang di YAMS
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Solusi manajemen dan penyusutan aset yang handal untuk bisnis Anda.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Silakan login untuk memulai.
                    </p>
                </main>
            </div>
        </>
    );
}
