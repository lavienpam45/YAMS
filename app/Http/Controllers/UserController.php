<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role; // <-- Import Role
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <-- Import Hash
use Illuminate\Validation\Rule; // <-- Import Rule
use Illuminate\Validation\Rules; // <-- Import Rules
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // <-- Import RedirectResponse

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('roles')->paginate(10),
        ]);
    }

    /**
     * Tampilkan form untuk menambah pengguna baru.
     */
    public function create(): Response
    {
        // Ambil peran "Admin" dan "User" saja, Superadmin tidak bisa dibuat dari sini.
        $roles = Role::where('name', '!=', 'superadmin')->get();

        return Inertia::render('Users/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Simpan pengguna baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Lampirkan peran yang dipilih ke pengguna baru
        $user->roles()->attach($request->role_id);

        return redirect()->route('users.index')->with('message', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Tampilkan form untuk mengedit pengguna.
     */
    public function edit(User $user): Response
    {
        // 'load('roles')' memastikan kita juga mengambil data peran yang sudah dimiliki user
        $user->load('roles');

        // Ambil semua peran kecuali superadmin
        $roles = Role::where('name', '!=', 'superadmin')->get();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Perbarui data pengguna di database.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // Pastikan email unik, kecuali untuk email user itu sendiri
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'role_id' => 'required|exists:roles,id',
            // Password bersifat opsional, hanya diubah jika diisi
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        // Update nama dan email
        $user->name = $request->name;
        $user->email = $request->email;

        // Update password jika diisi
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // 'sync' akan menghapus semua peran lama dan menerapkan yang baru
        $user->roles()->sync($request->role_id);

        return redirect()->route('users.index')->with('message', 'Pengguna berhasil diperbarui.');
    }

    /**
     * FUNGSI BARU UNTUK MENGHAPUS PENGGUNA
     */
    public function destroy(User $user): RedirectResponse
    {
        // PENTING: Mencegah penghapusan Super Admin
        if ($user->roles()->where('name', 'superadmin')->exists()) {
            return redirect()->route('users.index')->with('error', 'Super Administrator tidak dapat dihapus.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('message', 'Pengguna berhasil dihapus.');
    }
}
