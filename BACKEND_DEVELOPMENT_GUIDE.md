# 📚 MANUAL PENGEMBANGAN BACKEND - YAMS

**Yet Another Management System (YAMS)**  
**Sistem Manajemen Aset & Depresiasi Universitas Yarsi**

---

## 📋 DAFTAR ISI

1. [Arsitektur Backend](#arsitektur-backend)
2. [Setup & Instalasi](#setup--instalasi)
3. [Struktur Direktori](#struktur-direktori)
4. [Database & Migrations](#database--migrations)
5. [Models & Relationships](#models--relationships)
6. [Controllers](#controllers)
7. [Services](#services)
8. [Commands & Scheduler](#commands--scheduler)
9. [Routes & Middleware](#routes--middleware)
10. [Auto-Depreciation System](#auto-depreciation-system)
11. [Formula Management](#formula-management)
12. [Notification System](#notification-system)
13. [Testing](#testing)
14. [Best Practices](#best-practices)

---

## 🏗️ ARSITEKTUR BACKEND

### **Tech Stack**

```
├── Framework: Laravel 12.x
├── PHP Version: 8.2+
├── Database: MySQL / SQLite
├── Authentication: Laravel Fortify (dengan 2FA)
├── PDF Export: barryvdh/laravel-dompdf
├── Excel Export: maatwebsite/excel
├── Frontend Bridge: Inertia.js
└── Route Helper: Ziggy
```

### **Design Pattern**

- **MVC Pattern**: Model-View-Controller architecture
- **Service Layer**: NotificationService untuk business logic
- **Repository Pattern**: Implicit via Eloquent ORM
- **Command Pattern**: Console commands untuk scheduled tasks
- **Observer Pattern**: Model events (optional, tidak digunakan saat ini)

### **Key Features**

1. **Auto-Depreciation System** dengan Hybrid mechanism (Scheduler + HTTP Fallback)
2. **Dynamic Formula System** untuk perhitungan depresiasi/apresiasi
3. **Role-Based Access Control** (SuperAdmin, Admin, User)
4. **Real-time Notification** system
5. **Comprehensive Reporting** dengan Excel & PDF export
6. **Activity Logging** untuk audit trail

---

## 🚀 SETUP & INSTALASI

### **Prerequisites**

```bash
- PHP >= 8.2
- Composer >= 2.x
- Node.js >= 18.x
- MySQL >= 8.0 atau SQLite
- Git
```

### **Instalasi Pertama Kali**

```bash
# 1. Clone repository
git clone <repository-url>
cd yams2

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Setup database (edit .env terlebih dahulu)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yams
DB_USERNAME=root
DB_PASSWORD=

# 5. Migrate database
php artisan migrate

# 6. Seed data (optional)
php artisan db:seed

# 7. Setup storage
php artisan storage:link

# 8. Build frontend
npm run build
```

### **Development Environment**

```bash
# Method 1: Composer script (recommended)
composer dev
# Ini akan menjalankan:
# - php artisan serve (port 8000)
# - php artisan queue:listen
# - npm run dev (Vite)

# Method 2: Manual
# Terminal 1
php artisan serve

# Terminal 2
php artisan queue:listen --tries=1

# Terminal 3
npm run dev
```

### **Production Setup**

```bash
# 1. Build assets
npm run build

# 2. Setup scheduler (Linux/Mac)
crontab -e
# Tambahkan:
* * * * * cd /path/to/yams2 && php artisan schedule:run >> /dev/null 2>&1

# Windows: Task Scheduler
# Program: C:\path\to\php.exe
# Arguments: artisan schedule:run
# Start in: C:\path\to\yams2
# Trigger: Daily at 00:00, repeat every 1 minute for 24 hours

# 3. Setup queue worker (supervisor/systemd)
php artisan queue:work --daemon

# 4. Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📁 STRUKTUR DIREKTORI

```
app/
├── Console/
│   └── Commands/
│       ├── RunAssetDepreciation.php      ⭐ Auto-depreciation scheduler
│       ├── RecalculateAssetValues.php    Manual recalculation
│       └── RecordDepreciationHistory.php History recording
│
├── Http/
│   ├── Controllers/
│   │   ├── AssetController.php           ⭐ CRUD Aset + Calculation
│   │   ├── FormulaController.php         ⭐ Formula Management
│   │   ├── DashboardController.php       Dashboard statistics
│   │   ├── ReportController.php          Excel/PDF exports
│   │   ├── NotificationController.php    Notification CRUD
│   │   ├── UserController.php            User management
│   │   └── SettingsController.php        User settings
│   │
│   ├── Middleware/
│   │   ├── HasRole.php                   Role-based access
│   │   └── ShareInertiaData.php          Global Inertia data
│   │
│   └── Requests/
│       └── (Form Request classes - optional)
│
├── Models/
│   ├── Asset.php                         ⭐ Main asset model
│   ├── DepreciationFormula.php           ⭐ Formula model
│   ├── DepreciationHistory.php           History records
│   ├── Notification.php                  Notification model
│   ├── User.php                          User with 2FA
│   ├── Role.php                          Role model
│   └── ActivityLog.php                   Activity logging
│
├── Providers/
│   ├── AppServiceProvider.php            ⭐ Hybrid fallback system
│   └── RouteServiceProvider.php          Route configuration
│
├── Services/
│   └── NotificationService.php           ⭐ Notification business logic
│
├── Imports/
│   └── AssetsImport.php                  Excel import handler
│
└── Exports/
    └── AssetsExport.php                  Excel export handler

database/
├── migrations/
│   ├── 2025_11_20_133835_create_assets_table.php
│   ├── 2025_12_07_113454_create_depreciation_formulas_table.php
│   ├── 2025_12_06_044449_create_depreciation_histories_table.php
│   ├── 2026_01_04_161801_create_notifications_table.php
│   ├── 2026_01_05_000000_add_current_book_value_to_assets_table.php
│   ├── 2026_01_13_214556_add_depreciation_type_to_assets_table.php
│   └── 2026_01_13_215524_add_custom_depreciation_rate_to_assets_table.php
│
├── seeders/
│   └── DatabaseSeeder.php
│
└── factories/
    └── AssetFactory.php

routes/
└── web.php                               ⭐ All route definitions

config/
├── app.php                               App configuration
├── database.php                          Database config
├── auth.php                              Auth config
└── fortify.php                           2FA config
```

---

## 💾 DATABASE & MIGRATIONS

### **Tabel: `assets`**

```php
Schema::create('assets', function (Blueprint $table) {
    $table->id();
    
    // Identitas Aset
    $table->string('name');                      // Nama aset
    $table->string('asset_code')->unique();      // Kode aset (AKT-001)
    $table->string('unit_code')->nullable();     // Kode unit (SAT-001)
    $table->string('type')->nullable();          // Jenis aset (Elektronik, Furniture)
    
    // Lokasi
    $table->string('location')->nullable();      // Lokasi (Gedung A)
    $table->string('floor')->nullable();         // Lantai (Lantai 1)
    $table->string('room_name')->nullable();     // Nama ruangan (R.101)
    
    // Informasi Pembelian
    $table->date('received_date')->nullable();   // Tanggal terima/beli
    $table->decimal('purchase_price', 15, 2);    // Harga beli
    
    // Depresiasi/Apresiasi
    $table->integer('useful_life');              // Umur manfaat (tahun)
    $table->decimal('salvage_value', 15, 2);     // Nilai sisa/residu
    $table->decimal('current_book_value', 15, 2)->nullable(); // ⭐ Nilai saat ini
    $table->date('last_depreciation_date')->nullable(); // ⭐ Terakhir dihitung
    
    // Tipe Perhitungan
    $table->enum('depreciation_type', ['depreciation', 'appreciation'])
          ->default('depreciation');             // ⭐ Penyusutan atau Kenaikan
    $table->decimal('custom_depreciation_rate', 5, 2)->nullable(); // ⭐ Custom %
    
    // Detail Aset
    $table->string('brand')->nullable();         // Merek
    $table->string('serial_number')->nullable(); // Serial number
    $table->integer('quantity')->default(1);     // Jumlah
    $table->string('status');                    // Status (Aktif, Rusak)
    $table->text('description')->nullable();     // Deskripsi
    $table->string('user_assigned')->nullable(); // Pengguna
    $table->string('inventory_status')->nullable(); // Status inventaris
    $table->string('photo')->nullable();         // Path foto
    
    $table->timestamps();
});
```

**Key Fields Explanation:**

- `current_book_value`: **Auto-calculated** oleh sistem, tidak boleh diinput manual
- `last_depreciation_date`: Track kapan terakhir dihitung (untuk scheduler)
- `depreciation_type`: Explicit field untuk depreciation/appreciation (bukan deteksi dari type)
- `custom_depreciation_rate`: Override formula dengan persentase custom (0-100)

### **Tabel: `depreciation_formulas`**

```php
Schema::create('depreciation_formulas', function (Blueprint $table) {
    $table->id();
    $table->string('name');                      // Nama formula (Straight-Line)
    $table->text('expression');                  // Formula math: ({price}-{salvage})/{life}
    $table->enum('type', ['depreciation', 'appreciation']); // Tipe formula
    $table->boolean('is_active')->default(false); // ⭐ Hanya 1 aktif per type
    $table->text('description')->nullable();     // Keterangan
    $table->timestamps();
});
```

**Allowed Variables:**
- `{price}`: Harga beli
- `{salvage}`: Nilai sisa
- `{life}`: Umur manfaat (tahun)
- `{age}`: Umur aset saat ini (tahun, desimal)

**Example Formulas:**
```php
// Straight-Line Depreciation
'({price} - {salvage}) / {life}'

// Straight-Line dengan age
'(({price} - {salvage}) / {life}) * {age}'

// Appreciation 5% per tahun
'{price} * 0.05 * {age}'

// Double Declining Balance
'{price} * (2 / {life}) * {age}'
```

### **Tabel: `depreciation_histories`**

```php
Schema::create('depreciation_histories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('asset_id')->constrained()->onDelete('cascade');
    $table->integer('year');                     // Tahun (2026)
    $table->decimal('book_value_start', 15, 2);  // Nilai awal
    $table->decimal('depreciation_value', 15, 2); // Perubahan (+/-)
    $table->decimal('book_value_end', 15, 2);    // Nilai akhir
    $table->timestamps();
    
    $table->unique(['asset_id', 'year']);        // 1 record per aset per tahun
});
```

### **Tabel: `notifications`**

```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');                     // Judul notifikasi
    $table->text('message');                     // Pesan detail
    $table->enum('type', ['info', 'success', 'warning', 'error'])->default('info');
    $table->json('action_data')->nullable();     // Metadata (asset_id, etc)
    $table->boolean('is_read')->default(false);  // Status baca
    $table->timestamps();
});
```

### **Tabel: `users`**

```php
// Laravel default users table + 2FA columns
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('two_factor_secret')->nullable();
    $table->text('two_factor_recovery_codes')->nullable();
    $table->timestamp('two_factor_confirmed_at')->nullable();
    $table->string('avatar')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

### **Tabel: `roles` & `role_user`**

```php
// Roles table
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // superadmin, admin, user
    $table->string('display_name');
    $table->timestamps();
});

// Pivot table
Schema::create('role_user', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

---

## 🎯 MODELS & RELATIONSHIPS

### **Model: Asset.php**

```php
<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Asset extends Model
{
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
        return $this->hasMany(DepreciationHistory::class)
                    ->orderBy('year', 'desc');
    }

    // Accessors
    protected function isAppreciating(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!empty($this->depreciation_type)) {
                    return $this->depreciation_type === 'appreciation';
                }
                // Fallback untuk data lama
                $type = strtolower($this->type ?? '');
                return str_contains($type, 'tanah') || str_contains($type, 'bangunan');
            }
        );
    }

    protected function assetAgeInYears(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->received_date 
                ? Carbon::parse($this->received_date)->diffInYears(Carbon::now()) 
                : 0
        );
    }

    protected function annualDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                $isAppreciating = $this->is_appreciating;

                // Custom rate
                if (!empty($this->custom_depreciation_rate)) {
                    return ($this->purchase_price * $this->custom_depreciation_rate / 100);
                }

                // Formula
                $activeFormula = $isAppreciating
                    ? DepreciationFormula::getActiveAppreciationFormula()
                    : DepreciationFormula::getActiveDepreciationFormula();

                if (!$activeFormula) {
                    return 0;
                }

                $price = $this->purchase_price ?: 0;
                $salvage = $this->salvage_value ?: 0;
                $life = $this->useful_life ?: 1;
                $age = $this->asset_age_in_years ?: 0;

                $expression = str_replace(
                    ['{price}', '{salvage}', '{life}', '{age}'],
                    [$price, $salvage, $life, $age],
                    $activeFormula->expression
                );

                try {
                    return eval("return $expression;");
                } catch (\Throwable $e) {
                    return 0;
                }
            }
        );
    }

    protected function accumulatedDepreciation(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->current_book_value !== null) {
                    return $this->purchase_price - $this->current_book_value;
                }
                
                $totalPossibleDepreciation = $this->asset_age_in_years * $this->annual_depreciation;
                $depreciableCost = $this->purchase_price - $this->salvage_value;
                
                if ($depreciableCost < 0) return 0;
                
                return min($totalPossibleDepreciation, $depreciableCost);
            }
        );
    }

    protected function bookValue(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->current_book_value !== null) {
                    return $this->current_book_value;
                }
                
                return max(0, $this->purchase_price - $this->accumulated_depreciation);
            }
        );
    }
}
```

### **Model: DepreciationFormula.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepreciationFormula extends Model
{
    protected $fillable = ['name', 'expression', 'is_active', 'description', 'type'];

    public static $allowedVariables = [
        '{price}' => 'Harga Beli',
        '{salvage}' => 'Nilai Sisa',
        '{life}' => 'Umur Manfaat (Tahun)',
        '{age}' => 'Umur Aset Saat Ini (Tahun)',
    ];

    public static function getActiveDepreciationFormula()
    {
        return self::where('is_active', true)
                   ->where('type', 'depreciation')
                   ->first();
    }

    public static function getActiveAppreciationFormula()
    {
        return self::where('is_active', true)
                   ->where('type', 'appreciation')
                   ->first();
    }
}
```

