# 📘 Manual Pengembangan Backend YAMS

**Yarsi Asset Management System - Backend Development Guide**  
Version: 1.0  
Last Updated: January 28, 2026

---

## 📑 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Teknologi Stack](#teknologi-stack)
3. [Struktur Direktori](#struktur-direktori)
4. [Database & Migrations](#database--migrations)
5. [Models & Eloquent](#models--eloquent)
6. [Controllers](#controllers)
7. [Routing](#routing)
8. [Authentication & Authorization](#authentication--authorization)
9. [Services & Business Logic](#services--business-logic)
10. [Console Commands](#console-commands)
11. [Imports & Exports](#imports--exports)
12. [Policies & Middleware](#policies--middleware)
13. [Best Practices](#best-practices)
14. [Testing](#testing)
15. [Deployment](#deployment)

---

## 🎯 Pengenalan

YAMS adalah aplikasi manajemen aset berbasis Laravel 12+ dengan arsitektur modern menggunakan Inertia.js untuk SSR (Server-Side Rendering). Aplikasi ini dirancang khusus untuk Universitas Yarsi dengan fitur auto-depreciation, formula-based calculation, dan role-based access control.

### Fitur Utama Backend:
- ✅ Laravel 12+ dengan PHP 8.2+
- ✅ Inertia.js SSR Integration
- ✅ Laravel Fortify Authentication
- ✅ Role-Based Access Control
- ✅ Auto-Depreciation System
- ✅ Formula-Based Calculation Engine
- ✅ Real-Time Notification System
- ✅ Excel Import/Export
- ✅ PDF Report Generation

---

## 🛠 Teknologi Stack

### Core Framework
```json
{
  "laravel/framework": "^12.0",
  "php": "^8.2",
  "inertiajs/inertia-laravel": "^2.0"
}
```

### Authentication & Authorization
```json
{
  "laravel/fortify": "^1.30"
}
```

### Database & ORM
```json
{
  "mysql": "^8.0",
  "eloquent-orm": "included"
}
```

### File Processing
```json
{
  "maatwebsite/excel": "^3.1",
  "barryvdh/laravel-dompdf": "^3.1"
}
```

### Development Tools
```json
{
  "pestphp/pest": "^3.0",
  "laravel/telescope": "optional"
}
```

---

## 📂 Struktur Direktori

```
app/
├── Actions/
│   └── Fortify/
│       ├── CreateNewUser.php
│       ├── ResetUserPassword.php
│       └── PasswordValidationRules.php
├── Console/
│   └── Commands/
│       ├── RunAssetDepreciation.php
│       ├── RecordDepreciationHistory.php
│       └── RecalculateAssetValues.php
├── Exports/
│   └── AssetsTemplateExport.php
├── Http/
│   ├── Controllers/
│   │   ├── AssetController.php (578 lines)
│   │   ├── DashboardController.php (170 lines)
│   │   ├── FormulaController.php (210 lines)
│   │   ├── UserController.php
│   │   ├── ReportController.php
│   │   ├── NotificationController.php
│   │   └── SettingsController.php
│   └── Middleware/
│       ├── HandleInertiaRequests.php
│       └── CheckUserRole.php
├── Imports/
│   └── AssetsImport.php
├── Models/
│   ├── User.php
│   ├── Asset.php
│   ├── Role.php
│   ├── DepreciationFormula.php
│   ├── DepreciationHistory.php
│   ├── Notification.php
│   └── ActivityLog.php
├── Policies/
│   ├── AssetPolicy.php
│   ├── UserPolicy.php
│   └── NotificationPolicy.php
├── Providers/
│   ├── AppServiceProvider.php
│   └── FortifyServiceProvider.php
├── Responses/
│   └── RegisterResponse.php
├── Rules/
│   └── YarsiEmailDomain.php
└── Services/
    └── NotificationService.php
```

---

## 🗄️ Database & Migrations

### Migration Files (17 Files)

#### 1. Base Tables
```php
// 0001_01_01_000000_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('avatar')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

#### 2. Two-Factor Authentication
```php
// 2025_08_26_100418_add_two_factor_columns_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->text('two_factor_secret')->nullable();
    $table->text('two_factor_recovery_codes')->nullable();
    $table->timestamp('two_factor_confirmed_at')->nullable();
});
```

#### 3. Assets Table
```php
// 2025_11_20_133835_create_assets_table.php
Schema::create('assets', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('room_name')->nullable();
    $table->string('location')->nullable(); // NEW
    $table->string('floor')->nullable(); // NEW
    $table->string('asset_code')->nullable();
    $table->string('unit_code')->nullable();
    $table->date('received_date')->nullable();
    $table->decimal('purchase_price', 15, 2)->default(0);
    $table->decimal('current_book_value', 15, 2)->nullable();
    $table->date('last_depreciation_date')->nullable();
    $table->integer('useful_life')->default(5);
    $table->decimal('salvage_value', 15, 2)->default(0);
    $table->string('type')->nullable();
    $table->enum('depreciation_type', ['depreciation', 'appreciation'])->default('depreciation'); // NEW
    $table->decimal('custom_depreciation_rate', 5, 2)->nullable(); // NEW
    $table->string('brand')->nullable();
    $table->string('serial_number')->nullable();
    $table->integer('quantity')->default(1);
    $table->string('status');
    $table->text('description')->nullable();
    $table->string('user_assigned')->nullable();
    $table->string('inventory_status')->nullable();
    $table->string('photo')->nullable();
    $table->timestamps();
});
```

#### 4. Roles & Permissions
```php
// 2025_12_05_072319_create_roles_and_role_user_tables.php
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->string('display_name')->nullable();
    $table->timestamps();
});

Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->timestamps();
    $table->primary(['user_id', 'role_id']);
});
```

#### 5. Depreciation System
```php
// 2025_12_06_044449_create_depreciation_histories_table.php
Schema::create('depreciation_histories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('asset_id')->constrained()->onDelete('cascade');
    $table->integer('year');
    $table->decimal('depreciation_amount', 15, 2);
    $table->decimal('book_value_start', 15, 2);
    $table->decimal('book_value_end', 15, 2);
    $table->date('calculated_at');
    $table->timestamps();
});

// 2025_12_07_113454_create_depreciation_formulas_table.php
Schema::create('depreciation_formulas', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('expression');
    $table->string('type')->default('depreciation'); // depreciation|appreciation
    $table->boolean('is_active')->default(false);
    $table->timestamps();
});
```

#### 6. Notifications
```php
// 2026_01_04_161801_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('message');
    $table->string('type')->default('info'); // info|success|warning|error
    $table->json('action_data')->nullable();
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
```

#### 7. Activity Logs
```php
// 2025_12_19_090000_create_activity_logs_table.php
Schema::create('activity_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('action');
    $table->nullableMorphs('subject');
    $table->json('changes')->nullable();
    $table->timestamps();
});
```

### Running Migrations

```bash
# Run all migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration (DROP ALL + MIGRATE)
php artisan migrate:fresh

# Fresh with seeding
php artisan migrate:fresh --seed
```

---

## 📦 Models & Eloquent

### 1. User Model

**File**: `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name', 'email', 'password', 'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token',
        'two_factor_secret', 'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user')
                    ->withTimestamps();
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Helper Methods
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }
}
```

### 2. Asset Model

**File**: `app/Models/Asset.php` (174 lines)

```php
<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'room_name', 'location', 'floor',
        'asset_code', 'unit_code', 'received_date',
        'purchase_price', 'current_book_value', 'last_depreciation_date',
        'useful_life', 'salvage_value', 'type',
        'depreciation_type', 'custom_depreciation_rate',
        'brand', 'serial_number', 'quantity', 'status',
        'description', 'user_assigned', 'inventory_status', 'photo',
    ];

    protected $casts = [
        'purchase_price' => 'float',
        'salvage_value' => 'float',
        'current_book_value' => 'float',
        'useful_life' => 'integer',
        'received_date' => 'date:Y-m-d',
        'last_depreciation_date' => 'date:Y-m-d',
        'custom_depreciation_rate' => 'float',
    ];

    protected $appends = [
        'asset_age_in_years',
        'annual_depreciation',
        'accumulated_depreciation',
        'book_value',
        'is_appreciating',
    ];

    // Relationships
    public function depreciationHistories()
    {
        return $this->hasMany(DepreciationHistory::class);
    }

    // Accessors
    protected function isAppreciating(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->depreciation_type === 'appreciation'
        );
    }

    protected function assetAgeInYears(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->received_date) return 0;
                return Carbon::parse($this->received_date)
                    ->diffInYears(Carbon::now());
            }
        );
    }

    protected function annualDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                // If using custom rate
                if ($this->custom_depreciation_rate > 0) {
                    return ($this->purchase_price * $this->custom_depreciation_rate) / 100;
                }

                // If using formula
                $formula = $this->is_appreciating
                    ? DepreciationFormula::getActiveAppreciationFormula()
                    : DepreciationFormula::getActiveDepreciationFormula();

                if (!$formula) {
                    // Fallback: straight-line method
                    return ($this->purchase_price - $this->salvage_value) 
                           / max($this->useful_life, 1);
                }

                // Evaluate formula expression
                return $this->evaluateFormula($formula->expression);
            }
        );
    }

    protected function accumulatedDepreciation(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->annual_depreciation * $this->asset_age_in_years
        );
    }

    protected function bookValue(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->is_appreciating) {
                    return $this->purchase_price + $this->accumulated_depreciation;
                }
                return max(
                    $this->purchase_price - $this->accumulated_depreciation,
                    $this->salvage_value
                );
            }
        );
    }

    // Helper Methods
    private function evaluateFormula(string $expression): float
    {
        $variables = [
            '{price}' => $this->purchase_price,
            '{salvage}' => $this->salvage_value,
            '{life}' => max($this->useful_life, 1),
            '{age}' => $this->asset_age_in_years,
        ];

        $expression = str_replace(
            array_keys($variables),
            array_values($variables),
            $expression
        );

        try {
            return eval("return {$expression};");
        } catch (\Throwable $e) {
            return 0;
        }
    }
}
```

### 3. DepreciationFormula Model

**File**: `app/Models/DepreciationFormula.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepreciationFormula extends Model
{
    protected $fillable = ['name', 'expression', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static $allowedVariables = [
        '{price}' => 'Harga Perolehan Aset',
        '{salvage}' => 'Nilai Sisa',
        '{life}' => 'Umur Ekonomis (tahun)',
        '{age}' => 'Umur Aset Saat Ini (tahun)',
    ];

    // Get active formula for depreciation
    public static function getActiveDepreciationFormula()
    {
        return self::where('type', 'depreciation')
                   ->where('is_active', true)
                   ->first();
    }

    // Get active formula for appreciation
    public static function getActiveAppreciationFormula()
    {
        return self::where('type', 'appreciation')
                   ->where('is_active', true)
                   ->first();
    }
}
```

### 4. Notification Model

**File**: `app/Models/Notification.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'title', 'message', 'type', 'action_data', 'read_at',
    ];

    protected $casts = [
        'action_data' => 'array',
        'read_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    // Methods
    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    public function isUnread(): bool
    {
        return is_null($this->read_at);
    }
}
```

---

## 🎮 Controllers

### 1. AssetController

**File**: `app/Http/Controllers/AssetController.php` (578 lines)

#### Key Methods:

```php
// List all assets with search & pagination
public function index(Request $request): Response
{
    $assetsQuery = Asset::query();

    // Search functionality
    if ($request->filled('search')) {
        $searchTerm = $request->input('search');
        $assetsQuery->where(function ($query) use ($searchTerm) {
            $query->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('asset_code', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('serial_number', 'LIKE', "%{$searchTerm}%");
        });
    }

    // Sorting
    if ($request->input('sort') === 'type') {
        $direction = $request->input('direction', 'asc');
        $assetsQuery->orderBy('type', $direction);
    } else {
        $assetsQuery->latest();
    }

    $assets = $assetsQuery->paginate(10)->withQueryString();

    return Inertia::render('Assets/Index', [
        'assets' => $assets,
        'filters' => $request->only(['search', 'sort', 'direction'])
    ]);
}

// Create new asset
public function store(Request $request): RedirectResponse
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'room_name' => 'nullable|string|max:255',
        'location' => 'nullable|string|max:255',
        'floor' => 'nullable|string|max:255',
        'purchase_price' => 'required|numeric|min:0',
        'useful_life' => 'required|integer|min:1',
        'depreciation_type' => 'required|in:depreciation,appreciation',
        'custom_depreciation_rate' => 'nullable|numeric|min:0|max:100',
        'photo' => 'nullable|image|max:2048',
        // ... other fields
    ]);

    // Auto-generate codes
    $validatedData['asset_code'] = $this->nextSequentialCode('asset_code', 'AKT');
    $validatedData['unit_code'] = $this->nextSequentialCode('unit_code', 'SAT');

    // Calculate initial book value
    $currentBookValue = $this->calculateInitialBookValue($validatedData);
    $validatedData['current_book_value'] = $currentBookValue;

    // Handle photo upload
    if ($request->hasFile('photo')) {
        $validatedData['photo'] = $request->file('photo')
            ->store('assets', 'public');
    }

    Asset::create($validatedData);

    return redirect()->route('assets.index')
        ->with('message', 'Aset berhasil ditambahkan.');
}

