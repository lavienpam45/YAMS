import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// import { route } from 'ziggy-js'; // Uncomment jika perlu manual import

export default function Login({ status }: { status?: string }) {
    const { flash } = usePage().props as { flash?: { error?: string } };

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">

            {/* BAGIAN KIRI (Visual: Gambar Kampus) */}
            <div className="hidden lg:block relative h-full w-full overflow-hidden bg-muted">

                {/* 1. GAMBAR BACKGROUND + EFEK BLUR */}
                {/* Saya menambahkan class 'blur-[2px]' agar gambar terlihat halus/artistik */}
                {/* dan 'scale-105' untuk menghindari pinggiran putih akibat blur */}
                <img
                    src="/images/kampus-yarsi.jpg"
                    alt="Kampus Universitas Yarsi"
                    className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
                />

                {/* 2. OVERLAY GELAP YANG LEBIH PEKAT */}
                {/* Opacity dinaikkan ke 80% (bg-zinc-900/80) untuk menyamarkan detail yang pecah */}
                <div className="absolute inset-0 bg-zinc-900/80 mix-blend-multiply" />

                {/* 3. KONTEN TEKS (Tetap Tajam di Atas Blur) */}
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
                    <div className="flex items-center text-lg font-medium">
                        <ShieldCheck className="mr-2 h-6 w-6" />
                        YAMS (Yarsi Asset Management System)
                    </div>
                    <div className="space-y-4">
                        <blockquote className="space-y-2">
                            <p className="text-lg font-light leading-relaxed drop-shadow-md">
                                &ldquo;Sistem terintegrasi untuk pengelolaan aset kampus yang lebih transparan, akuntabel, dan efisien demi kemajuan pendidikan.&rdquo;
                            </p>
                            <footer className="text-sm font-semibold opacity-90">
                                — Universitas Yarsi
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* BAGIAN KANAN (Form Login) */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative" style={{
                backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.10) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(12, 126, 70, 0.08) 0%, transparent 50%)
                `
            }}>
                <Head title="Masuk" />

                {/* Tombol Kembali Mobile */}
                <div className="absolute left-4 top-4 lg:hidden">
                     <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Selamat Datang</h1>
                        <p className="text-balance text-muted-foreground">
                            Masuk ke akun YAMS Anda untuk melanjutkan
                        </p>
                    </div>

                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                                        Akses Ditolak
                                    </h3>
                                    <p className="text-sm text-red-700">
                                        {flash.error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status && (
                        <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@yarsi.ac.id"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href={route('password.request')}
                                    className="ml-auto inline-block text-sm underline decoration-slate-400 underline-offset-4 hover:text-primary"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', !!checked)}
                            />
                            <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Ingat saya di perangkat ini
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Masuk
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Belum punya akun?{" "}
                        <Link href={route('register')} className="underline decoration-slate-400 underline-offset-4 hover:text-primary">
                            Daftar sekarang
                        </Link>
                    </div>

                    {/* Tombol Kembali Desktop */}
                    <div className="hidden lg:block mt-2 text-center">
                         <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