### **Model: Notification.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'title', 'message', 'type', 'action_data', 'is_read'
    ];

    protected $casts = [
        'action_data' => 'array',
        'is_read' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}
```

---

## 🎮 CONTROLLERS

### **AssetController.php - Core Logic**

**Method: `store()` - Create Asset dengan Auto-Calculation**

```php
public function store(Request $request): RedirectResponse
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'room_name' => 'nullable|string|max:255',
        'location' => 'nullable|string|max:255',
        'floor' => 'nullable|string|max:255',
        'received_date' => 'nullable|date',
        'purchase_price' => 'required|numeric|min:0',
        'useful_life' => 'required|integer|min:1',
        'salvage_value' => 'required|numeric|min:0',
        'type' => 'nullable|string|max:255',
        'depreciation_type' => 'required|in:depreciation,appreciation',
        'custom_depreciation_rate' => 'nullable|numeric|min:0|max:100',
        // ... fields lainnya
    ]);

    // Auto-generate kode
    $validatedData['asset_code'] = $this->nextSequentialCode('asset_code', 'AKT');
    $validatedData['unit_code'] = $this->nextSequentialCode('unit_code', 'SAT');

    // DUAL CALCULATION #1: Calculate on create
    $currentBookValue = $validatedData['purchase_price'];
    $lastDepreciationDate = null;
    $notificationMessage = null;

    if (!empty($validatedData['received_date'])) {
        $receivedDate = Carbon::parse($validatedData['received_date'])->startOfDay();
        $today = now()->startOfDay();
        $ageYears = $this->calculateAgeInYears($receivedDate, $today);

        if ($ageYears > 0) {
            $isAppreciating = $validatedData['depreciation_type'] === 'appreciation';
            $annualChange = null;

            // Custom rate atau formula?
            if (!empty($validatedData['custom_depreciation_rate'])) {
                $customRate = $validatedData['custom_depreciation_rate'];
                $annualChange = ($validatedData['purchase_price'] * $customRate / 100) * $ageYears;
            } else {
                $formula = $isAppreciating
                    ? DepreciationFormula::getActiveAppreciationFormula()
                    : DepreciationFormula::getActiveDepreciationFormula();

                if ($formula) {
                    $annualChange = $this->evaluateExpression($formula->expression, [
                        '{price}' => $validatedData['purchase_price'] ?: 0,
                        '{salvage}' => $validatedData['salvage_value'] ?: 0,
                        '{life}' => max(1, $validatedData['useful_life']),
                        '{age}' => $ageYears,
                    ]);
                }
            }

            if ($annualChange !== null) {
                $delta = abs($annualChange);

                if ($isAppreciating) {
                    $currentBookValue = $validatedData['purchase_price'] + $delta;
                } else {
                    $floor = $validatedData['salvage_value'] ?? 0;
                    $currentBookValue = max($floor, $validatedData['purchase_price'] - $delta);
                }

                $currentBookValue = round($currentBookValue, 2);
                
                // PENTING: Set last_depreciation_date = NULL
                // Biar scheduler bisa proses di anniversary
                $lastDepreciationDate = null;

                $notificationMessage = "Nilai aset '{$validatedData['name']}' telah dihitung...";
            }
        }
    }

    $validatedData['current_book_value'] = $currentBookValue;
    $validatedData['last_depreciation_date'] = $lastDepreciationDate;

    // Upload foto
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('asset-photos', 'public');
        $validatedData['photo'] = $path;
    }

    $asset = Asset::create($validatedData);

    // Activity log
    $this->logActivity('asset.created', $asset->id, $asset->name, ...);

    // Notifikasi
    if ($notificationMessage) {
        NotificationService::notifyAdmins(
            'Aset Baru Ditambahkan dengan Perhitungan Depresiasi',
            $notificationMessage,
            'info',
            ['asset_id' => $asset->id, ...]
        );
    }

    return redirect()->route('assets.index')
                     ->with('message', 'Aset berhasil ditambahkan.');
}
```

**Helper Methods:**

```php
// Generate sequential code
private function nextSequentialCode(string $field, string $prefix): string
{
    $lastAsset = Asset::orderBy('id', 'desc')->first();
    $lastNumber = $lastAsset ? intval(substr($lastAsset->{$field}, strlen($prefix) + 1)) : 0;
    return $prefix . '-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
}