// Excel Import
public function import(Request $request): RedirectResponse
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls|max:5120',
    ]);

    try {
        Excel::import(new AssetsImport, $request->file('file'));
        
        return redirect()->route('assets.index')
            ->with('message', 'Data aset berhasil diimpor.');
    } catch (\Exception $e) {
        return redirect()->route('assets.index')
            ->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
    }
}

// Helper: Generate sequential code
private function nextSequentialCode(string $column, string $prefix): string
{
    $lastAsset = Asset::whereNotNull($column)
        ->where($column, 'LIKE', "{$prefix}%")
        ->orderByRaw("CAST(SUBSTRING({$column}, 4) AS UNSIGNED) DESC")
        ->first();

    if (!$lastAsset) {
        return "{$prefix}001";
    }

    $lastNumber = (int) substr($lastAsset->$column, 3);
    $nextNumber = $lastNumber + 1;

    return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
}
```

### 2. DashboardController

**File**: `app/Http/Controllers/DashboardController.php` (170 lines)

```php
public function index(): Response
{
    // Latest assets table
    $latestAssets = Asset::latest()->paginate(5);

    // Summary cards
    $totalAssets = Asset::count();
    $totalPurchaseValue = Asset::sum('purchase_price');
    
    $assetsForDepreciation = Asset::all();
    $totalDepreciation = $assetsForDepreciation->sum('accumulated_depreciation');
    $currentBookValue = $totalPurchaseValue - $totalDepreciation;

    $summaryData = [
        'total_assets' => $totalAssets,
        'total_purchase_value' => $totalPurchaseValue,
        'total_depreciation' => $totalDepreciation,
        'current_book_value' => $currentBookValue,
    ];

    // Chart data: Assets by Type
    $assetsByType = Asset::query()
        ->select('type', DB::raw('count(*) as total'))
        ->groupBy('type')
        ->pluck('total', 'type');

    // Chart data: Assets by Location
    $assetsByLocation = Asset::query()
        ->select('room_name', DB::raw('count(*) as total'))
        ->groupBy('room_name')
        ->pluck('total', 'room_name');

    $chartData = [
        'by_category' => $assetsByType,
        'by_location' => $assetsByLocation,
    ];

    // Trend data for line charts
    $trendData = $this->getMonthlyTrendData();

    return Inertia::render('dashboard', [
        'latestAssets' => $latestAssets,
        'summaryData' => $summaryData,
        'chartData' => $chartData,
        'trendData' => $trendData,
    ]);
}

