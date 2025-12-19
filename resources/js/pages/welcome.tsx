import LandingNavbar from '@/components/landing-navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Calculator, QrCode, ShieldCheck } from 'lucide-react'; // Ikon dari Lucide (biasanya sudah ada di Laravel Herd/Shadcn)


export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Selamat Datang" />

            <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">

                {/* 1. NAVBAR (Yang sudah kita buat) */}
                <LandingNavbar />

                <main>
                    {/* 2. HERO SECTION: Bagian Utama */}
                    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
                        {/* Background Decoration */}
                        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]">
                            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#1e293b,transparent)]"></div>
                        </div>

                        <div className="container mx-auto px-4 text-center md:px-8">
                            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                Sistem Manajemen Aset Terintegrasi
                            </div>

                            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                                Kelola Aset Kampus dengan <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-[#7ACAB0] to-[#5FA18C]">Cerdas & Akurat</span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                                YAMS membantu Universitas Yarsi melakukan perhitungan penyusutan otomatis, pelacakan lokasi, dan pelaporan audit aset dalam satu platform terpusat.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link href={route('dashboard')}>
                                        <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">
                                            Buka Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')}>
                                            <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">
                                                Mulai Sekarang
                                            </Button>
                                        </Link>
                                        <Link href="#fitur">
                                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                                Pelajari Fitur
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 3. FEATURE SECTION: Kartu Keunggulan */}
                    <section id="fitur" className="py-20 bg-muted/30">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Mengapa YAMS?</h2>
                                <p className="mt-4 text-muted-foreground">Solusi lengkap untuk tantangan manajemen aset modern.</p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {/* Kartu 1: Penyusutan */}
                                <Card className="border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#e6f4ef] text-[#3d7f6a] dark:bg-[#1f2d2a] dark:text-[#9cdac2]">
                                            <Calculator className="h-6 w-6" />
                                        </div>
                                        <CardTitle>Penyusutan Otomatis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Tidak perlu hitung manual. Sistem menghitung penurunan nilai aset setiap tahun sesuai rumus akuntansi yang berlaku.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                {/* Kartu 2: Pelacakan */}
                                <Card className="border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#d7efe6] text-[#3d7f6a] dark:bg-[#1f2d2a] dark:text-[#9cdac2]">
                                            <QrCode className="h-6 w-6" />
                                        </div>
                                        <CardTitle>Pelacakan Lokasi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Ketahui posisi pasti setiap aset, siapa penanggung jawabnya, dan kondisi fisiknya (Baik/Rusak) secara real-time.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                {/* Kartu 3: Laporan */}
                                <Card className="border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#e6f4ef] text-[#3d7f6a] dark:bg-[#1f2d2a] dark:text-[#9cdac2]">
                                            <BarChart3 className="h-6 w-6" />
                                        </div>
                                        <CardTitle>Laporan Akurat</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Cetak laporan nilai buku aset dalam format PDF atau Excel untuk kebutuhan audit dan pelaporan pimpinan.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                {/* Kartu 4: Keamanan */}
                                <Card className="border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <CardHeader>
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#d7efe6] text-[#3d7f6a] dark:bg-[#1f2d2a] dark:text-[#9cdac2]">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <CardTitle>Akses Terkontrol</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Login khusus email internal Yarsi dengan pembagian hak akses (Role) yang jelas antara Superadmin, Admin, dan User.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 4. FOOTER */}
                <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Yarsi Asset Management System (YAMS). All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
