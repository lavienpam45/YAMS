<?php

namespace App\Http\Middleware;

use App\Models\User; // <-- TAMBAHKAN IMPORT User
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Pengecekan awal, tidak ada perubahan
        if (!Auth::check()) {
            return $next($request);
        }

        /** @var \App\Models\User $user */ // <-- PERBAIKAN UTAMA DI SINI (PHPDoc block)
        $user = Auth::user();

        // Jika karena alasan aneh user tidak ada, jangan lanjutkan
        if (!$user) {
            abort(403, 'AKSI TIDAK DIIZINKAN.');
        }

        foreach ($roles as $role) {
            // Sekarang VScode DIJAMIN tahu bahwa $user memiliki fungsi hasRole()
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        abort(403, 'AKSI TIDAK DIIZINKAN.');
    }
}
