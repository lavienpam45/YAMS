<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// PERBAIKAN BUG #1: Schedule auto-depreciation setiap hari
Schedule::command('assets:run-depreciation')
    ->dailyAt('00:01')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Illuminate\Support\Facades\Log::info('✓ Auto depreciation berhasil dijalankan pada ' . now()->format('Y-m-d H:i:s'));
    })
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('✗ Auto depreciation gagal dijalankan pada ' . now()->format('Y-m-d H:i:s'));
    });

// BACKUP OTOMATIS: Setiap hari jam 02:00 WIB
Schedule::command('backup:run --type=all')
    ->dailyAt('02:00')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping()
    ->onSuccess(function () {
        \Illuminate\Support\Facades\Log::info('✓ Backup otomatis berhasil pada ' . now()->format('Y-m-d H:i:s'));
    })
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('✗ Backup otomatis gagal pada ' . now()->format('Y-m-d H:i:s'));
    });
