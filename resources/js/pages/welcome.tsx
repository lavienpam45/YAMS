import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to YAMS" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
                {/* Header dengan Tombol Login */}
                <header className="absolute top-0 right-0 flex w-full justify-end p-6">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Login
                        </Link>
                    )}
                </header>

                {/* Konten Utama */}
                <main className="text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Selamat Datang di YAMS
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Solusi manajemen dan penyusutan aset yang handal untuk
                        bisnis Anda.
                    </p>
                    <p className="mt-2 text-gray-600">
                        Silakan login untuk memulai.
                    </p>
                </main>
            </div>
        </>
    );
}