// Calculate age with decimal precision
private function calculateAgeInYears(Carbon $receivedDate, Carbon $today): float
{
    $totalDays = $receivedDate->diffInDays($today);
    return $totalDays / 365.25; // Pro-rata calculation
}

// Evaluate formula expression
private function evaluateExpression(string $expression, array $variables): ?float
{
    $built = str_replace(array_keys($variables), array_values($variables), $expression);
    
    try {
        return (float) eval("return {$built};");
    } catch (\Throwable $e) {
        return null;
    }
}

// Activity logging
private function logActivity(string $action, int $assetId, string $assetName, ...)
{
    ActivityLog::create([
        'user_id' => Auth::id(),
        'action' => $action,
        'asset_id' => $assetId,
        'details' => json_encode($details),
    ]);
}
```

### **FormulaController.php - Formula Management**

```php
public function activate(DepreciationFormula $formula)
{
    // Deactivate semua formula dengan tipe yang sama
    DepreciationFormula::where('type', $formula->type)
                       ->update(['is_active' => false]);
    
    // Activate yang dipilih
    $formula->update(['is_active' => true]);

    // RECALCULATE semua aset
    $this->recalculateAllAssets($formula);

    return redirect()->back()
                     ->with('message', 'Rumus diaktifkan dan semua aset telah dihitung ulang.');
}

