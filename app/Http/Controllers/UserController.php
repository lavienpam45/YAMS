<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role; // <-- Import Role
use App\Models\ActivityLog; // <-- Import ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // <-- Import Hash
use Illuminate\Validation\Rule; // <-- Import Rule
use Illuminate\Validation\Rules; // <-- Import Rules
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')->paginate(10);

        $activityLogs = [];
        $user = Auth::user();
        if ($user instanceof User) {
            // Check if user is superadmin by querying roles
            $userRoles = $user->roles->pluck('name')->toArray();
            if (in_array('superadmin', $userRoles)) {
                $activityLogs = ActivityLog::with(['actor:id,name,email', 'targetUser:id,name,email'])
                    ->latest()
                    ->take(30)
                    ->get();
            }
        }

        return Inertia::render('Users/Index', [
            'users' => $users,
            'activityLogs' => $activityLogs,
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
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Lampirkan peran yang dipilih ke pengguna baru (jika dipilih)
        if ($request->filled('role_id')) {
            $user->roles()->attach($request->role_id);
        }

        $this->logActivity('user.created', $user, [
            'role' => $request->filled('role_id') ? Role::find($request->role_id)?->name : 'No Role',
        ]);

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
            'role_id' => 'nullable|exists:roles,id',
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
        // Jika role_id kosong, detach semua roles
        if ($request->filled('role_id')) {
            $user->roles()->sync($request->role_id);
        } else {
            $user->roles()->detach();
        }

        $this->logActivity('user.updated', $user, [
            'role' => $request->filled('role_id') ? Role::find($request->role_id)?->name : 'No Role',
            'changed' => collect($user->getChanges())->only(['name', 'email'])->all(),
        ]);

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

        $targetName = $user->name;
        $targetEmail = $user->email;

        $user->delete();

        $this->logActivity('user.deleted', $user, [
            'email' => $targetEmail,
            'name' => $targetName,
        ]);

        return redirect()->route('users.index')->with('message', 'Pengguna berhasil dihapus.');
    }

    private function logActivity(string $action, User $target, array $metadata = []): void
    {
        ActivityLog::create([
            'actor_id' => Auth::id(),
            'action' => $action,
            'target_type' => 'user',
            'target_id' => $target->id,
            'target_name' => $target->name,
            'metadata' => $metadata,
        ]);
    }
}
