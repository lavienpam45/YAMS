<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
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
        // Redirect to pending approval page atau login dengan pesan
        return $request->wantsJson()
            ? new JsonResponse([], 201)
            : redirect('/registration-pending');
    }
}
