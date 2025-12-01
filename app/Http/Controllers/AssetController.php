<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

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
        $request->validate([
            'name' => 'required|string|max:255',
            'room_name' => 'nullable|string|max:255',
            'asset_code' => 'nullable|string|max:255|unique:assets',
            'unit_code' => 'nullable|string|max:255',
            'received_date' => 'nullable|date',
            'purchase_price' => 'required|numeric|min:0',
            'useful_life' => 'required|integer|min:1', // Validasi baru
            'salvage_value' => 'required|numeric|min:0', // Validasi baru
            'type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_assigned' => 'nullable|string|max:255',
            'inventory_status' => 'nullable|string|max:255',
        ]);

        Asset::create($request->all());

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
        $request->validate([
            'name' => 'required|string|max:255',
            'room_name' => 'nullable|string|max:255',
            'unit_code' => 'nullable|string|max:255',
            'received_date' => 'nullable|date',
            'purchase_price' => 'required|numeric|min:0',
            'useful_life' => 'required|integer|min:1', // Validasi baru
            'salvage_value' => 'required|numeric|min:0', // Validasi baru
            'type' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_assigned' => 'nullable|string|max:255',
            'inventory_status' => 'nullable|string|max:255',
        ]);

        $asset->update($request->all());

        return redirect()->route('assets.index')->with('message', 'Aset berhasil diperbarui.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $asset->delete();
        return redirect()->route('assets.index')->with('message', 'Aset berhasil dihapus.');
    }
}
