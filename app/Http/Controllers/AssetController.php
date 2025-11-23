<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response; // Import Response untuk praktik terbaik
use Illuminate\Http\RedirectResponse;

class AssetController extends Controller
{
    /**
     * Menampilkan halaman daftar aset.
     */
    public function index(): Response // Tentukan tipe kembalian
    {
        // 1. Ambil SEMUA data aset dari database
        $assets = Asset::all();

        // 2. Kirim data tersebut ke komponen 'Assets/Index'
        //    sebagai sebuah prop bernama 'assets'.
        //    (Hapus tanda komentar)
        return Inertia::render('Assets/Index', [
            'assets' => Asset::latest()->paginate(10)
        ]);
    }

    /**
     * FUNGSI BARU: Menampilkan form pembuatan aset.
     */
    public function create(): Response
    {
        return Inertia::render('Assets/Create');
    }

    /**
     * FUNGSI BARU: Menyimpan aset baru ke database.
     */
    public function store(Request $request)
    {
        // 1. Validasi data yang masuk
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'purchase_date' => 'required|date',
            'purchase_price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // 2. Buat aset baru menggunakan data yang sudah divalidasi
        Asset::create($validatedData);

        // 3. Kembalikan pengguna ke halaman daftar aset
        return redirect()->route('assets.index')->with('message', 'Aset berhasil ditambahkan.');
    }

    /**
     * FUNGSI BARU: Menghapus aset dari database.
     */
    public function destroy(Asset $asset): RedirectResponse
    {
        // Laravel secara otomatis menemukan 'Asset' berdasarkan ID dari URL.
        // Kita tinggal hapus.
        $asset->delete();

        // Kembalikan pengguna ke halaman daftar aset.
        return redirect()->route('assets.index')->with('message', 'Aset berhasil dihapus!');
    }
}
