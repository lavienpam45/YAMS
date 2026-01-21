<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toResponse($request)
    {
        // Logout user yang baru register (Fortify auto-login setelah register)
        // Karena user belum diaktifkan oleh admin, mereka tidak boleh langsung masuk
        Auth::logout();

        // Invalidate session dan regenerate token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect ke halaman login dengan flash message sukses registrasi
        return $request->wantsJson()
            ? new JsonResponse(['message' => 'Registration successful'], 201)
            : redirect('/login')->with('registration_success', true);
    }
}
