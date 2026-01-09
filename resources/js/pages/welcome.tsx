import LandingNavbar from '@/components/landing-navbar';
import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calculator, ChevronDown, Lock, MapPin, ShieldCheck, TrendingUp, Users } from 'lucide-react';
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
            answer: 'YAMS adalah Yarsi Asset Management System, platform digital terintegrasi untuk mengelola aset universitas. Sistem ini menghitung penyusutan otomatis, melacak lokasi aset real-time, dan menghasilkan laporan akurat untuk kebutuhan audit dan pelaporan keuangan.'
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
                                    Platform terpadu untuk mengelola aset kampus Universitas Yarsi dengan perhitungan penyusutan otomatis, pelacakan real-time, dan laporan akurat—semua dalam satu sistem yang mudah digunakan.
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
                                    Fitur yang <span style={{ color: '#0C7E46' }}>Mengubah Permainan</span>
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
                                            <Calculator className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Penyusutan Otomatis</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Smart Calculation</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Algoritma canggih menghitung penurunan nilai aset secara real-time menggunakan rumus akuntansi yang dapat disesuaikan.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Presisi 99.9%</span>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <MapPin className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Pelacakan Real-time</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Live Tracking</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pantau lokasi setiap aset, penanggung jawab, dan kondisi fisik secara langsung. Update instan di setiap perubahan.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Update 24/7</span>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <TrendingUp className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Laporan Cerdas</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Advanced Analytics</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Generate laporan profesional dalam PDF atau Excel dengan visualisasi data yang mudah dipahami untuk stakeholder.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Multi-format Export</span>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="group p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: '#0C7E46' }}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(12, 126, 70, 0.1)' }}>
                                            <Lock className="h-6 w-6" style={{ color: '#0C7E46' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Keamanan Enterprise</h3>
                                            <p className="text-sm font-semibold mt-1" style={{ color: '#0C7E46' }}>Military-grade Security</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        Akses terenkripsi dengan kontrol keamanan berlapis, audit trail lengkap, dan two-factor authentication untuk perlindungan maksimal.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span style={{ color: '#0C7E46' }} className="text-sm font-semibold">→ Sistem Keamanan Terpercaya</span>
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

                    {/* 5. SECURITY & COMPLIANCE */}
                    <section id="security" className="py-20 md:py-32 bg-gradient-to-b from-white to-emerald-50 relative" style={{
                        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(12, 126, 70, 0.06) 0%, transparent 60%)`
                    }}>
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="max-w-3xl">
                                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                                    Dipercaya oleh<br />
                                    <span style={{ color: '#0C7E46' }}>Universitas Yarsi</span>
                                </h2>
                                <p className="text-xl text-gray-700 mb-8">
                                    YAMS dirancang khusus untuk memenuhi kebutuhan manajemen aset universitas modern dengan standar keamanan internasional.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex gap-4">
                                        <ShieldCheck className="h-6 w-6 flex-shrink-0" style={{ color: '#0C7E46' }} />
                                        <div>
                                            <h4 className="font-bold mb-2 text-gray-900">Enkripsi End-to-End</h4>
                                            <p className="text-gray-700 text-sm">Semua data terenkripsi dan tersimpan aman</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Users className="h-6 w-6 flex-shrink-0" style={{ color: '#0C7E46' }} />
                                        <div>
                                            <h4 className="font-bold mb-2 text-gray-900">Keamanan Data</h4>
                                            <p className="text-gray-700 text-sm">Akses terkontrol per departemen dengan audit trail lengkap</p>
                                        </div>
                                    </div>
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

                            {/* CTA dalam FAQ */}
                            <div className="mt-16 text-center">
                                <p className="text-gray-700 mb-6">Masih ada pertanyaan lain?</p>
                                <a href="mailto:support@yarsi.ac.id" className="inline-flex items-center gap-2 text-lg font-bold" style={{ color: '#0C7E46' }}>
                                    Hubungi Tim Support
                                    <span>→</span>
                                </a>
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
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">Monitoring</h4>
                                        <p className="text-gray-600 text-sm">Real-time access</p>
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
                        <div className="absolute inset-0" style={{ backgroundColor: '#0C7E46' }}></div>
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

                {/* 9. CONTACT SECTION */}
                <section id="contact" className="py-20 md:py-32 bg-white relative" style={{
                    backgroundImage: `
                        radial-gradient(circle at 30% 60%, rgba(12, 126, 70, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 80% 40%, rgba(16, 185, 129, 0.10) 0%, transparent 50%)
                    `
                }}>
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-block px-4 py-2 rounded-full border-2 mb-6" style={{ borderColor: '#0C7E46', backgroundColor: 'rgba(12, 126, 70, 0.08)' }}>
                                <span className="text-sm font-semibold" style={{ color: '#0C7E46' }}>HUBUNGI KAMI</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
                                Butuh Informasi<br />
                                <span style={{ color: '#0C7E46' }}>Lebih Lanjut?</span>
                            </h2>
                            <p className="text-xl text-gray-700 mb-12">
                                Tim support kami siap membantu implementasi YAMS di institusi Anda
                            </p>

                            {/* Contact Info Cards */}
                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                <div className="p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all" style={{ borderColor: '#0C7E46' }}>
                                    <div className="text-4xl mb-4">📧</div>
                                    <h3 className="font-bold text-xl mb-2 text-gray-900">Email</h3>
                                    <a href="mailto:support@yarsi.ac.id" className="text-gray-700 hover:text-green-700 transition text-lg font-semibold">
                                        support@yarsi.ac.id
                                    </a>
                                </div>
                                <div className="p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all" style={{ borderColor: '#0C7E46' }}>
                                    <div className="text-4xl mb-4">📍</div>
                                    <h3 className="font-bold text-xl mb-2 text-gray-900">Lokasi</h3>
                                    <p className="text-gray-700 text-lg">
                                        Universitas Yarsi<br />Jakarta, Indonesia
                                    </p>
                                </div>
                                <div className="p-8 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all" style={{ borderColor: '#0C7E46' }}>
                                    <div className="text-4xl mb-4">⏰</div>
                                    <h3 className="font-bold text-xl mb-2 text-gray-900">Jam Layanan</h3>
                                    <p className="text-gray-700 text-lg">
                                        Senin - Jumat<br />09:00 - 17:00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. FOOTER */}
                <footer className="py-12 bg-gradient-to-b from-emerald-50 to-emerald-100 border-t" style={{ borderColor: '#0C7E46' }}>
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid md:grid-cols-3 gap-12 mb-8">
                            <div>
                                <h3 className="font-black text-2xl mb-2" style={{ color: '#0C7E46' }}>YAMS</h3>
                                <p className="text-gray-700">Solusi manajemen aset untuk era digital</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4 text-gray-900">Kontak</h4>
                                <a href="mailto:support@yarsi.ac.id" className="text-gray-700 hover:text-green-700 transition font-semibold">
                                    📧 support@yarsi.ac.id
                                </a>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4 text-gray-900">Institusi</h4>
                                <p className="text-gray-700">Universitas Yarsi<br />Jakarta, Indonesia</p>
                            </div>
                        </div>
                        <div className="border-t border-green-200 pt-8 text-center text-gray-600 text-sm">
                            <p>&copy; 2025 YAMS. All rights reserved. Dikembangkan untuk Universitas Yarsi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
