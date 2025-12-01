<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController; // <-- TAMBAHKAN IMPORT INI
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // --- UBAH RUTE DASHBOARD DI SINI ---
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- RUTE ASET TETAP SAMA ---
    Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
    Route::get('assets/create', [AssetController::class, 'create'])->name('assets.create');
    Route::post('assets', [AssetController::class, 'store'])->name('assets.store');
    Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
    Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
    Route::put('assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
});

require __DIR__.'/settings.php';