private function getMonthlyTrendData(): array
{
    $years = [];
    $depreciationData = [];
    $appreciationData = [];

    $currentYear = Carbon::now()->year;
    $startYear = Asset::whereNotNull('received_date')
        ->orderBy('received_date', 'asc')
        ->value('received_date');
    
    $startYear = $startYear 
        ? Carbon::parse($startYear)->year 
        : $currentYear - 5;

    for ($year = $startYear; $year <= $currentYear; $year++) {
        $years[] = (string) $year;

        // Get data from history or calculate on-the-fly
        $hasHistory = DepreciationHistory::where('year', $year)->exists();

        if ($hasHistory) {
            // Use historical data
            $depTotal = DepreciationHistory::join('assets', 'depreciation_histories.asset_id', '=', 'assets.id')
                ->where('depreciation_histories.year', $year)
                ->where('assets.depreciation_type', 'depreciation')
                ->sum('depreciation_histories.book_value_end');

            $appTotal = DepreciationHistory::join('assets', 'depreciation_histories.asset_id', '=', 'assets.id')
                ->where('depreciation_histories.year', $year)
                ->where('assets.depreciation_type', 'appreciation')
                ->sum('depreciation_histories.book_value_end');
        } else {
            // Calculate current values
            $depTotal = Asset::where('depreciation_type', 'depreciation')->sum('book_value');
            $appTotal = Asset::where('depreciation_type', 'appreciation')->sum('book_value');
        }

        $depreciationData[] = round($depTotal / 1000000, 2);
        $appreciationData[] = round($appTotal / 1000000, 2);
    }

    return [
        'labels' => $years,
        'depreciation' => $depreciationData,
        'appreciation' => $appreciationData,
    ];
}
```

### 3. FormulaController

**File**: `app/Http/Controllers/FormulaController.php` (210 lines)

```php
// List all formulas
public function index()
{
    return Inertia::render('Formulas/Index', [
        'formulas' => DepreciationFormula::all(),
        'variables' => DepreciationFormula::$allowedVariables,
    ]);
}

