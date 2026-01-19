import { Head, Link } from '@inertiajs/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function RegistrationPending() {
    return (
        <>
            <Head title="Pendaftaran Berhasil" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                <CheckCircleIcon className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        
                        <h2 className="mt-6 text-3xl font-extrabold text-white">
                            Pendaftaran Berhasil!
                        </h2>
                        
                        <p className="mt-4 text-lg text-slate-300">
                            Akun Anda telah berhasil didaftarkan dalam sistem YAMS.
                        </p>

                        <div className="mt-8 bg-slate-700/50 border border-slate-600 rounded-lg p-6 text-left space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">
                                    ⏳ Menunggu Persetujuan Administrator
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Akun Anda sedang menunggu persetujuan dari administrator sistem. 
                                    Anda akan menerima notifikasi melalui email ketika akun Anda telah diaktifkan.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">
                                    📧 Verifikasi Email
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Periksa email Anda untuk detail pendaftaran. 
                                    Jika Anda tidak menerima email, hubungi administrator sistem.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">
                                    🔐 Keamanan Akun
                                </h3>
                                <p className="text-sm text-slate-300">
                                    Pastikan password Anda aman dan tidak dibagikan kepada orang lain. 
                                    Administrator tidak akan pernah meminta password Anda.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm text-slate-400 mb-4">
                                Waktu persetujuan biasanya memakan waktu 1-2 hari kerja.
                            </p>
                            
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                Kembali ke Login
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-slate-500">
                            Sistem Manajemen Aset YAMS • Universitas Yarsi
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
