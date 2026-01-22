import LandingNavbar from '@/components/landing-navbar';
import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calculator, ChevronDown, Lock, MapPin, ShieldCheck, TrendingUp, Users, CreditCard as CreditCardIcon, Building2 as BuildingOfficeIcon, LayoutGrid, FileText } from 'lucide-react';
import { useState } from 'react';


export default function Welcome({ auth }: PageProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqItems = [
        {
            question: 'Apa itu YAMS dan bagaimana cara kerjanya?',
            answer: 'YAMS adalah Yarsi Asset Management System, platform digital terintegrasi untuk mengelola aset universitas. Sistem ini menghitung penyusutan otomatis, melacak lokasi aset secara waktu nyata, dan menghasilkan laporan akurat untuk kebutuhan audit dan pelaporan keuangan.'
        },
        {
            question: 'Siapa yang bisa menggunakan YAMS?',
            answer: 'YAMS dirancang untuk pengguna internal Universitas Yarsi. Setiap pengguna mendapatkan akses sesuai kebutuhan mereka - dari melihat dashboard aset hingga membuat laporan komprehensif. Administrator akan mengatur akses sesuai dengan fungsi dan departemen Anda.'
        },
        {
            question: 'Bagaimana proses login dan keamanan data?',
            answer: 'Login menggunakan email dan password yang terdaftar. YAMS mendukung two-factor authentication untuk keamanan ekstra. Semua data terenkripsi end-to-end dengan sistem kontrol akses dan audit trail lengkap untuk setiap perubahan data.'
        },
        {
            question: 'Bagaimana cara menghitung penyusutan aset?',
            answer: 'YAMS menggunakan rumus penyusutan yang dapat disesuaikan dengan standar akuntansi Anda. Sistem ini dapat dikonfigurasi dengan berbagai metode perhitungan dan menghitung secara otomatis setiap tahun atau sesuai periode yang ditentukan.'
        },
        {
            question: 'Bisa impor data aset dari Excel?',
            answer: 'Ya, YAMS mendukung bulk import dari file Excel. Cukup siapkan file dengan format yang sesuai, upload melalui sistem, dan data aset akan diproses secara otomatis dengan validasi akurat.'
        },
        {
            question: 'Bagaimana format laporan yang bisa dihasilkan?',
            answer: 'YAMS dapat menghasilkan laporan dalam format PDF dan Excel dengan visualisasi data yang profesional. Laporan mencakup harga aset saat ini, penyusutan akumulatif, status lokasi, dan informasi penanggungjawab untuk keperluan audit dan presentasi.'
        }
    ];

    return (
        <>
            <Head title="YAMS - Yarsi Asset Management System" />

            <div className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden" style={{
                backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.05) 0%, transparent 50%)
                `,
                backgroundAttachment: 'fixed'
            }}>

                {/* 1. NAVBAR */}
                <LandingNavbar />

                <main>
                    {/* 2. HERO SECTION - MODERN AESTHETIC BACKGROUND */}
                    <section className="relative min-h-screen pt-32 flex items-center justify-center overflow-hidden">
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/70 to-transparent"></div>

                        {/* Content */}
                        <div className="container mx-auto px-4 md:px-8 relative z-10">
                            <div className="max-w-2xl mx-auto text-center">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border-2" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                    <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: '#0C7E46' }}></span>
                                    <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>Solusi Manajemen Aset Digital</span>
                                </div>

                                {/* Main Heading - Modern Typography */}
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-snug text-gray-900">
                                    Kelola Aset<br />
                                    <span style={{ color: '#0C7E46' }}>Lebih Cerdas</span>
                                </h1>

                                {/* Subheading */}
                                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
                                    Platform terpadu untuk mengelola aset kampus Universitas Yarsi dengan perhitungan penyusutan otomatis, pelacakan waktu nyata, dan laporan akurat—semua dalam satu sistem yang mudah digunakan.
                                </p>

                                {/* CTA Button */}
                                {auth.user && (
                                    <Link href={route('dashboard')}>
                                        <Button size="lg" className="text-white font-bold px-8 py-6 text-base" style={{ backgroundColor: '#0C7E46' }}>
                                            Buka Dashboard
                                        </Button>
                                    </Link>
                                )}

                                {/* Stats Row */}
                                <div className="mt-16 pt-8 border-t border-gray-200 flex gap-8 justify-center text-center">
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: '#0C7E46' }}>1000+</div>
                                        <div className="text-sm text-gray-600">Aset</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: '#0C7E46' }}>99.9%</div>
                                        <div className="text-sm text-gray-600">Akurasi</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold" style={{ color: '#0C7E46' }}>24/7</div>
                                        <div className="text-sm text-gray-600">Monitoring</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements - Modern aesthetic */}
                        <div className="absolute top-1/4 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
                    </section>

                    {/* 2.5. TENTANG SECTION */}
                    <section id="tentang" className="py-20 md:py-32 bg-gradient-to-b from-white to-emerald-50 relative" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.05) 0%, transparent 50%)`
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                {/* Kolom Kiri - Teks */}
                                <div>
                                    <div className="inline-block px-4 py-2 rounded-full border-2 mb-6" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                        <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>TENTANG YAMS</span>
                                    </div>
                                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                                        Solusi Manajemen <span style={{ color: '#0C7E46' }}>Aset Terpadu</span>
                                    </h2>
                                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                        YAMS (Yarsi Asset Management System) adalah platform digital terintegrasi yang dirancang khusus untuk memenuhi kebutuhan manajemen aset Universitas Yarsi. Sistem ini menggabungkan teknologi cloud terkini dengan metodologi akuntansi yang telah terbukti.
                                    </p>
                                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                                        Dengan YAMS, institusi dapat mengelola aset dengan lebih transparan, akuntabel, dan efisien. Setiap transaksi tercatat dengan detail, penyusutan dihitung secara otomatis, dan laporan finansial dapat dihasilkan dalam hitungan detik.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <ShieldCheck className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">Keamanan Terjamin</h4>
                                                <p className="text-sm text-gray-600">Enkripsi end-to-end dan backup rutin</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <TrendingUp className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">Pertumbuhan Lancar</h4>
                                                <p className="text-sm text-gray-600">Skalabel untuk ribuan aset</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan - Visual */}
                                <div className="relative">
                                    <div className="bg-white rounded-2xl p-8 border-2 shadow-sm" style={{ borderColor: '#0C7E46' }}>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.05)' }}>
                                                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                                    <LayoutGrid className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Pemantauan Aset</h4>
                                                    <p className="text-sm text-gray-600">Lihat data aset secara real-time</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.05)' }}>
                                                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                                    <TrendingUp className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Penyusutan Otomatis</h4>
                                                    <p className="text-sm text-gray-600">Perhitungan akurat setiap tahun</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.05)' }}>
                                                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                                    <Calculator className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Kalkulator Aset</h4>
                                                    <p className="text-sm text-gray-600">Simulasi proyeksi nilai buku</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.05)' }}>
                                                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                                    <FileText className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Laporan dan Ekspor</h4>
                                                    <p className="text-sm text-gray-600">PDF dan Excel siap audit</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. FEATURES SECTION - MODERN GRID */}
                    <section id="fitur" className="py-20 md:py-32 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-8 bg-gradient-to-b from-green-400 to-transparent"></div>

                        <div className="container mx-auto px-4 md:px-8 relative z-10">
                            {/* Section Header */}
                            <div className="mb-20 text-center">
                                <div className="inline-block px-4 py-2 rounded-full border-2 mb-6" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                    <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>KEUNGGULAN YAMS</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-gray-900">
                                    Fitur <span style={{ color: '#0C7E46' }}>Unggulan</span>
                                </h2>
                                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                                    Teknologi terdepan untuk manajemen aset yang efisien dan terukur
                                </p>
                            </div>

                            {/* Features Grid - 2x2 */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Feature 1 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <LayoutGrid className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Pemantauan Aset Real-Time</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Dasbor Aset</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pengguna dapat melihat daftar aset Universitas Yarsi beserta informasi nilai buku, penyusutan, dan statistik aset secara keseluruhan.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Pantau aset kapan saja</span>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <TrendingUp className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Perhitungan Penyusutan Otomatis</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Kalkulasi Akurat</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Sistem menghitung penyusutan dan kenaikan nilai aset secara otomatis setiap tahun berdasarkan rumus yang telah dikonfigurasi dengan akurasi tinggi.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Akurasi tinggi otomatis</span>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <Calculator className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Kalkulator Aset</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Simulasi Nilai</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Fitur simulasi perhitungan nilai aset untuk memproyeksikan nilai buku di masa depan sebelum data dimasukkan ke sistem.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Proyeksi nilai masa depan</span>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <FileText className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Laporan dan Ekspor Data</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>PDF & Excel</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Akses cepat untuk menghasilkan laporan dalam format PDF dan Excel yang siap digunakan untuk keperluan audit dan pelaporan keuangan.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Siap untuk audit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. HOW IT WORKS - MODERN SECTION */}
                    <section id="features" className="py-20 md:py-32 bg-white relative" style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% 0%, rgba(12, 126, 70, 0.05) 0%, transparent 60%),
                            radial-gradient(circle at 40% 100%, rgba(16, 185, 129, 0.10) 0%, transparent 50%)
                        `
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="mb-16 text-center">
                                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
                                    Cara Kerja <span style={{ color: '#0C7E46' }}>YAMS</span>
                                </h2>
                                <p className="text-xl text-gray-400">Proses yang sederhana namun powerful</p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 md:gap-2">
                                {[
                                    { num: '01', title: 'Input Data', desc: 'Masukkan informasi aset dengan mudah' },
                                    { num: '02', title: 'Kalkulasi', desc: 'Sistem hitung penyusutan otomatis' },
                                    { num: '03', title: 'Monitor', desc: 'Pantau status aset real-time' },
                                    { num: '04', title: 'Lapor', desc: 'Generate laporan profesional' }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="text-center p-6">
                                            <div className="text-5xl font-black mb-4" style={{ color: '#0C7E46' }}>{step.num}</div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                                            <p className="text-sm text-gray-600">{step.desc}</p>
                                        </div>
                                        {idx < 3 && <div className="hidden md:block absolute right-0 top-1/2 w-8 h-0.5" style={{ backgroundColor: '#0C7E46', opacity: 0.3 }}></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5.5. USE CASES / MANFAAT SECTION */}
                    <section id="manfaat" className="py-20 md:py-32 bg-white relative" style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.08) 0%, transparent 50%)
                        `
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <div className="inline-block px-4 py-2 rounded-full border-2 mb-6" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                    <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>MANFAAT UNTUK ANDA</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-gray-900">
                                    Solusi untuk <span style={{ color: '#0C7E46' }}>Setiap Kebutuhan</span>
                                </h2>
                                <p className="text-xl text-gray-700">
                                    YAMS dirancang untuk berbagai peran dalam organisasi Anda
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Admin */}
                                <div className="group p-8 rounded-2xl border-2 bg-white hover:shadow-lg transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="p-4 rounded-lg mb-4 w-fit" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                        <Users className="h-8 w-8" style={{ color: '#0C7E46' }} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrator</h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Kelola user dan akses dengan mudah</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Pantau aktivitas sistem secara waktu nyata</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Buat cadangan dan pulihkan data</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Audit trail lengkap setiap perubahan</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Bagian Finance */}
                                <div className="group p-8 rounded-2xl border-2 bg-white hover:shadow-lg transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="p-4 rounded-lg mb-4 w-fit" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                        <CreditCardIcon className="h-8 w-8" style={{ color: '#0C7E46' }} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Keuangan</h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Hitung penyusutan secara otomatis dan akurat</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Laporan keuangan instan</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Data untuk keperluan audit dan kepatuhan</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Integrasi dengan sistem akuntansi</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Kepala Departemen */}
                                <div className="group p-8 rounded-2xl border-2 bg-white hover:shadow-lg transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="p-4 rounded-lg mb-4 w-fit" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                        <BuildingOfficeIcon className="h-8 w-8" style={{ color: '#0C7E46' }} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Kepala Departemen</h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Lihat daftar inventaris departemen lengkap</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Pantau kondisi aset secara waktu nyata</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Siapkan laporan untuk presentasi</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span style={{ color: '#0C7E46' }} className="font-bold">✓</span>
                                            <span>Rencana penggantian aset</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. FAQ SECTION - ACCORDION MODERN */}
                    <section id="faq" className="py-20 md:py-32 bg-white relative" style={{
                        backgroundImage: `
                            radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.06) 0%, transparent 60%),
                            radial-gradient(circle at 20% 80%, rgba(12, 126, 70, 0.10) 0%, transparent 50%)
                        `
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            {/* Header */}
                            <div className="mb-16 text-center max-w-3xl mx-auto">
                                <div className="inline-block px-4 py-2 rounded-full border-2 bg-white mb-6" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                    <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>PERTANYAAN UMUM</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-gray-900">
                                    Sering <span style={{ color: '#0C7E46' }}>Ditanyakan</span>
                                </h2>
                                <p className="text-xl text-gray-700">
                                    Temukan jawaban lengkap untuk semua pertanyaan Anda tentang YAMS
                                </p>
                            </div>

                            {/* FAQ Items */}
                            <div className="max-w-4xl mx-auto space-y-4">
                                {faqItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border-2 rounded-xl overflow-hidden transition-all duration-300"
                                        style={{
                                            borderColor: expandedFaq === idx ? '#0C7E46' : '#e5e7eb',
                                            backgroundColor: expandedFaq === idx ? 'rgba(12, 126, 70, 0.05)' : 'white'
                                        }}
                                    >
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                            className="w-full p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="text-left">
                                                <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">
                                                    {item.question}
                                                </h3>
                                            </div>
                                            <ChevronDown
                                                className="h-6 w-6 flex-shrink-0 transition-transform duration-300 mt-1"
                                                style={{
                                                    color: '#0C7E46',
                                                    transform: expandedFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }}
                                            />
                                        </button>

                                        {/* Answer - Expandable */}
                                        {expandedFaq === idx && (
                                            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t-2 pt-6" style={{ borderColor: 'rgba(12, 126, 70, 0.2)' }}>
                                                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 7. STATS SECTION - VISUAL IMPACT */}
                    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-emerald-50 relative" style={{
                        backgroundImage: `radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 60%)`
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="grid md:grid-cols-4 gap-8 text-center">
                                <div className="space-y-4">
                                    <div className="text-5xl md:text-6xl font-black" style={{ color: '#0C7E46' }}>1000+</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Aset Terpantau</h4>
                                        <p className="text-gray-600 text-sm">Dalam sistem YAMS</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-5xl md:text-6xl font-black" style={{ color: '#0C7E46' }}>99.9%</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Akurasi</h4>
                                        <p className="text-gray-600 text-sm">Kalkulasi penyusutan</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-5xl md:text-6xl font-black" style={{ color: '#0C7E46' }}>24/7</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Pemantauan</h4>
                                        <p className="text-gray-600 text-sm">Akses real-time</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-5xl md:text-6xl font-black" style={{ color: '#0C7E46' }}>∞</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Skalabilitas</h4>
                                        <p className="text-gray-600 text-sm">Berkembang sesuai kebutuhan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 8. CTA FINAL */}
                    <section className="py-20 md:py-32 relative overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(12, 126, 70, 0.5)' }}></div>
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent"></div>

                        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                                Transformasi Digital untuk Universitas
                            </h2>
                            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                                Optimalkan manajemen aset dengan sistem terintegrasi yang mudah digunakan dan akurat
                            </p>

                            {!auth.user && (
                                <Link href={route('login')}>
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-6 text-lg">
                                        Akses Sistem YAMS
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="relative overflow-hidden" style={{ backgroundColor: '#0C7E46' }}>
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        {/* Main Footer Content */}
                        <div className="py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Logo & Branding */}
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-white shadow-lg">
                                    <img src="/images/logo-yarsi.png" alt="YAMS Logo" className="h-10 w-10 object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight">YAMS</h3>
                                    <p className="text-white/70 text-sm">Yarsi Asset Management System</p>
                                </div>
                            </div>
                            
                            {/* Institution Info */}
                            <div className="text-center md:text-right">
                                <p className="text-white font-semibold text-lg">Universitas Yarsi</p>
                                <p className="text-white/70">Jakarta, Indonesia</p>
                            </div>
                        </div>
                        
                        {/* Bottom Bar */}
                        <div className="border-t border-white/20 py-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <p className="text-white/80 text-sm">
                                    &copy; 2026 YAMS. All rights reserved.
                                </p>
                                <p className="text-white/60 text-sm">
                                    Dikembangkan untuk Universitas Yarsi
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
