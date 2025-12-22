import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// import { route } from 'ziggy-js'; // Uncomment jika perlu

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // State terpisah untuk setiap kolom password agar bisa di-toggle satu per satu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">

            {/* BAGIAN KIRI (Visual: Gambar Kampus) */}
            <div className="hidden lg:block relative h-full w-full overflow-hidden bg-muted">
                <img
                    src="/images/kampus-yarsi.jpg"
                    alt="Kampus Universitas Yarsi"
                    className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
                />
                <div className="absolute inset-0 bg-zinc-900/80 mix-blend-multiply" />

                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center text-lg font-medium">
                        <ShieldCheck className="mr-2 h-6 w-6" />
                        YAMS (Yarsi Asset Management System)
                    </div>
                    <div className="space-y-4">
                        <blockquote className="space-y-2">
                            <p className="text-lg font-light leading-relaxed drop-shadow-md">
                                &ldquo;Bergabunglah dengan sistem manajemen aset modern untuk mendukung transparansi dan akuntabilitas kampus.&rdquo;
                            </p>
                            <footer className="text-sm font-semibold opacity-90">
                                — Universitas Yarsi
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* BAGIAN KANAN (Form Register) */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative" style={{
                backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.10) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.08) 0%, transparent 50%)
                `
            }}>
                <Head title="Daftar Akun" />

                <div className="absolute left-4 top-4 lg:hidden">
                     <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </div>

                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
                        <p className="text-balance text-muted-foreground">
                            Isi data diri Anda untuk mendaftar
                        </p>
                    </div>

                    <form onSubmit={submit} className="grid gap-4">
                        {/* Nama Lengkap */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                className={errors.name ? 'border-red-500' : ''}
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@yarsi.ac.id"
                                name="email"
                                value={data.email}
                                className={errors.email ? 'border-red-500' : ''}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password Utama */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                                    tabIndex={-1} // Agar tidak bisa difokuskan dengan tab (opsional, untuk UX)
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Konfirmasi Password (DENGAN TOMBOL MATA) */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'} // Menggunakan state terpisah
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className={errors.password_confirmation ? 'border-red-500 pr-10' : 'pr-10'}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar
                        </Button>
                    </form>

                    <div className="mt-2 text-center text-sm">
                        Sudah punya akun?{" "}
                        <Link href={route('login')} className="underline decoration-slate-400 underline-offset-4 hover:text-primary">
                            Masuk di sini
                        </Link>
                    </div>

                    <div className="hidden lg:block mt-2 text-center">
                         <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-3 w-3" /> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