private function recalculateAllAssets(DepreciationFormula $formula)
{
    $today = now()->startOfDay();
    $processed = 0;
    $isDepreciationFormula = $formula->type === 'depreciation';

    // Query aset sesuai tipe
    $query = Asset::whereNotNull('received_date');
    
    if ($isDepreciationFormula) {
        $query->where('depreciation_type', 'depreciation');
    } else {
        $query->where('depreciation_type', 'appreciation');
    }

    $query->chunkById(100, function ($assets) use ($formula, $today, &$processed) {
        foreach ($assets as $asset) {
            // Skip aset dengan custom rate
            if (!empty($asset->custom_depreciation_rate)) {
                continue;
            }
            
            $receivedDate = Carbon::parse($asset->received_date)->startOfDay();
            $ageYears = $this->calculateAgeInYears($receivedDate, $today);
            
            $annualChange = $this->evaluateExpression($formula->expression, [
                '{price}' => $asset->purchase_price ?: 0,
                '{salvage}' => $asset->salvage_value ?: 0,
                '{life}' => max(1, $asset->useful_life),
                '{age}' => $ageYears,
            ]);

            if ($annualChange === null) continue;

            $currentValue = $asset->current_book_value ?? $asset->purchase_price;
            
            // Cek apakah formula pakai {age}
            $formulaUsesAge = str_contains($formula->expression, '{age}');
            
            if ($asset->is_appreciating) {
                $newValue = $formulaUsesAge 
                    ? $asset->purchase_price + abs($annualChange)
                    : $asset->purchase_price + (abs($annualChange) * $ageYears);
            } else {
                $floor = $asset->salvage_value ?? 0;
                $newValue = $formulaUsesAge
                    ? max($floor, $asset->purchase_price - abs($annualChange))
                    : max($floor, $asset->purchase_price - (abs($annualChange) * $ageYears));
            }

            $newValue = round($newValue, 2);

            $asset->forceFill(['current_book_value' => $newValue])->save();

            // Update history
            $changeAmount = $newValue - $currentValue;
            $changeSigned = $asset->is_appreciating ? -abs($changeAmount) : abs($changeAmount);
            
            DepreciationHistory::updateOrCreate(
                ['asset_id' => $asset->id, 'year' => $today->year],
                [
                    'book_value_start' => $currentValue,
                    'depreciation_value' => $changeSigned,
                    'book_value_end' => $newValue,
                ]
            );

            $processed++;
        }
    });

    // Notifikasi
    if ($processed > 0) {
        NotificationService::notifyAdmins(
            'Rumus Baru Diaktifkan - Aset Dihitung Ulang',
            "Rumus '{$formula->name}' telah diaktifkan. Total {$processed} aset telah dihitung ulang...",
            'success',
            ['formula_id' => $formula->id, ...]
        );
    }
}
```

### **DashboardController.php**

```php
public function index()
{
    $totalAssets = Asset::count();
    $totalPurchaseValue = Asset::sum('purchase_price');
    $totalCurrentValue = Asset::sum('current_book_value');
    $totalAccumulatedDepreciation = $totalPurchaseValue - $totalCurrentValue;

    $assetsByType = Asset::select('type', DB::raw('count(*) as count'))
                         ->groupBy('type')
                         ->get();

    $assetsByLocation = Asset::select('location', DB::raw('count(*) as count'))
                             ->whereNotNull('location')
                             ->groupBy('location')
                             ->get();

    $latestAssets = Asset::latest()->take(10)->get();

    return Inertia::render('dashboard', [
        'stats' => [
            'totalAssets' => $totalAssets,
            'totalPurchaseValue' => $totalPurchaseValue,
            'totalCurrentValue' => $totalCurrentValue,
            'totalAccumulatedDepreciation' => $totalAccumulatedDepreciation,
        ],
        'assetsByType' => $assetsByType,
        'assetsByLocation' => $assetsByLocation,
        'latestAssets' => $latestAssets,
    ]);
}
```

---

## 🔔 SERVICES

### **NotificationService.php**

```php
<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Kirim notifikasi ke semua admin dan superadmin
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
     * Kirim notifikasi ke user spesifik
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

    public static function getUserNotifications(int $userId, int $limit = 10)
    {
        return Notification::forUser($userId)
                          ->orderBy('is_read', 'asc')
                          ->orderByDesc('created_at')
                          ->take($limit)
                          ->get();
    }

    public static function getUnreadCount(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    public static function markAllAsRead(int $userId): void
    {
        Notification::forUser($userId)->unread()->update(['is_read' => true]);
    }
}
```

---

## ⚙️ COMMANDS & SCHEDULER

### **Command: RunAssetDepreciation.php**

**Lokasi:** `app/Console/Commands/RunAssetDepreciation.php`

**Fungsi:** DUAL CALCULATION #2 - Annual depreciation pada anniversary date

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
    protected $description = 'Hitung dan perbarui nilai aset pada tanggal anniversary';

    public function handle(): int
    {
        $today = now()->startOfDay();
        $processed = 0;

        $activeDepreciationFormula = DepreciationFormula::getActiveDepreciationFormula();
        $activeAppreciationFormula = DepreciationFormula::getActiveAppreciationFormula();

        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(200, function ($assets) use ($today, $activeDepreciationFormula, $activeAppreciationFormula, &$processed) {
                foreach ($assets as $asset) {
                    $purchaseDate = Carbon::parse($asset->received_date)->startOfDay();

                    // Belum 1 tahun sejak pembelian
                    if ($today->lt($purchaseDate->copy()->addYear())) {
                        continue;
                    }

                    // Cari anniversary date berikutnya
                    $yearsSincePurchase = $purchaseDate->diffInYears($today);
                    $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase);
                    
                    if ($today->lt($nextAnniversary)) {
                        $nextAnniversary = $purchaseDate->copy()->addYears($yearsSincePurchase - 1);
                    }

                    // Cek apakah perlu diproses
                    $shouldProcess = false;
                    
                    if ($asset->last_depreciation_date === null) {
                        $shouldProcess = true;
                    } else {
                        $lastProcessedDate = Carbon::parse($asset->last_depreciation_date)->startOfDay();
                        // FIX: today >= anniversary AND anniversary > last_processed
                        if ($today->gte($nextAnniversary) && $nextAnniversary->gt($lastProcessedDate)) {
                            $shouldProcess = true;
                        }
                    }
                    
                    if (!$shouldProcess) {
                        continue;
                    }

                    $isAppreciating = $asset->is_appreciating;
                    
                    // Custom rate atau formula?
                    if (!empty($asset->custom_depreciation_rate)) {
                        $ageYears = $this->calculateAgeInYears($purchaseDate, $today);
                        $annualChange = ($asset->purchase_price * $asset->custom_depreciation_rate / 100);
                    } else {
                        $formula = $isAppreciating ? $activeAppreciationFormula : $activeDepreciationFormula;

                        if (!$formula) {
                            $this->warn("Tidak ada rumus aktif untuk aset #{$asset->id}");
                            continue;
                        }

                        $ageYears = $this->calculateAgeInYears($purchaseDate, $today);
                        $annualChange = $this->evaluateExpression($formula->expression, [
                            '{price}' => $asset->purchase_price ?: 0,
                            '{salvage}' => $asset->salvage_value ?: 0,
                            '{life}' => max(1, $asset->useful_life),
                            '{age}' => $ageYears,
                        ]);
                    }

                    if ($annualChange === null) {
                        $this->warn("Rumus gagal dievaluasi untuk aset #{$asset->id}");
                        continue;
                    }

                    $currentValue = $asset->current_book_value ?? $asset->purchase_price;
                    $delta = abs($annualChange);

                    if ($isAppreciating) {
                        $newValue = $currentValue + $delta;
                    } else {
                        $floor = $asset->salvage_value ?? 0;
                        $newValue = max($floor, $currentValue - $delta);
                    }

                    $newValue = round($newValue, 2);
                    $changeSigned = $isAppreciating ? -$delta : $delta;

                    // Update history
                    DepreciationHistory::updateOrCreate(
                        ['asset_id' => $asset->id, 'year' => $today->year],
                        [
                            'book_value_start' => $currentValue,
                            'depreciation_value' => $changeSigned,
                            'book_value_end' => $newValue,
                        ]
                    );

                    // Update asset
                    $asset->forceFill([
                        'current_book_value' => $newValue,
                        'last_depreciation_date' => $nextAnniversary->toDateString(),
                    ])->save();

                    // Notifikasi
                    NotificationService::notifyAdmins(
                        'Perhitungan Ulang Nilai Aset (Anniversary)',
                        "Nilai aset '{$asset->name}' (kode: {$asset->asset_code}) telah dihitung ulang pada anniversary date...",
                        'info',
                        [
                            'asset_id' => $asset->id,
                            'previous_value' => $currentValue,
                            'current_value' => $newValue,
                            'anniversary_date' => $nextAnniversary->toDateString(),
                        ]
                    );

                    $this->info("✓ Aset #{$asset->id} ({$asset->name}) - Anniversary: Rp " . number_format($currentValue) . " → Rp " . number_format($newValue));
                    $processed++;
                }
            });

        if ($processed > 0) {
            $this->info("✓ Total {$processed} aset berhasil diperbarui.");
            Cache::put('depreciation_last_run_' . now()->toDateString(), now(), now()->endOfDay());
        } else {
            $this->info("ℹ Tidak ada aset yang perlu diperbarui hari ini.");
            Cache::put('depreciation_last_run_' . now()->toDateString(), now(), now()->endOfDay());
        }

        return Command::SUCCESS;
    }

    private function calculateAgeInYears(Carbon $receivedDate, Carbon $today): float
    {
        $totalDays = $receivedDate->diffInDays($today);
        return $totalDays / 365.25;
    }

    private function evaluateExpression(string $expression, array $variables): ?float
    {
        $built = str_replace(array_keys($variables), array_values($variables), $expression);

        try {
            return (float) eval("return {$built};");
        } catch (\Throwable $e) {
            return null;
        }
    }
}
```

