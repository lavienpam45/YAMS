<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    // Ubah nama fungsi menjadi 'show'
    public function show(): Response
    {
        // Render ke 'settings/General' bukan 'Settings/Index'
        return Inertia::render('settings/General');
    }
}
