<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // UBAH DI SINI: 'paginate(5)' akan otomatis membagi data per 5 item per halaman.
        $latestAssets = Asset::latest()->paginate(5);

        return Inertia::render('dashboard', [
            'latestAssets' => $latestAssets
        ]);
    }
}
