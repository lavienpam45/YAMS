import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Formula {
    id: number;
    name: string;
    expression: string;
    is_active: boolean;
    type: 'depreciation' | 'appreciation';
    description?: string;
}

interface CalculatorProps {
    formulas: Formula[];
    variables: Record<string, string>;
}

const evaluateExpression = (
    expression: string,
    values: { price: number; salvage: number; life: number; age: number }
): number | string => {
    if (!expression) return 'Belum ada rumus aktif';

    const parsed = expression
        .replaceAll('{price}', String(values.price))
        .replaceAll('{salvage}', String(values.salvage))
        .replaceAll('{life}', String(values.life))
        .replaceAll('{age}', String(values.age));

    try {
        // @ts-ignore eval needed untuk simulasi cepat; input sudah dibatasi admin
        const result = eval(parsed);
        return typeof result === 'number' ? result : 'Rumus tidak menghasilkan angka';
    } catch (e) {
        return 'Error dalam rumus';
    }
};

export default function CalculatorIndex({ formulas, variables }: CalculatorProps) {
    const depreciationFormulas = useMemo(
        () => formulas.filter((f) => f.type === 'depreciation'),
        [formulas]
    );
    const appreciationFormulas = useMemo(
        () => formulas.filter((f) => f.type === 'appreciation'),
        [formulas]
    );

    const [selectedDepId, setSelectedDepId] = useState<number | null>(
        depreciationFormulas.find((f) => f.is_active)?.id ?? depreciationFormulas[0]?.id ?? null
    );
    const [selectedAppId, setSelectedAppId] = useState<number | null>(
        appreciationFormulas.find((f) => f.is_active)?.id ?? appreciationFormulas[0]?.id ?? null
    );

    const [depValues, setDepValues] = useState({ price: 10000000, salvage: 1000000, life: 5, age: 1 });
    const [appValues, setAppValues] = useState({ price: 10000000, salvage: 1000000, life: 5, age: 1 });

    const [depResult, setDepResult] = useState<number | string>(0);
    const [appResult, setAppResult] = useState<number | string>(0);

    const selectedDepFormula = useMemo(
        () => depreciationFormulas.find((f) => f.id === selectedDepId) || null,
        [depreciationFormulas, selectedDepId]
    );
    const selectedAppFormula = useMemo(
        () => appreciationFormulas.find((f) => f.id === selectedAppId) || null,
        [appreciationFormulas, selectedAppId]
    );

    const handleCalculateDep = () => {
        setDepResult(evaluateExpression(selectedDepFormula?.expression || '', depValues));
    };

    const handleCalculateApp = () => {
        setAppResult(evaluateExpression(selectedAppFormula?.expression || '', appValues));
    };

    const VariableHelper = () => (
        <p className="text-xs text-gray-500 mt-1">Gunakan variabel: {Object.keys(variables).join(', ')}</p>
    );

    return (
        <AppLayout title="Kalkulator Aset">
            <Head title="Kalkulator Aset" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kalkulator Penyusutan */}
                    <Card className="border border-red-200">
                        <CardHeader className="bg-red-50">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-red-700">📉 Kalkulator Penyusutan</span>
                                {selectedDepFormula?.is_active && <Badge className="bg-red-500">Aktif</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Pilih Rumus</Label>
                                <select
                                    value={selectedDepId ?? ''}
                                    onChange={(e) => setSelectedDepId(Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                >
                                    {depreciationFormulas.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name} {f.is_active ? '(Aktif)' : ''}
                                        </option>
                                    ))}
                                    {depreciationFormulas.length === 0 && <option>Tidak ada rumus</option>}
                                </select>
                                {selectedDepFormula && (
                                    <code className="text-sm bg-gray-100 p-2 rounded block w-fit">
                                        {selectedDepFormula.expression}
                                    </code>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Harga Beli (price)</Label>
                                    <Input
                                        type="number"
                                        value={depValues.price}
                                        onChange={(e) => setDepValues({ ...depValues, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Nilai Sisa (salvage)</Label>
                                    <Input
                                        type="number"
                                        value={depValues.salvage}
                                        onChange={(e) => setDepValues({ ...depValues, salvage: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Manfaat (life)</Label>
                                    <Input
                                        type="number"
                                        value={depValues.life}
                                        onChange={(e) => setDepValues({ ...depValues, life: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Aset (age)</Label>
                                    <Input
                                        type="number"
                                        value={depValues.age}
                                        onChange={(e) => setDepValues({ ...depValues, age: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <VariableHelper />

                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                                <Label className="block text-gray-600 mb-1">Hasil Perhitungan (Depresiasi Tahunan)</Label>
                                <div className="text-3xl font-bold text-red-600">
                                    {typeof depResult === 'number' ? `Rp ${depResult.toLocaleString('id-ID')}` : depResult}
                                </div>
                            </div>

                            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleCalculateDep} disabled={!selectedDepFormula}>
                                Hitung Penyusutan
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Kalkulator Apresiasi */}
                    <Card className="border border-green-200">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-green-700">📈 Kalkulator Apresiasi</span>
                                {selectedAppFormula?.is_active && <Badge className="bg-[#7ACAB0]">Aktif</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Pilih Rumus</Label>
                                <select
                                    value={selectedAppId ?? ''}
                                    onChange={(e) => setSelectedAppId(Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#7ACAB0] focus:ring-[#7ACAB0] sm:text-sm"
                                >
                                    {appreciationFormulas.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name} {f.is_active ? '(Aktif)' : ''}
                                        </option>
                                    ))}
                                    {appreciationFormulas.length === 0 && <option>Tidak ada rumus</option>}
                                </select>
                                {selectedAppFormula && (
                                    <code className="text-sm bg-gray-100 p-2 rounded block w-fit">
                                        {selectedAppFormula.expression}
                                    </code>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Harga Beli (price)</Label>
                                    <Input
                                        type="number"
                                        value={appValues.price}
                                        onChange={(e) => setAppValues({ ...appValues, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Nilai Sisa (salvage)</Label>
                                    <Input
                                        type="number"
                                        value={appValues.salvage}
                                        onChange={(e) => setAppValues({ ...appValues, salvage: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Manfaat (life)</Label>
                                    <Input
                                        type="number"
                                        value={appValues.life}
                                        onChange={(e) => setAppValues({ ...appValues, life: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Umur Aset (age)</Label>
                                    <Input
                                        type="number"
                                        value={appValues.age}
                                        onChange={(e) => setAppValues({ ...appValues, age: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <VariableHelper />

                            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                                <Label className="block text-gray-600 mb-1">Hasil Perhitungan (Apresiasi Tahunan)</Label>
                                <div className="text-3xl font-bold text-green-600">
                                    {typeof appResult === 'number' ? `Rp ${appResult.toLocaleString('id-ID')}` : appResult}
                                </div>
                            </div>

                            <Button className="w-full bg-[#7ACAB0] hover:bg-[#5FA18C]" onClick={handleCalculateApp} disabled={!selectedAppFormula}>
                                Hitung Apresiasi
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
