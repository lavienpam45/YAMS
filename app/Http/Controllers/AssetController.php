<?php

namespace App\Http\Controllers;

use App\Imports\AssetsImport;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
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

        $assets = $assetsQuery->latest()->paginate(10)->withQueryString();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Assets/Create');
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

        // Proses upload file jika ada
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('asset-photos', 'public');
            $validatedData['photo'] = $path;
        }

        Asset::create($validatedData);

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

        return redirect()->route('assets.index')->with('message', 'Aset berhasil diperbarui.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        // Hapus file foto terkait jika ada
        if ($asset->photo) {
            Storage::disk('public')->delete($asset->photo);
        }

        $asset->delete();
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
}
