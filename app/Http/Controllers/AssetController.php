<?php

namespace App\Http\Controllers;

use App\Imports\AssetsImport;
use App\Models\Asset;
use App\Models\ActivityLog;
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
        $nextAssetCode = $this->nextSequentialCode('asset_code');
        $nextUnitCode = $this->nextSequentialCode('unit_code');

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
            'asset_code' => 'nullable|string|max:255|unique:assets',
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

        // Isi kode otomatis jika tidak diisi (auto-increment sederhana)
        if (empty($validatedData['asset_code'])) {
            $validatedData['asset_code'] = $this->nextSequentialCode('asset_code');
        }
        if (empty($validatedData['unit_code'])) {
            $validatedData['unit_code'] = $this->nextSequentialCode('unit_code');
        }

        // Proses upload file jika ada
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('asset-photos', 'public');
            $validatedData['photo'] = $path;
        }

        $asset = Asset::create($validatedData);

        $this->logActivity('asset.created', $asset->id, $asset->name, $asset->asset_code, $asset->user_assigned, [
            'fields' => collect($validatedData)->all(),
        ]);

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

        $changes = [];
        foreach (array_keys($validatedData) as $field) {
            if ($oldValues[$field] !== $validatedData[$field]) {
                $changes[$field] = [
                    'old' => $oldValues[$field],
                    'new' => $validatedData[$field],
                ];
            }
        }

        $this->logActivity('asset.updated', $asset->id, $asset->name, $asset->asset_code, $asset->user_assigned, [
            'changes' => $this->formatChangesReadable($changes),
        ]);

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

    private function nextSequentialCode(string $column): string
    {
        $max = Asset::max($column);
        $numeric = $max ? (int)preg_replace('/[^0-9]/', '', (string)$max) : 0;
        return (string)($numeric + 1);
    }
}