### **Scheduler Setup**

**File:** `app/Console/Kernel.php`

```php
protected function schedule(Schedule $schedule): void
{
    // Run depreciation setiap hari jam 00:01 WIB
    $schedule->command('assets:run-depreciation')
             ->dailyAt('00:01')
             ->timezone('Asia/Jakarta');
}
```

### **Hybrid Fallback System**

**File:** `app/Providers/AppServiceProvider.php`

```php
public function boot(): void
{
    if ($this->app->runningInConsole()) {
        $this->commands([
            \App\Console\Commands\RunAssetDepreciation::class,
            \App\Console\Commands\RecalculateAssetValues::class,
            \App\Console\Commands\RecordDepreciationHistory::class,
        ]);
    }

    // HYBRID SYSTEM: Fallback auto-depreciation
    $this->runDepreciationFallback();
}

private function runDepreciationFallback(): void
{
    try {
        $cacheKey = 'depreciation_last_run_' . now()->toDateString();

        // Cek cache: Apakah scheduler sudah run?
        if (Cache::has($cacheKey)) {
            return; // Sudah run, skip
        }

        $today = now()->startOfDay();

        // Pre-check: Apakah ada aset yang perlu diproses?
        $needsProcessing = Asset::whereNotNull('received_date')
            ->where(function ($query) use ($today) {
                $query->whereNull('last_depreciation_date')
                      ->orWhereRaw('DATE_ADD(received_date, INTERVAL 1 YEAR) <= ?', [$today->toDateString()]);
            })
            ->exists();

        if (!$needsProcessing) {
            Cache::put($cacheKey, now(), now()->endOfDay());
            return;
        }

        // Ada yang perlu diproses, jalankan fallback
        $processed = 0;
        
        Asset::whereNotNull('received_date')
            ->orderBy('id')
            ->chunkById(100, function ($assets) use (&$processed, $today) {
                foreach ($assets as $asset) {
                    if ($this->processAsset($asset, $today)) {
                        $processed++;
                    }
                }
            });

        Cache::put($cacheKey, now(), now()->endOfDay());

        if ($processed > 0) {
            \Log::info("Fallback depreciation executed: {$processed} assets updated");
        }

    } catch (\Exception $e) {
        \Log::error('Fallback depreciation error: ' . $e->getMessage());
    }
}

private function processAsset($asset, $today): bool
{
    // Same logic as RunAssetDepreciation command
    // ... (kode yang sama dengan command)
}
```

