import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

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

    const [showGuide, setShowGuide] = useState(false);

    const depreciationFormulas = formulas.filter(f => f.type === 'depreciation');
    const appreciationFormulas = formulas.filter(f => f.type === 'appreciation');

    // Kalkulator dipindah ke halaman khusus

    return (
        // 4. Perbaiki Props AppLayout: Hapus 'breadcrumbs', pastikan ada 'title'
        <AppLayout title="Manajemen Rumus">
            <Head title="Manajemen Rumus" />

            <div className="space-y-6">
                {/* PANDUAN PENGGUNAAN */}
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader
                        className="cursor-pointer hover:bg-blue-100/50 transition-colors"
                        onClick={() => setShowGuide(!showGuide)}
                    >
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-700">
                                <InformationCircleIcon className="h-5 w-5" />
                                <span>📖 Panduan Penggunaan Rumus</span>
                            </div>
                            {showGuide ? (
                                <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                            )}
                        </CardTitle>
                    </CardHeader>
                    {showGuide && (
                        <CardContent className="space-y-6 pt-0">
                            {/* Variabel yang Tersedia */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">🔤 Variabel yang Tersedia</h3>
                                <div className="bg-white rounded-lg p-4 border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 font-medium">Variabel</th>
                                                <th className="text-left py-2 font-medium">Keterangan</th>
                                                <th className="text-left py-2 font-medium">Contoh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">{'{price}'}</code></td>
                                                <td className="py-2">Harga Beli aset</td>
                                                <td className="py-2 text-gray-600">10.000.000</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">{'{salvage}'}</code></td>
                                                <td className="py-2">Nilai Sisa (residu)</td>
                                                <td className="py-2 text-gray-600">1.000.000</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">{'{life}'}</code></td>
                                                <td className="py-2">Umur Manfaat (tahun)</td>
                                                <td className="py-2 text-gray-600">5</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2"><code className="bg-gray-100 px-2 py-0.5 rounded">{'{age}'}</code></td>
                                                <td className="py-2">Umur Aset saat ini (tahun)</td>
                                                <td className="py-2 text-gray-600">2</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Contoh Rumus */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">📉 Contoh Rumus Penyusutan</h3>
                                    <div className="bg-white rounded-lg p-4 border space-y-3">
                                        <div>
                                            <p className="font-medium text-sm">Garis Lurus (Straight Line)</p>
                                            <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">
                                                ({'{price}'} - {'{salvage}'}) / {'{life}'}
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">Penyusutan sama rata setiap tahun</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Saldo Menurun 20%</p>
                                            <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">
                                                {'{price}'} * 0.2
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">20% dari harga beli per tahun</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Saldo Menurun Ganda</p>
                                            <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded block mt-1">
                                                ({'{price}'} - {'{salvage}'}) * 2 / {'{life}'}
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">Penyusutan dipercepat 2x</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">📈 Contoh Rumus Apresiasi</h3>
                                    <div className="bg-white rounded-lg p-4 border space-y-3">
                                        <div>
                                            <p className="font-medium text-sm">Kenaikan 5% per Tahun</p>
                                            <code className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded block mt-1">
                                                {'{price}'} * 0.05
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">Nilai naik 5% dari harga beli per tahun</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Kenaikan Progresif</p>
                                            <code className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded block mt-1">
                                                {'{price}'} * 0.03 * {'{age}'}
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">Semakin tua, semakin besar kenaikan</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Kenaikan Tetap</p>
                                            <code className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded block mt-1">
                                                50000000
                                            </code>
                                            <p className="text-xs text-gray-500 mt-1">Naik Rp 50 juta per tahun</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Penting */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h3 className="font-semibold text-amber-800 mb-2">⚠️ Informasi Penting</h3>
                                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                                    <li>Hanya <strong>1 rumus aktif</strong> untuk setiap tipe (penyusutan/apresiasi)</li>
                                    <li>Mengaktifkan rumus baru akan <strong>menghitung ulang semua aset</strong> terkait</li>
                                    <li>Aset dengan <strong>Custom Rate</strong> tidak terpengaruh oleh rumus global</li>
                                    <li>Gunakan operator: <code className="bg-amber-100 px-1 rounded">+</code> <code className="bg-amber-100 px-1 rounded">-</code> <code className="bg-amber-100 px-1 rounded">*</code> <code className="bg-amber-100 px-1 rounded">/</code> <code className="bg-amber-100 px-1 rounded">( )</code></li>
                                    <li>Variabel harus ditulis <strong>persis</strong> seperti contoh (dengan kurung kurawal)</li>
                                </ul>
                            </div>
                        </CardContent>
                    )}
                </Card>

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