// Create new formula
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'expression' => 'required|string',
        'type' => 'required|in:depreciation,appreciation',
    ]);

    DepreciationFormula::create($request->all());
    
    return redirect()->back()
        ->with('message', 'Rumus berhasil ditambahkan.');
}

// Activate formula
public function activate(DepreciationFormula $formula)
{
    // Deactivate all formulas of the same type
    DepreciationFormula::where('type', $formula->type)
        ->update(['is_active' => false]);
    
    // Activate selected formula
    $formula->update(['is_active' => true]);

    // Recalculate all affected assets
    $this->recalculateAllAssets($formula);

    return redirect()->back()
        ->with('message', 'Rumus diaktifkan dan semua aset telah dihitung ulang.');
}

// Recalculate all assets after formula activation
private function recalculateAllAssets(DepreciationFormula $formula)
{
    $today = now()->startOfDay();
    $processed = 0;

    $query = Asset::whereNotNull('received_date');

    if ($formula->type === 'depreciation') {
        $query->where('depreciation_type', 'depreciation');
    } else {
        $query->where('depreciation_type', 'appreciation');
    }

    $query->chunkById(100, function ($assets) use ($formula, $today, &$processed) {
        foreach ($assets as $asset) {
            // Skip assets with custom rate
            if (!empty($asset->custom_depreciation_rate)) {
                continue;
            }

            $receivedDate = Carbon::parse($asset->received_date)->startOfDay();
            $ageYears = $receivedDate->diffInYears($today);

            // Evaluate formula
            $annualChange = $this->evaluateExpression($formula->expression, [
                '{price}' => $asset->purchase_price ?: 0,
                '{salvage}' => $asset->salvage_value ?: 0,
                '{life}' => $asset->useful_life ?: 1,
                '{age}' => $ageYears,
            ]);

            $totalChange = $annualChange * $ageYears;

            // Update current_book_value
            if ($formula->type === 'appreciation') {
                $newBookValue = $asset->purchase_price + $totalChange;
            } else {
                $newBookValue = max(
                    $asset->purchase_price - $totalChange,
                    $asset->salvage_value
                );
            }

            $asset->update(['current_book_value' => $newBookValue]);
            $processed++;
        }
    });

    return $processed;
}