---

## 🛣️ ROUTES & MIDDLEWARE

### **routes/web.php**

```php
<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormulaController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified', 'has.role'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin & SuperAdmin only
    Route::middleware('role:superadmin,admin')->group(function () {
        // Assets
        Route::get('assets', [AssetController::class, 'index'])->name('assets.index');
        Route::get('assets/create', [AssetController::class, 'create'])->name('assets.create');
        Route::post('assets', [AssetController::class, 'store'])->name('assets.store');
        Route::get('assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
        Route::get('assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
        Route::put('assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
        Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
        Route::post('assets/import', [AssetController::class, 'import'])->name('assets.import');

        // Formulas
        Route::get('formulas', [FormulaController::class, 'index'])->name('formulas.index');
        Route::post('formulas', [FormulaController::class, 'store'])->name('formulas.store');
        Route::post('formulas/{formula}/activate', [FormulaController::class, 'activate'])->name('formulas.activate');
        Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])->name('formulas.destroy');
        Route::get('calculator', [FormulaController::class, 'calculator'])->name('calculator.index');
    });

    // All authenticated users (view reports)
    Route::middleware('role:superadmin,admin,user')->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/export/excel', [ReportController::class, 'exportExcel'])->name('reports.export.excel');
        Route::get('reports/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });

    // SuperAdmin only
    Route::middleware('role:superadmin')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Settings & Notifications (all users)
    Route::get('settings', [SettingsController::class, 'show'])->name('settings.show');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});
```

