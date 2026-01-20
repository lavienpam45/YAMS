import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';


export default function LandingNavbar() {
    const { auth } = usePage<PageProps>().props;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm" style={{
            backgroundColor: '#0C7E46',
            borderColor: 'rgba(12, 126, 70, 0.3)'
        }}>
            <div className="container mx-auto flex h-16 items-center px-4 md:px-8 justify-between">
                {/* Bagian Kiri: Logo & Nama Brand */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center font-black text-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                        Y
                    </div>
                    <div>
                        <div className="text-lg font-black tracking-tighter" style={{ color: '#ffffff' }}>
                            YAMS
                        </div>
                        <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Aset Management</div>
                    </div>
                </Link>

                {/* Bagian Tengah: Navigation Links */}
                <div className="hidden lg:flex items-center gap-12">
                    {!auth.user && (
                        <>
                            <button
                                onClick={() => scrollToSection('tentang')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                Tentang
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('fitur')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                Fitur Utama
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                Cara Kerja
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('security')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                Keamanan
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('manfaat')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                Manfaat
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-sm font-semibold transition-colors relative group"
                                style={{ color: '#ffffff' }}
                            >
                                FAQ
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="text-sm font-semibold transition-colors relative group cursor-pointer"
                                style={{ color: '#ffffff' }}
                            >
                                Hubungi
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all" style={{ backgroundColor: '#ffffff' }}></span>
                            </button>
                        </>
                    )}
                </div>

                {/* Bagian Kanan: Tombol CTA */}
                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <Link href={route('dashboard')}>
                            <Button size="sm" className="text-white font-bold px-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')}>
                                <Button size="sm" className="font-bold px-4" style={{ color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                                    Masuk
                                </Button>
                            </Link>
                            <Link href={route('register')}>
                                <Button size="sm" className="text-white font-bold px-6" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
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
