import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLogoIcon from '@/components/app-logo-icon'; // Menggunakan Icon agar rapi
import { PageProps } from '@/types';



export default function LandingNavbar() {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
                {/* Bagian Kiri: Logo & Nama Brand */}
                <div className="flex items-center gap-3">
                    <AppLogoIcon className="h-8 w-8 text-primary fill-current" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        YAMS
                    </span>
                </div>

                {/* Bagian Kanan: Tombol Login & Daftar */}
                {/* Class 'ml-auto' mendorong grup ini ke paling kanan */}
                <div className="flex items-center gap-4 ml-auto">
                    {auth.user ? (
                        // Jika User SUDAH Login -> Tampilkan tombol Dashboard
                        <Link href={route('dashboard')}>
                            <Button variant="default">Dashboard</Button>
                        </Link>
                    ) : (
                        // Jika User BELUM Login -> Tampilkan Masuk & Daftar
                        <>
                            <Link href={route('login')}>
                                <Button variant="ghost" className="font-semibold">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href={route('register')}>
                                <Button variant="default">
                                    Daftar
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