### **Middleware: HasRole.php**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HasRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user || !$user->hasAnyRole($roles)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

### **User Model - hasAnyRole() Method**

```php
public function hasAnyRole(array $roles): bool
{
    return $this->roles()->whereIn('name', $roles)->exists();
}

public function hasRole(string $role): bool
{
    return $this->roles()->where('name', $role)->exists();
}

public function roles()
{
    return $this->belongsToMany(Role::class);
}
```

---

## 🧪 TESTING

### **Setup Testing**

```bash
# Install PHPUnit (sudah include di Laravel)
composer require --dev phpunit/phpunit

# Atau gunakan Pest
composer require --dev pestphp/pest pestphp/pest-plugin-laravel
```

### **Unit Test Example: AssetTest.php**

```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Asset;
use App\Models\DepreciationFormula;
use Carbon\Carbon;

class AssetTest extends TestCase
{
    public function test_asset_age_calculation()
    {
        $asset = Asset::factory()->create([
            'received_date' => Carbon::now()->subYears(2),
        ]);

        $this->assertEquals(2, $asset->asset_age_in_years);
    }

    public function test_depreciation_calculation_with_straight_line()
    {
        DepreciationFormula::create([
            'name' => 'Straight-Line',
            'expression' => '({price} - {salvage}) / {life}',
            'type' => 'depreciation',
            'is_active' => true,
        ]);

        $asset = Asset::factory()->create([
            'purchase_price' => 10000,
            'salvage_value' => 1000,
            'useful_life' => 5,
            'depreciation_type' => 'depreciation',
            'received_date' => Carbon::now(),
        ]);

        $expectedAnnual = (10000 - 1000) / 5; // 1800
        $this->assertEquals(1800, $asset->annual_depreciation);
    }

    public function test_appreciation_asset()
    {
        DepreciationFormula::create([
            'name' => 'Appreciation 5%',
            'expression' => '{price} * 0.05',
            'type' => 'appreciation',
            'is_active' => true,
        ]);

        $asset = Asset::factory()->create([
            'purchase_price' => 100000,
            'depreciation_type' => 'appreciation',
        ]);

        $this->assertTrue($asset->is_appreciating);
        $this->assertEquals(5000, $asset->annual_depreciation);
    }
}
```

### **Feature Test Example: AssetControllerTest.php**

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Asset;
use App\Models\Role;

class AssetControllerTest extends TestCase
{
    public function test_admin_can_create_asset()
    {
        $admin = User::factory()->create();
        $adminRole = Role::create(['name' => 'admin', 'display_name' => 'Admin']);
        $admin->roles()->attach($adminRole);

        $response = $this->actingAs($admin)->post(route('assets.store'), [
            'name' => 'Test Asset',
            'purchase_price' => 10000,
            'useful_life' => 5,
            'salvage_value' => 1000,
            'status' => 'Aktif',
            'quantity' => 1,
            'depreciation_type' => 'depreciation',
        ]);

        $response->assertRedirect(route('assets.index'));
        $this->assertDatabaseHas('assets', ['name' => 'Test Asset']);
    }

    public function test_user_cannot_create_asset()
    {
        $user = User::factory()->create();
        $userRole = Role::create(['name' => 'user', 'display_name' => 'User']);
        $user->roles()->attach($userRole);

        $response = $this->actingAs($user)->get(route('assets.create'));

        $response->assertStatus(403);
    }
}
```

### **Run Tests**

```bash
# PHPUnit
php artisan test

# Pest
./vendor/bin/pest

# Dengan coverage
php artisan test --coverage
```

---

## 📝 BEST PRACTICES

### **1. Security**

```php
// ✅ GOOD: Validation
$request->validate([
    'purchase_price' => 'required|numeric|min:0|max:999999999',
    'custom_depreciation_rate' => 'nullable|numeric|min:0|max:100',
]);