// Calculator page
public function calculator()
{
    return Inertia::render('Calculator/Index', [
        'formulas' => DepreciationFormula::all(),
        'variables' => DepreciationFormula::$allowedVariables,
    ]);
}
```

### 4. NotificationController

**File**: `app/Http/Controllers/NotificationController.php`

```php
// Get user notifications
public function index(): JsonResponse
{
    $user = Auth::user();
    $notifications = NotificationService::getUserNotifications($user->id, 20);
    $unreadCount = NotificationService::getUnreadCount($user->id);

    return response()->json([
        'notifications' => $notifications,
        'unread_count' => $unreadCount,
    ]);
}

// Mark notification as read
public function markAsRead(Notification $notification): JsonResponse
{
    $this->authorize('view', $notification);

    $notification->markAsRead();

    return response()->json([
        'message' => 'Notifikasi sudah dibaca',
        'unread_count' => NotificationService::getUnreadCount(Auth::id()),
    ]);
}

// Mark all as read
public function markAllAsRead(): JsonResponse
{
    $user = Auth::user();
    
    Notification::where('user_id', $user->id)
        ->whereNull('read_at')
        ->update(['read_at' => now()]);

    return response()->json([
        'message' => 'Semua notifikasi sudah dibaca',
        'unread_count' => 0,
    ]);
}

// Delete notification
public function destroy(Notification $notification): JsonResponse
{
    $this->authorize('delete', $notification);

    $notification->delete();

    return response()->json([
        'message' => 'Notifikasi berhasil dihapus',
    ]);
}
```

---

## 🛣️ Routing

**File**: `routes/web.php` (72 lines)

```php
<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FormulaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified', 'has.role'])->group(function () {

    // Dashboard (all roles)
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Asset Management (superadmin, admin only)
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('assets', [AssetController::class, 'index'])
            ->name('assets.index');
        Route::get('assets/create', [AssetController::class, 'create'])
            ->name('assets.create');
        Route::post('assets', [AssetController::class, 'store'])
            ->name('assets.store');
        Route::get('assets/{asset}', [AssetController::class, 'show'])
            ->name('assets.show');
        Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])
            ->name('assets.edit');
        Route::put('assets/{asset}', [AssetController::class, 'update'])
            ->name('assets.update');
        Route::delete('assets/{asset}', [AssetController::class, 'destroy'])
            ->name('assets.destroy');
        Route::post('assets/import', [AssetController::class, 'import'])
            ->name('assets.import');
        Route::get('assets/download-template', [AssetController::class, 'downloadTemplate'])
            ->name('assets.download-template');

        // Formula Management
        Route::get('formulas', [FormulaController::class, 'index'])
            ->name('formulas.index');
        Route::post('formulas', [FormulaController::class, 'store'])
            ->name('formulas.store');
        Route::post('formulas/{formula}/activate', [FormulaController::class, 'activate'])
            ->name('formulas.activate');
        Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])
            ->name('formulas.destroy');

        // Calculator
        Route::get('calculator', [FormulaController::class, 'calculator'])
            ->name('calculator.index');
    });

    // Reports (all authenticated users)
    Route::middleware('role:superadmin,admin,user')->group(function () {
        Route::get('reports', [ReportController::class, 'index'])
            ->name('reports.index');
        Route::get('reports/export/excel', [ReportController::class, 'exportExcel'])
            ->name('reports.export.excel');
        Route::get('reports/export/pdf', [ReportController::class, 'exportPdf'])
            ->name('reports.export.pdf');
    });

    // User Management (superadmin only)
    Route::middleware('role:superadmin')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Settings (all authenticated users)
    Route::get('settings', [SettingsController::class, 'show'])
        ->name('settings.show');
    Route::put('settings', [SettingsController::class, 'update'])
        ->name('settings.update');

    // Notifications (all authenticated users)
    Route::get('notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-as-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');
});
```

---

## 🔐 Authentication & Authorization

### 1. Laravel Fortify Configuration

**File**: `app/Providers/FortifyServiceProvider.php` (123 lines)

```php
<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use App\Rules\YarsiEmailDomain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Contracts\RegisterResponse;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Custom RegisterResponse
        $this->app->bind(
            RegisterResponse::class,
            \App\Responses\RegisterResponse::class
        );
    }

    public function boot(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);

        // Custom authentication with domain validation
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            // If user exists, bypass domain check
            if ($user) {
                if (Hash::check($request->password, $user->password)) {
                    return $user;
                }
                return null;
            }

            // Validate email domain for new users
            $validator = Validator::make($request->only('email'), [
                'email' => ['required', 'email', new YarsiEmailDomain()],
            ]);

            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }

            return null;
        });

        // Configure Inertia views
        Fortify::loginView(fn () => Inertia::render('auth/login'));
        Fortify::registerView(fn () => Inertia::render('auth/register'));
        Fortify::requestPasswordResetLinkView(
            fn () => Inertia::render('auth/forgot-password')
        );
        Fortify::resetPasswordView(
            fn (Request $request) => Inertia::render('auth/reset-password', [
                'email' => $request->email,
                'token' => $request->route('token'),
            ])
        );
    }
}
```

### 2. Email Domain Validation Rule

**File**: `app/Rules/YarsiEmailDomain.php`

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class YarsiEmailDomain implements Rule
{
    public function passes($attribute, $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $parts = explode('@', $value);
        if (count($parts) !== 2) {
            return false;
        }

        $domain = $parts[1];

        // Accept: yarsi.ac.id, students.yarsi.ac.id, dosen.yarsi.ac.id
        return $domain === 'yarsi.ac.id' 
            || str_ends_with($domain, '.yarsi.ac.id');
    }

    public function message()
    {
        return 'Email harus menggunakan subdomain Universitas Yarsi (@yarsi.ac.id).';
    }
}
```

