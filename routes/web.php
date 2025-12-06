<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // --- Rute yang bisa diakses SEMUA PERAN ---
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- RUTE UNTUK PERAN ADMIN & SUPERADMIN ---
    Route::middleware('role:superadmin,admin')->group(function () {
        // Semua Rute Aset
        Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
        Route::get('assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
        Route::get('assets/create', [AssetController::class, 'create'])->name('assets.create');
        Route::post('assets', [AssetController::class, 'store'])->name('assets.store');
        Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
        Route::put('assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
        Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::post('assets/import', [AssetController::class, 'import'])->name('assets.import');

        // Semua Rute Laporan SEKARANG DI SINI
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export/excel', [ReportController::class, 'exportExcel'])->name('reports.export.excel');
        Route::get('reports/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });

    // --- RUTE HANYA UNTUK PERAN SUPERADMIN ---
    Route::middleware('role:superadmin')->group(function () {
        // Manajemen Pengguna
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('settings', [SettingsController::class, 'show'])->name('settings.show');
    });
});
