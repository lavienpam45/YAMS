<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * Middleware ini memastikan bahwa user yang login memiliki setidaknya satu role.
     * Jika user tidak memiliki role sama sekali, logout dan redirect ke login dengan pesan error.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            // Cek apakah user memiliki role
            if ($user->roles()->count() === 0) {
                Auth::logout();

                return redirect()->route('login')->with('error', 'Akun Anda belum memiliki akses. Silakan hubungi Super Administrator untuk mengaktifkan akun Anda.');
            }
        }

        return $next($request);
    }
}