### 3. Custom RegisterResponse

**File**: `app/Responses/RegisterResponse.php`

```php
<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        // Logout user (Fortify auto-login after register)
        Auth::logout();

        // Invalidate session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to login with success message
        return $request->wantsJson()
            ? new JsonResponse(['message' => 'Registration successful'], 201)
            : redirect('/login')->with('registration_success', true);
    }
}
```

### 4. Role-Based Middleware

**File**: `app/Http/Middleware/CheckUserRole.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check if user has any of the required roles
        if (!$user->hasAnyRole($roles)) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
```

### 5. Notification Policy

**File**: `app/Policies/NotificationPolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;

class NotificationPolicy
{
    public function view(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }

    public function delete(User $user, Notification $notification): bool
    {
        return $user->id === $notification->user_id;
    }
}
```

---

## 🔧 Services & Business Logic

### NotificationService

**File**: `app/Services/NotificationService.php` (74 lines)

```php
<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    /**
     * Send notification to all admins and superadmins
     */
    public static function notifyAdmins(
        string $title, 
        string $message, 
        string $type = 'info', 
        ?array $actionData = null
    ): void {
        $admins = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'superadmin']);
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'action_data' => $actionData,
            ]);
        }
    }

    /**
     * Send notification to specific user
     */
    public static function notifyUser(
        int $userId, 
        string $title, 
        string $message, 
        string $type = 'info', 
        ?array $actionData = null
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'action_data' => $actionData,
        ]);
    }

    /**
     * Get user notifications (unread first)
     */
    public static function getUserNotifications(
        int $userId, 
        int $limit = 10
    ): Collection {
        return Notification::where('user_id', $userId)
            ->orderByRaw('CASE WHEN read_at IS NULL THEN 0 ELSE 1 END')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get unread count
     */
    public static function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }
}
```

---

## ⚡ Console Commands

### 1. RunAssetDepreciation

**File**: `app/Console/Commands/RunAssetDepreciation.php` (228 lines)

```php
<?php

namespace App\Console\Commands;

use App\Models\Asset;
use App\Models\DepreciationFormula;
use App\Models\DepreciationHistory;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class RunAssetDepreciation extends Command
{
    protected $signature = 'assets:run-depreciation';
    protected $description = 'Calculate and update asset values on anniversary dates';

    public function handle(): int
    {
        $today = now()->startOfDay();
        $processed = 0;
        $processedAssets = [];

        // Set cache to prevent race conditions
        $cacheKey = 'depreciation_last_run_' . $today->toDateString();
        Cache::put($cacheKey, now(), now()->endOfDay());

        $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
        $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(200, function ($assets) use (
                $today, 
                $activeDepreciationFormula, 
                $activeAppreciationFormula, 
                &$processed, 
                &$processedAssets
            ) {
                foreach ($assets as $asset) {
                    $purchaseDate = Carbon::parse($asset->received_date)->startOfDay();

                    // Skip if not yet 1 year old
                    if ($today->lt($purchaseDate->copy()->addYear())) {
                        continue;
                    }

                    // Calculate age
                    $ageYears = $purchaseDate->diffInYears($today);
                    $nextAnniversary = $purchaseDate->copy()->addYears($ageYears);

                    // Check if today is anniversary
                    if (!$today->equalTo($nextAnniversary)) {
                        continue;
                    }

                    // Determine formula to use
                    $isAppreciating = $asset->depreciation_type === 'appreciation';
                    $formula = $isAppreciating 
                        ? $activeAppreciationFormula 
                        : $activeDepreciationFormula;

                    // Calculate annual change
                    if (!empty($asset->custom_depreciation_rate)) {
                        // Use custom rate
                        $annualChange = ($asset->purchase_price * $asset->custom_depreciation_rate) / 100;
                    } elseif ($formula) {
                        // Use formula
                        $annualChange = $this->evaluateFormula($formula->expression, [
                            '{price}' => $asset->purchase_price,
                            '{salvage}' => $asset->salvage_value,
                            '{life}' => $asset->useful_life,
                            '{age}' => $ageYears,
                        ]);
                    } else {
                        // Fallback: straight-line
                        $annualChange = ($asset->purchase_price - $asset->salvage_value) 
                                      / max($asset->useful_life, 1);
                    }

                    // Calculate new book value
                    $oldBookValue = $asset->current_book_value ?? $asset->purchase_price;
                    
                    if ($isAppreciating) {
                        $newBookValue = $oldBookValue + $annualChange;
                    } else {
                        $newBookValue = max($oldBookValue - $annualChange, $asset->salvage_value);
                    }

                    // Update asset
                    $asset->update([
                        'current_book_value' => $newBookValue,
                        'last_depreciation_date' => $today,
                    ]);

                    // Record history
                    DepreciationHistory::create([
                        'asset_id' => $asset->id,
                        'year' => $ageYears,
                        'depreciation_amount' => $annualChange,
                        'book_value_start' => $oldBookValue,
                        'book_value_end' => $newBookValue,
                        'calculated_at' => $today,
                    ]);

                    $processedAssets[] = $asset;
                    $processed++;
                }
            });

        // Send notification
        if ($processed > 0) {
            NotificationService::notifyAdmins(
                'Penyusutan Otomatis Selesai',
                "Berhasil memproses {$processed} aset pada " . $today->format('d/m/Y'),
                'success'
            );
        }

        $this->info("Processed {$processed} assets.");
        return Command::SUCCESS;
    }

    private function evaluateFormula(string $expression, array $variables): float
    {
        $expression = str_replace(
            array_keys($variables),
            array_values($variables),
            $expression
        );

        try {
            return eval("return {$expression};");
        } catch (\Throwable $e) {
            $this->error("Formula evaluation failed: {$e->getMessage()}");
            return 0;
        }
    }
}
```