// ✅ GOOD: Authorization
$this->authorize('update', $asset);

// ✅ GOOD: Mass assignment protection
protected $fillable = ['name', 'purchase_price', ...];

// ❌ BAD: No validation
$asset = Asset::create($request->all()); // Dangerous!
```

### **2. Database Queries**

```php
// ✅ GOOD: Eager loading
$assets = Asset::with('depreciationHistories')->get();

// ❌ BAD: N+1 problem
$assets = Asset::all();
foreach ($assets as $asset) {
    $asset->depreciationHistories; // Query setiap loop!
}

// ✅ GOOD: Chunking untuk data besar
Asset::chunkById(200, function ($assets) {
    foreach ($assets as $asset) {
        // Process
    }
});

// ❌ BAD: Load semua data sekaligus
$assets = Asset::all(); // Memory overflow!
```

### **3. Caching**

```php
// ✅ GOOD: Cache expensive queries
$stats = Cache::remember('dashboard_stats', 3600, function () {
    return [
        'total' => Asset::count(),
        'value' => Asset::sum('purchase_price'),
    ];
});

// ✅ GOOD: Clear cache when data changes
Asset::saved(function ($asset) {
    Cache::forget('dashboard_stats');
});
```

### **4. Error Handling**

```php
// ✅ GOOD: Try-catch untuk eval()
try {
    $result = eval("return {$expression};");
} catch (\Throwable $e) {
    \Log::error("Formula evaluation failed: {$e->getMessage()}");
    return 0;
}

// ✅ GOOD: Validation sebelum proses
if (!$formula) {
    $this->warn("No active formula found");
    continue;
}
```

### **5. Code Organization**

```php
// ✅ GOOD: Extract to methods
private function calculateAgeInYears(Carbon $date1, Carbon $date2): float
{
    return $date1->diffInDays($date2) / 365.25;
}

// ✅ GOOD: Use services for business logic
NotificationService::notifyAdmins($title, $message);

// ❌ BAD: Everything in controller
public function store(Request $request) {
    // 500 lines of code...
}
```

### **6. Performance**

```php
// ✅ GOOD: Select only needed columns
Asset::select('id', 'name', 'purchase_price')->get();

// ✅ GOOD: Use indexes
Schema::table('assets', function (Blueprint $table) {
    $table->index('asset_code');
    $table->index('received_date');
});

// ✅ GOOD: Pagination
Asset::paginate(10);
```

---

## 🚨 TROUBLESHOOTING

### **Problem: Scheduler tidak jalan**

```bash
# Cek apakah scheduler terdaftar
php artisan schedule:list

# Test run manual
php artisan assets:run-depreciation

# Cek crontab (Linux)
crontab -l

# Cek Windows Task Scheduler
# GUI: Task Scheduler → YAMS Scheduler

# Fallback akan handle jika scheduler fail
# Cek log:
tail -f storage/logs/laravel.log | grep "Fallback"
```

### **Problem: Formula tidak ter-evaluate**

```bash
# Cek syntax formula
php artisan tinker
>>> $formula = App\Models\DepreciationFormula::find(1);
>>> $expression = str_replace('{price}', 10000, $formula->expression);
>>> eval("return {$expression};");

# Pastikan variabel dalam kurung kurawal
✅ GOOD: ({price} - {salvage}) / {life}
❌ BAD: (price - salvage) / life
```

### **Problem: Nilai aset tidak update**

```bash
# Cek last_depreciation_date
php artisan tinker
>>> Asset::find(1)->last_depreciation_date

# Cek apakah sudah waktunya (anniversary)
# Manual recalculate:
php artisan assets:recalculate

# Clear cache:
php artisan cache:clear
```

### **Problem: Notifikasi tidak muncul**

```bash
# Cek apakah user punya role admin
php artisan tinker
>>> User::find(1)->roles->pluck('name')

# Test kirim notifikasi:
>>> App\Services\NotificationService::notifyAdmins('Test', 'Test message', 'info');

# Cek database:
>>> App\Models\Notification::latest()->first()
```

---

## 📚 REFERENSI

- **Laravel Documentation**: https://laravel.com/docs/12.x
- **Inertia.js**: https://inertiajs.com/
- **Laravel Fortify**: https://laravel.com/docs/12.x/fortify
- **DomPDF**: https://github.com/barryvdh/laravel-dompdf
- **Laravel Excel**: https://laravel-excel.com/

---

## 🎓 TIPS PENGEMBANGAN

1. **Gunakan Laravel Debugbar** untuk development:
   ```bash
   composer require barryvdh/laravel-debugbar --dev
   ```

2. **Setup logging yang baik**:
   ```php
   \Log::channel('depreciation')->info("Asset {$asset->id} updated");
   ```

3. **Gunakan Database Transactions** untuk operasi critical:
   ```php
   DB::transaction(function () use ($asset, $newValue) {
       $asset->update(['current_book_value' => $newValue]);
       DepreciationHistory::create([...]);
   });
   ```

4. **Backup database secara berkala**:
   ```bash
   php artisan db:backup
   ```

5. **Monitor performance**:
   ```bash
   php artisan telescope:install # Laravel Telescope
   ```

---

**Dibuat dengan ❤️ untuk YAMS Development Team**  
**Last Updated: 17 Januari 2026**
