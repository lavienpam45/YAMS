<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController; // Pastikan ini ada jika Anda menggunakan Settings
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\FormulaController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('registration-pending', function () {
    return Inertia::render('auth/registration-pending');
})->name('registration.pending');

Route::middleware(['auth', 'verified', 'has.role'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
        // Pastikan route 'create' didefinisikan sebelum route 'assets/{asset}'
        // agar URI '/assets/create' tidak tertangkap oleh parameter {asset}.
        Route::get('assets/create', [AssetController::class, 'create'])->name('assets.create');
        Route::get('assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
        Route::post('assets', [AssetController::class, 'store'])->name('assets.store');
        Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
        Route::put('assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
        Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::post('assets/import', [AssetController::class, 'import'])->name('assets.import');

        Route::get('formulas', [FormulaController::class, 'index'])->name('formulas.index');
        Route::post('formulas', [FormulaController::class, 'store'])->name('formulas.store');
        Route::post('formulas/{formula}/activate', [FormulaController::class, 'activate'])->name('formulas.activate');
        Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])->name('formulas.destroy');
        Route::get('calculator', [FormulaController::class, 'calculator'])->name('calculator.index');

    });

    Route::middleware('role:superadmin,admin,user')->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export/excel', [ReportController::class, 'exportExcel'])->name('reports.export.excel');
        Route::get('reports/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });

    Route::middleware('role:superadmin')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Settings accessible to all authenticated users
    Route::get('settings', [SettingsController::class, 'show'])->name('settings.show');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

    // Notification routes (accessible to all authenticated users)
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

// require __DIR__.'/settings.php'; <-- BARIS INI DIHAPUS
