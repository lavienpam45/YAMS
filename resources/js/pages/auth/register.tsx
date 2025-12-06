import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Import Label dari shadcn
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

// import { route } from 'ziggy-js'; // Uncomment jika perlu

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">

            {/* BAGIAN KIRI (Visual) */}
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
                                &ldquo;Keamanan data aset Anda adalah prioritas utama kami. Pulihkan akses akun Anda dengan mudah dan aman.&rdquo;
                            </p>
                            <footer className="text-sm font-semibold opacity-90">
                                — Tim IT Universitas Yarsi
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* BAGIAN KANAN (Form Reset) */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <Head title="Lupa Password" />

                <div className="absolute left-4 top-4 lg:hidden">
                     <Link href={route('login')} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </div>

                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Lupa Password?</h1>
                        <p className="text-balance text-muted-foreground">
                            Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan link reset password.
                        </p>
                    </div>

                    {status && (
                        <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Terdaftar</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={errors.email ? 'border-red-500' : ''}
                                placeholder="nama@yarsi.ac.id"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-2" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kirim Link Reset
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Ingat password Anda?{" "}
                        <Link href={route('login')} className="underline decoration-slate-400 underline-offset-4 hover:text-primary">
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
