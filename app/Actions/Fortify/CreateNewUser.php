<?php

namespace App\Actions\Fortify;

use App\Models\Notification;
use App\Models\User;
use App\Rules\YarsiEmailDomain;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Exceptions\HttpResponseException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                new YarsiEmailDomain(),
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'is_active' => false,
        ]);

        // Kirim notifikasi ke semua superadmin bahwa ada pendaftaran baru
        $superadmins = User::whereHas('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->get();

        foreach ($superadmins as $superadmin) {
            Notification::create([
                'user_id' => $superadmin->id,
                'title' => 'Pendaftaran Pengguna Baru',
                'message' => "Pengguna baru '{$user->name}' ({$user->email}) telah mendaftar dan menunggu persetujuan akses.",
                'type' => 'user_registration',
                'is_read' => false,
                'action_data' => [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'action_url' => '/users', // Link ke halaman manajemen pengguna
                ],
            ]);
        }


        // Jangan auto-login, throw redirect ke registration pending page
        throw new HttpResponseException(
            redirect('/registration-pending')
        );
    }
}
