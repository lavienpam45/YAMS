import { useState } from 'react';
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
    });

    // 2. Perbaiki State agar menerima number atau string (untuk pesan error)
    const [calcValues, setCalcValues] = useState({ price: 10000000, salvage: 1000000, life: 5, age: 1 });
    const [calcResult, setCalcResult] = useState<number | string>(0);
    const [previewExpression, setPreviewExpression] = useState('');

    // 3. Berikan tipe data 'string' pada parameter expr
    const calculatePreview = (expr: string) => {
        if (!expr) return;

        // Ganti variabel dengan nilai angka
        let parsed = expr
            .replaceAll('{price}', String(calcValues.price))
            .replaceAll('{salvage}', String(calcValues.salvage))
            .replaceAll('{life}', String(calcValues.life))
            .replaceAll('{age}', String(calcValues.age));

        try {
            // Catatan: eval() berisiko, pastikan input tervalidasi di backend juga.
            // Gunakan Function constructor sebagai alternatif sedikit lebih aman atau library mathjs.
            // @ts-ignore: Mengabaikan warning eval untuk simulasi UI
            const result = eval(parsed);
            setCalcResult(result);
        } catch (e) {
            setCalcResult('Error dalam rumus');
        }
    };

    return (
        // 4. Perbaiki Props AppLayout: Hapus 'breadcrumbs', pastikan ada 'title'
        <AppLayout title="Manajemen Rumus">
            <Head title="Manajemen Rumus" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* BAGIAN KIRI: DAFTAR RUMUS */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Rumus Penyusutan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 5. Berikan tipe (formula: Formula) pada map */}
                            {formulas.map((formula: Formula) => (
                                <div key={formula.id} className={`p-4 border rounded-lg flex justify-between items-center ${formula.is_active ? 'border-[#7ACAB0] bg-[#e6f4ef]' : ''}`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">{formula.name}</h3>
                                            {formula.is_active && <Badge>Aktif</Badge>}
                                        </div>
                                        <code className="text-sm bg-gray-100 p-1 rounded mt-1 block w-fit">
                                            {formula.expression}
                                        </code>
                                    </div>
                                    <div className="flex gap-2">
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
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Buat Rumus Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => { e.preventDefault(); post(route('formulas.store'), { onSuccess: () => reset() }); }}>
                                <div className="space-y-3">
                                    <div>
                                        <Label>Nama Rumus</Label>
                                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Contoh: Garis Lurus" />
                                    </div>
                                    <div>
                                        <Label>Ekspresi Matematika</Label>
                                        <Input
                                            value={data.expression}
                                            onChange={e => { setData('expression', e.target.value); setPreviewExpression(e.target.value); }}
                                            placeholder="Contoh: ({price} - {salvage}) / {life}"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Gunakan variabel: {Object.keys(variables).join(', ')}
                                        </p>
                                    </div>
                                    <Button type="submit">Simpan Rumus</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* BAGIAN KANAN: KALKULATOR / SIMULASI */}
                <div>
                    <Card className="sticky top-6 border-2 border-[#7ACAB0]/40">
                        <CardHeader className="bg-[#e6f4ef]">
                            <CardTitle className="flex items-center gap-2">
                                🧮 Kalkulator Simulasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Masukkan angka di bawah ini untuk menguji rumus.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Harga Beli (Price)</Label>
                                    {/* 6. Perbaiki Type Mismatch pada Input (String -> Number) */}
                                    <Input
                                        type="number"
                                        value={calcValues.price}
                                        onChange={e => setCalcValues({...calcValues, price: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <Label>Nilai Sisa (Salvage)</Label>
                                    <Input
                                        type="number"
                                        value={calcValues.salvage}
                                        onChange={e => setCalcValues({...calcValues, salvage: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Manfaat (Life)</Label>
                                    <Input
                                        type="number"
                                        value={calcValues.life}
                                        onChange={e => setCalcValues({...calcValues, life: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Aset (Age)</Label>
                                    <Input
                                        type="number"
                                        value={calcValues.age}
                                        onChange={e => setCalcValues({...calcValues, age: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                                <Label className="block text-gray-500 mb-1">Hasil Perhitungan (Depresiasi Tahunan)</Label>
                                <div className="text-3xl font-bold text-[#7ACAB0]">
                                    {typeof calcResult === 'number'
                                        ? `Rp ${calcResult.toLocaleString('id-ID')}`
                                        : calcResult}
                                </div>
                            </div>

                            <Button
                                className="w-full mt-2"
                                variant="secondary"
                                // 7. Perbaiki pencarian rumus aktif dengan tipe data yang benar
                                onClick={() => calculatePreview(data.expression || (formulas.find((f: Formula) => f.is_active)?.expression || ''))}
                            >
                                Hitung Sekarang
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