### 2. Schedule Configuration

**File**: `app/Console/Kernel.php`

```php
<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Run depreciation daily at 00:01
        $schedule->command('assets:run-depreciation')
                 ->dailyAt('00:01')
                 ->withoutOverlapping()
                 ->onOneServer();

        // Record history monthly
        $schedule->command('assets:record-history')
                 ->monthlyOn(1, '01:00');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
```

---

## 📥 Imports & Exports

### 1. Assets Import

**File**: `app/Imports/AssetsImport.php`

```php
<?php

namespace App\Imports;

use App\Models\Asset;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class AssetsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        // Auto-generate codes
        $assetCode = $this->nextCode('asset_code', 'AKT');
        $unitCode = $this->nextCode('unit_code', 'SAT');

        return new Asset([
            'room_name' => $row['nama_ruang'] ?? null,
            'location' => $row['lokasi'] ?? null,
            'floor' => $row['lantai'] ?? null,
            'asset_code' => $assetCode,
            'unit_code' => $unitCode,
            'name' => $row['nama_aset'],
            'received_date' => $row['tanggal_perolehan'] ?? null,
            'purchase_price' => $row['harga_perolehan'] ?? 0,
            'depreciation_type' => $row['jenis_perhitungan'] ?? 'depreciation',
            'type' => $row['kategori'] ?? null,
            'useful_life' => $row['umur_ekonomis'] ?? 5,
            'salvage_value' => $row['nilai_sisa'] ?? 0,
            'custom_depreciation_rate' => $row['custom_rate'] ?? null,
            'brand' => $row['merek'] ?? null,
            'serial_number' => $row['nomor_seri'] ?? null,
            'quantity' => $row['jumlah'] ?? 1,
            'status' => $row['kondisi'] ?? 'Baik',
            'description' => $row['keterangan'] ?? null,
            'user_assigned' => $row['pengguna'] ?? null,
            'inventory_status' => $row['status_inventaris'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_aset' => 'required|string',
            'harga_perolehan' => 'required|numeric|min:0',
            'jenis_perhitungan' => 'required|in:Penyusutan,Kenaikan',
        ];
    }

    private function nextCode(string $column, string $prefix): string
    {
        $lastAsset = Asset::whereNotNull($column)
            ->where($column, 'LIKE', "{$prefix}%")
            ->orderByRaw("CAST(SUBSTRING({$column}, 4) AS UNSIGNED) DESC")
            ->first();

        if (!$lastAsset) {
            return "{$prefix}001";
        }

        $lastNumber = (int) substr($lastAsset->$column, 3);
        return $prefix . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
    }
}
```

### 2. Assets Template Export

**File**: `app/Exports/AssetsTemplateExport.php`

