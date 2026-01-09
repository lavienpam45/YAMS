<?php

namespace App\Http\Controllers;

use App\Imports\AssetsImport;
use App\Models\Asset;
use App\Models\ActivityLog;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage; // Pastikan Storage di-import

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $assetsQuery = Asset::query();

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $assetsQuery->where(function ($query) use ($searchTerm) {
                $query->where('name', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('asset_code', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('serial_number', 'LIKE', "%{$searchTerm}%");
            });
        }

        if ($request->input('sort') === 'type') {
            $direction = $request->input('direction', 'asc');
            $assetsQuery->orderBy('type', $direction === 'desc' ? 'desc' : 'asc');
        } else {
            $assetsQuery->latest();
        }

        $assets = $assetsQuery->paginate(10)->withQueryString();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => $request->only(['search', 'sort', 'direction'])
        ]);
    }

    public function create(): Response
    {
        $nextAssetCode = $this->nextSequentialCode('asset_code', 'AKT');
        $nextUnitCode = $this->nextSequentialCode('unit_code', 'SAT');

        return Inertia::render('Assets/Create', [
            'nextAssetCode' => $nextAssetCode,
            'nextUnitCode' => $nextUnitCode,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Validasi semua field termasuk 'photo'
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'room_name' => 'nullable|string|max:255',
            'asset_code' => 'nullable|string|max:255', // Tidak perlu unique validation karena akan auto-generate
            'unit_code' => 'nullable|string|max:255',
            'received_date' => 'nullable|date',
            'purchase_price' => 'required|numeric|min:0',
            'useful_life' => 'required|integer|min:1',
            'salvage_value' => 'required|numeric|min:0',
            'type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_assigned' => 'nullable|string|max:255',
            'inventory_status' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048', // Max 2MB
        ]);

        // SELALU generate kode baru secara otomatis (ignore input dari form)
        $validatedData['asset_code'] = $this->nextSequentialCode('asset_code', 'AKT');
        $validatedData['unit_code'] = $this->nextSequentialCode('unit_code', 'SAT');

        // **PENTING: Hitung current_book_value saat create berdasarkan umur aset**
        $currentBookValue = $validatedData['purchase_price'];
        $lastDepreciationDate = null;
        $notificationMessage = null;

        if (!empty($validatedData['received_date'])) {
            $receivedDate = Carbon::parse($validatedData['received_date'])->startOfDay();
            $today = now()->startOfDay();
            $ageYears = $this->calculateAgeInYears($receivedDate, $today); // Gunakan metode pro-rata

            // Jika aset sudah lebih dari 0 tahun (1 hari atau lebih), hitung nilai sekarang
            if ($ageYears > 0) {
                // Tentukan tipe aset (appreciating atau depreciating)
                $type = strtolower($validatedData['type'] ?? '');
                $isAppreciating = str_contains($type, 'tanah') || str_contains($type, 'bangunan');

                // Ambil rumus aktif
                $formula = $isAppreciating
                    ? DepreciationFormula::getActiveAppreciationFormula()
                    : DepreciationFormula::getActiveDepreciationFormula();

                if ($formula) {
                    // Evaluasi formula dengan variabel
                    $annualChange = $this->evaluateExpression($formula->expression, [
                        '{price}' => $validatedData['purchase_price'] ?: 0,
                        '{salvage}' => $validatedData['salvage_value'] ?: 0,
                        '{life}' => max(1, $validatedData['useful_life']),
                        '{age}' => $ageYears,
                    ]);

                    if ($annualChange !== null) {
                        $delta = abs($annualChange);

                        if ($isAppreciating) {
                            $currentBookValue = $validatedData['purchase_price'] + $delta;
                        } else {
                            $floor = $validatedData['salvage_value'] ?? 0;
                            $currentBookValue = max($floor, $validatedData['purchase_price'] - $delta);
                        }

                        $currentBookValue = round($currentBookValue, 2);
                        // PENTING: Set last_depreciation_date ke NULL agar scheduler bisa proses
                        // di anniversary date (received_date + 1 year, 2 years, etc.)
                        $lastDepreciationDate = null;

                        // Siapkan message notifikasi
                        $notificationMessage = "Nilai aset '{$validatedData['name']}' telah dihitung berdasarkan umur " . round($ageYears, 2) . " tahun. Nilai saat ini: " . number_format($currentBookValue, 0, ',', '.');
                    }
                }
            }
        }

        $validatedData['current_book_value'] = $currentBookValue;
        $validatedData['last_depreciation_date'] = $lastDepreciationDate;

        // Proses upload file jika ada
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('asset-photos', 'public');
            $validatedData['photo'] = $path;
        }

        $asset = Asset::create($validatedData);

        $this->logActivity('asset.created', $asset->id, $asset->name, $asset->asset_code, $asset->user_assigned, [
            'fields' => collect($validatedData)->all(),
        ]);

        // Kirim notifikasi ke admin
        if ($notificationMessage) {
            // Jika ada nilai yang dihitung, kirim notifikasi tentang perhitungan depresiasi
            NotificationService::notifyAdmins(
                'Aset Baru Ditambahkan dengan Perhitungan Depresiasi',
                $notificationMessage,
                'info',
                [
                    'asset_id' => $asset->id,
                    'asset_code' => $asset->asset_code,
                    'calculated_value' => $currentBookValue,
                ]
            );
        } else {
            // Notifikasi standar jika aset baru tanpa perhitungan depresiasi
            NotificationService::notifyAdmins(
                'Aset Baru Ditambahkan',
                "Aset '{$asset->name}' dengan kode {$asset->asset_code} telah ditambahkan ke sistem.",
                'success',
                ['asset_id' => $asset->id, 'asset_code' => $asset->asset_code]
            );
        }

        return redirect()->route('assets.index')->with('message', 'Aset berhasil ditambahkan.');
    }

    public function edit(Asset $asset): Response
    {
        return Inertia::render('Assets/Edit', [
            'asset' => $asset
        ]);
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'room_name' => 'nullable|string|max:255',
            'unit_code' => 'nullable|string|max:255',
            'received_date' => 'nullable|date',
            'purchase_price' => 'required|numeric|min:0',
            'useful_life' => 'required|integer|min:1',
            'salvage_value' => 'required|numeric|min:0',
            'type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_assigned' => 'nullable|string|max:255',
            'inventory_status' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048', // Validasi foto baru (jika ada)
        ]);

        $oldValues = $asset->only(array_keys($validatedData));
        $oldReceivedDate = $asset->received_date; // Simpan nilai asli sebelum update

        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($asset->photo) {
                Storage::disk('public')->delete($asset->photo);
            }
            // Simpan foto baru
            $path = $request->file('photo')->store('asset-photos', 'public');
            $validatedData['photo'] = $path;
        }

        $asset->update($validatedData);

        // Jika received_date berubah, reset last_depreciation_date agar depresiasi dihitung ulang
        if (isset($validatedData['received_date']) && $oldReceivedDate != $validatedData['received_date']) {
            $asset->forceFill(['last_depreciation_date' => null])->save();
        }

        // Maintenance untuk data lama yang belum memiliki current_book_value
        if (is_null($asset->current_book_value)) {
            $asset->forceFill(['current_book_value' => $asset->purchase_price])->save();
        }

        $changes = [];
        foreach (array_keys($validatedData) as $field) {
            if (isset($oldValues[$field]) && $oldValues[$field] !== $validatedData[$field]) {
                $changes[$field] = [
                    'old' => $oldValues[$field],
                    'new' => $validatedData[$field],
                ];
            }
        }

        $this->logActivity('asset.updated', $asset->id, $asset->name, $asset->asset_code, $asset->user_assigned, [
            'changes' => $this->formatChangesReadable($changes),
        ]);

        // Kirim notifikasi ke admin
        NotificationService::notifyAdmins(
            'Aset Diperbarui',
            "Aset '{$asset->name}' dengan kode {$asset->asset_code} telah diperbarui.",
            'info',
            ['asset_id' => $asset->id, 'asset_code' => $asset->asset_code]
        );

        return redirect()->route('assets.index')->with('message', 'Aset berhasil diperbarui.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        // Hapus file foto terkait jika ada
        if ($asset->photo) {
            Storage::disk('public')->delete($asset->photo);
        }

        $targetId = $asset->id;
        $targetName = $asset->name;
        $targetCode = $asset->asset_code;
        $targetUser = $asset->user_assigned;

        $asset->delete();

        $this->logActivity('asset.deleted', $targetId, $targetName, $targetCode, $targetUser, []);

        // Kirim notifikasi ke admin
        NotificationService::notifyAdmins(
            'Aset Dihapus',
            "Aset '{$targetName}' dengan kode {$targetCode} telah dihapus dari sistem.",
            'warning',
            ['asset_code' => $targetCode]
        );

        return redirect()->route('assets.index')->with('message', 'Aset berhasil dihapus.');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new AssetsImport, $request->file('file'));

        return redirect()->route('assets.index')->with('message', 'File berhasil diunggah! Data sedang diproses.');
    }

    public function show(Asset $asset): Response
    {
        $asset->load('depreciationHistories');
        return Inertia::render('Assets/Show', [
            'asset' => $asset
        ]);
    }

    private function logActivity(string $action, ?int $targetId, ?string $targetName, ?string $assetCode, ?string $assignedTo, array $metadata = []): void
    {
        ActivityLog::create([
            'actor_id' => Auth::id(),
            'action' => $action,
            'target_type' => 'asset',
            'target_id' => $targetId,
            'target_name' => $targetName,
            'metadata' => array_merge($metadata, [
                'asset_code' => $assetCode,
                'assigned_to' => $assignedTo,
            ]),
        ]);
    }

    private function formatChangesReadable(array $changes): array
    {
        $fieldLabels = [
            'room_name' => 'nama ruang',
            'name' => 'nama aset',
            'asset_code' => 'kode aset',
            'purchase_price' => 'harga aset',
            'quantity' => 'jumlah',
            'status' => 'kondisi',
            'type' => 'tipe',
            'brand' => 'merek',
            'serial_number' => 'nomor seri',
            'unit_code' => 'kode satuan',
            'received_date' => 'tanggal terima',
            'useful_life' => 'umur manfaat',
            'salvage_value' => 'nilai sisa',
            'description' => 'deskripsi',
            'user_assigned' => 'pengguna',
            'inventory_status' => 'status inventaris',
            'photo' => 'foto',
        ];

        // Date fields yang hanya perlu menampilkan tanggal saja (tanpa waktu)
        $dateFields = ['received_date'];

        $result = [];
        foreach ($changes as $field => $data) {
            $old = $data['old'];
            $new = $data['new'];

            // Skip jika nilai tidak benar-benar berubah (null handling)
            if ($old === $new || (is_null($old) && is_null($new))) {
                continue;
            }

            // Format tanggal hanya menampilkan bagian tanggal (tanpa waktu)
            if (in_array($field, $dateFields)) {
                if ($old) {
                    $old = \Carbon\Carbon::parse($old)->format('d-m-Y');
                }
                if ($new) {
                    $new = \Carbon\Carbon::parse($new)->format('d-m-Y');
                }
            }

            $label = $fieldLabels[$field] ?? $field;
            $result[$field] = "Merubah {$label} dari {$old} menjadi {$new}";
        }

        return $result;
    }

    /**
     * Generate kode sequential dengan prefix (misal: AKT-001, SAT-002)
     * 
     * @param string $column Nama kolom (asset_code atau unit_code)
     * @param string $prefix Prefix kode (AKT atau SAT)
     * @return string Kode dengan format PREFIX-XXX (misal: AKT-001)
     */
    private function nextSequentialCode(string $column, string $prefix = ''): string
    {
        // Ambil semua kode yang ada dengan prefix yang sama
        $allCodes = Asset::whereNotNull($column)
            ->where($column, 'LIKE', "{$prefix}%")
            ->pluck($column);
        
        // Ekstrak semua angka dari kode-kode yang ada
        $numbers = $allCodes->map(function ($code) {
            // Ekstrak semua angka dari string
            preg_match_all('/\d+/', (string)$code, $matches);
            return !empty($matches[0]) ? (int)end($matches[0]) : 0;
        });
        
        // Cari angka maksimum
        $maxNumber = $numbers->max() ?? 0;
        
        // Angka berikutnya
        $nextNumber = $maxNumber + 1;
        
        // Format dengan padding 3 digit minimum (001, 002, ..., 999, 1000, dst)
        $paddedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        
        // Return dengan format PREFIX-XXX
        return "{$prefix}-{$paddedNumber}";
    }

    /**
     * Evaluasi expression dengan variable replacement (helper method)
     */
    private function evaluateExpression(string $expression, array $variables): ?float
    {
        $built = str_replace(array_keys($variables), array_values($variables), $expression);

        try {
            return (float) eval("return {$built};");
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Hitung age dalam tahun dengan desimal (pro-rata)
     * Contoh: 0.5, 1.25, 2.75, dst
     */
    private function calculateAgeInYears(Carbon $receivedDate, Carbon $today): float
    {
        $diff = $receivedDate->diff($today);

        // Hitung total hari dari received_date sampai today
        $totalDays = $receivedDate->diffInDays($today);

        // Hitung tahun dengan desimal (365.25 hari per tahun untuk account leap years)
        return $totalDays / 365.25;
    }
}
