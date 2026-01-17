import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// 1. Definisikan Interface untuk Tipe Data
interface Formula {
    id: number;
    name: string;
    expression: string;
    is_active: boolean;
    type: 'depreciation' | 'appreciation';
    description?: string;
}

interface FormulaPageProps {
    formulas: Formula[];
    variables: Record<string, string>;
}

export default function FormulaIndex({ formulas, variables }: FormulaPageProps) {
    const { data, setData, post, reset } = useForm({
        name: '',
        expression: '',
        description: '',
        type: 'depreciation' as 'depreciation' | 'appreciation',
    });

    const depreciationFormulas = formulas.filter(f => f.type === 'depreciation');
    const appreciationFormulas = formulas.filter(f => f.type === 'appreciation');

    // Kalkulator dipindah ke halaman khusus

    return (
        // 4. Perbaiki Props AppLayout: Hapus 'breadcrumbs', pastikan ada 'title'
        <AppLayout title="Manajemen Rumus">
            <Head title="Manajemen Rumus" />

            <div className="space-y-6">
                {/* BAGIAN ATAS: DAFTAR RUMUS DALAM 2 KOLOM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KOLOM KIRI: Rumus Penyusutan */}
                    <Card>
                        <CardHeader className="bg-red-50">
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-red-600">📉</span> Rumus Penyusutan
                            </CardTitle>
                            <p className="text-sm text-gray-600">Untuk aset selain tanah dan bangunan</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {depreciationFormulas.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Belum ada rumus penyusutan</p>
                            ) : (
                                depreciationFormulas.map((formula: Formula) => (
                                    <div key={formula.id} className={`p-4 border rounded-lg ${formula.is_active ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{formula.name}</h3>
                                                    {formula.is_active && <Badge className="bg-red-500">Aktif</Badge>}
                                                </div>
                                                <code className="text-sm bg-gray-100 p-1 rounded mt-1 block w-fit">
                                                    {formula.expression}
                                                </code>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {!formula.is_active && (
                                                <Button size="sm" variant="outline" onClick={() => router.post(route('formulas.activate', formula.id))}>
                                                    Gunakan
                                                </Button>
                                            )}
                                            <Button size="sm" variant="destructive" onClick={() => router.delete(route('formulas.destroy', formula.id))}>
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* KOLOM KANAN: Rumus Apresiasi */}
                    <Card>
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-green-600">📈</span> Rumus Apresiasi
                            </CardTitle>
                            <p className="text-sm text-gray-600">Untuk aset tanah dan bangunan</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {appreciationFormulas.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Belum ada rumus apresiasi</p>
                            ) : (
                                appreciationFormulas.map((formula: Formula) => (
                                    <div key={formula.id} className={`p-4 border rounded-lg ${formula.is_active ? 'border-[#7ACAB0] bg-[#e6f4ef]' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{formula.name}</h3>
                                                    {formula.is_active && <Badge className="bg-[#7ACAB0]">Aktif</Badge>}
                                                </div>
                                                <code className="text-sm bg-gray-100 p-1 rounded mt-1 block w-fit">
                                                    {formula.expression}
                                                </code>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {!formula.is_active && (
                                                <Button size="sm" variant="outline" onClick={() => router.post(route('formulas.activate', formula.id))}>
                                                    Gunakan
                                                </Button>
                                            )}
                                            <Button size="sm" variant="destructive" onClick={() => router.delete(route('formulas.destroy', formula.id))}>
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* BAGIAN BAWAH: FORM BUAT RUMUS */}
                <div>
                    <Card>
                        <CardHeader><CardTitle>Buat Rumus Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); post(route('formulas.store'), { onSuccess: () => reset() }); }}>
                                <div className="space-y-3">
                                    <div>
                                        <Label>Tipe Rumus</Label>
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value as 'depreciation' | 'appreciation')}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                        >
                                            <option value="depreciation">Penyusutan</option>
                                            <option value="appreciation">Apresiasi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Nama Rumus</Label>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Garis Lurus" />
                                    </div>
                                    <div>
                                        <Label>Ekspresi Matematika</Label>
                                        <Input
                                            value={data.expression}
                                            onChange={e => setData('expression', e.target.value)}
                                            placeholder="Contoh: ({price} - {salvage}) / {life}"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Gunakan variabel: {Object.keys(variables).join(', ')}
                                        </p>
                                    </div>
                                    <Button type="submit" className="w-full">Simpan Rumus</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