```php
<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssetsTemplateExport implements FromArray, WithHeadings, WithStyles
{
    public function headings(): array
    {
        return [
            'Nama Ruang',
            'Lokasi',
            'Lantai',
            'Kode Aset (auto)',
            'Kode Satuan (auto)',
            'Nama Aset',
            'Tanggal Perolehan (YYYY-MM-DD)',
            'Harga Perolehan',
            'Jenis Perhitungan (Penyusutan/Kenaikan)',
            'Kategori',
            'Umur Ekonomis (tahun)',
            'Nilai Sisa',
            'Custom Rate (%)',
            'Merek',
            'Nomor Seri',
            'Jumlah',
            'Kondisi',
            'Keterangan',
            'Pengguna',
            'Status Inventaris',
        ];
    }

    public function array(): array
    {
        return [
            // Example row 1: Depreciation
            [
                'Ruang Icikiwir',
                'Universitas Yarsi',
                'Lantai 3',
                '',
                '',
                'Meja Kerja Kayu',
                '2024-06-20',
                2500000,
                'Penyusutan',
                'Furniture',
                10,
                100000,
                '',
                'IKEA',
                'DESK-001',
                5,
                'Baik',
                'Meja kerja kayu jati',
                'Staff Umum',
                'Terdaftar',
            ],
            // Example row 2: Appreciation
            [
                '',
                '',
                'Tanah Kampus',
                '',
                '',
                'Tanah',
                '2020-05-10',
                5000000000,
                'Kenaikan',
                'Tanah',
                99,
                4500000000,
                '5',
                '',
                '',
                1,
                'Baik',
                'Tanah seluas 2 hektar',
                '',
                'Terdaftar',
            ],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
```

---

## ✅ Best Practices

### 1. Code Organization
- Follow PSR-12 coding standards
- Use type hints for parameters and return types
- Keep controllers thin, business logic in services
- Use repositories for complex queries

### 2. Database Queries
```php
// ✅ Good: Use chunking for large datasets
Asset::chunkById(200, function ($assets) {
    foreach ($assets as $asset) {
        // Process
    }
});

// ❌ Bad: Load all at once
$assets = Asset::all(); // Memory issue for large datasets
```

### 3. Validation
```php
// ✅ Good: Use Form Requests
public function store(StoreAssetRequest $request)
{
    Asset::create($request->validated());
}

// ✅ Alternative: Inline validation
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'purchase_price' => 'required|numeric|min:0',
]);
```

### 4. Error Handling
```php
// ✅ Good: Try-catch for risky operations
try {
    Excel::import(new AssetsImport, $file);
    return redirect()->back()->with('message', 'Import berhasil');
} catch (\Exception $e) {
    return redirect()->back()->with('error', 'Import gagal: ' . $e->getMessage());
}
```

### 5. Security
```php
// ✅ Use policies for authorization
$this->authorize('update', $asset);

// ✅ Always validate and sanitize input
$validated = $request->validate([...]);

// ✅ Use mass assignment protection
protected $fillable = ['name', 'price']; // Whitelist
protected $guarded = ['id', 'created_at']; // Blacklist
```

---

## 🧪 Testing

### Test Structure
```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── RegistrationTest.php
│   │   └── EmailVerificationTest.php
│   ├── AssetTest.php
│   ├── DashboardTest.php
│   └── NotificationTest.php
└── Unit/
    ├── Models/
    │   ├── AssetTest.php
    │   └── UserTest.php
    └── Services/
        └── NotificationServiceTest.php
```

### Example Feature Test
```php
<?php

use App\Models\Asset;
use App\Models\User;

test('admin can create asset', function () {
    $admin = User::factory()->create();
    $admin->roles()->attach(Role::where('name', 'admin')->first());

    $response = $this->actingAs($admin)->post(route('assets.store'), [
        'name' => 'Test Asset',
        'purchase_price' => 1000000,
        'useful_life' => 5,
        'salvage_value' => 100000,
        'depreciation_type' => 'depreciation',
        'status' => 'Baik',
    ]);

    $response->assertRedirect(route('assets.index'));
    $this->assertDatabaseHas('assets', ['name' => 'Test Asset']);
});

test('user cannot create asset', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::where('name', 'user')->first());

    $response = $this->actingAs($user)->get(route('assets.create'));

    $response->assertStatus(403);
});
```

### Run Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AssetTest.php

# Run with coverage
php artisan test --coverage
```

---

## 🚀 Deployment

### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database
# Edit .env file
DB_DATABASE=yams2_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 2. Database Migration
```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Or fresh with seed
php artisan migrate:fresh --seed
```

### 3. Storage Setup
```bash
# Create symbolic link
php artisan storage:link

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 4. Production Optimization
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 5. Scheduler Setup (Cron)
```bash
# Edit crontab
crontab -e

# Add this line:
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 6. Queue Worker (Optional)
```bash
# Run queue worker
php artisan queue:work --daemon

# Supervisor configuration (recommended)
[program:yams-queue-worker]
command=php /path/to/artisan queue:work --sleep=3 --tries=3
directory=/path/to/project
autostart=true
autorestart=true
user=www-data
```

---

## 📞 Support & Resources

### Documentation
- Laravel: https://laravel.com/docs/12.x
- Inertia.js: https://inertiajs.com
- Laravel Fortify: https://laravel.com/docs/12.x/fortify

### Contact
- Developer: YAMS Development Team
- Institution: Universitas Yarsi
- Email: support@yarsi.ac.id

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0  
**Framework**: Laravel 12+
