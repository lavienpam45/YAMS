import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store as registerStore } from '@/routes/register'; // Menggunakan alias agar tidak bentrok
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Head title="Daftar" />
            <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                    YAMS
                </h2>
                <h3 className="text-center text-xl font-semibold text-gray-700">
                    Buat Akun Baru
                </h3>
                <Form
                    {...registerStore.form()} // Menggunakan 'store' yang diimpor dari rute register
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoFocus
                                        autoComplete="name"
                                        placeholder="Nama Lengkap Anda"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="anda@perusahaan.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={processing}
                                style={{ backgroundColor: '#4f46e5' }}
                            >
                                {processing && <Spinner />}
                                Daftar
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <TextLink href={login()}>
                                    Login disini!
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
