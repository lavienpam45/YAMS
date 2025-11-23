import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';

// Import yang kita butuhkan untuk link
import TextLink from '@/components/text-link';
import { register } from '@/routes';

export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Head title="Log in" />
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-center text-gray-800">YAMS</h2>
                 <h3 className="text-xl font-semibold text-center text-gray-700">Login ke Akun Anda</h3>
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
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
                                        autoComplete="current-password"
                                        placeholder="********"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    disabled={processing}
                                    style={{ backgroundColor: '#4f46e5' }}
                                >
                                    {processing && <Spinner />}
                                    Login
                                </Button>
                            </div>

                             {/* === BLOK YANG DITAMBAHKAN === */}
                            <div className="text-center text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <TextLink href={register()}>
                                    Daftar disini!
                                </TextLink>
                            </div>
                             {/* ============================= */}
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
