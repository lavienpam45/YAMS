import { Head, Link } from '@inertiajs/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function RegistrationPending() {
    return (
        <>
            <Head title="Pendaftaran Berhasil" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl text-center">
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                <CheckCircleIcon className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        
                        <h2 className="mt-6 text-2xl font-bold text-white">
                            Pendaftaran Berhasil!
                        </h2>
                        
                        <p className="mt-4 text-slate-300">
                            Akun Anda telah berhasil didaftarkan dalam sistem YAMS.
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            Mohon menunggu Super Admin untuk menyetujui akun Anda.
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors w-full"
                            >
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
