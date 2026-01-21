<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'backup:run {--type=all : Type of backup (database, files, all)}';

    /**
     * The console command description.
     */
    protected $description = 'Backup database dan file penting YAMS';

    /**
     * Konfigurasi backup
     */
    protected $maxBackups = 7; // Simpan maksimal 7 backup terakhir
    protected $backupPath = 'backups';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');

        $this->info('🔄 Memulai proses backup YAMS...');
        $this->newLine();

        try {
            // Pastikan folder backup ada
            $this->ensureBackupDirectoryExists();

            if ($type === 'database' || $type === 'all') {
                $this->backupDatabase($timestamp);
            }

            if ($type === 'files' || $type === 'all') {
                $this->backupFiles($timestamp);
            }

            // Hapus backup lama
            $this->cleanOldBackups();

            $this->newLine();
            $this->info('✅ Backup selesai!');

            Log::info('Backup YAMS berhasil', [
                'type' => $type,
                'timestamp' => $timestamp,
            ]);

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Backup gagal: ' . $e->getMessage());

            Log::error('Backup YAMS gagal', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return Command::FAILURE;
        }
    }

    /**
     * Backup database MySQL
     */
    protected function backupDatabase(string $timestamp): void
    {
        $this->info('📦 Backup database...');

        $dbHost = config('database.connections.mysql.host');
        $dbPort = config('database.connections.mysql.port', 3306);
        $dbName = config('database.connections.mysql.database');
        $dbUser = config('database.connections.mysql.username');
        $dbPass = config('database.connections.mysql.password');

        $filename = "database_{$timestamp}.sql";
        $backupFullPath = storage_path("app/{$this->backupPath}/{$filename}");

        // Gunakan mysqldump untuk backup
        $command = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password=%s %s > %s',
            escapeshellarg($dbHost),
            escapeshellarg($dbPort),
            escapeshellarg($dbUser),
            escapeshellarg($dbPass),
            escapeshellarg($dbName),
            escapeshellarg($backupFullPath)
        );

        // Eksekusi command
        $result = null;
        $output = [];
        exec($command . ' 2>&1', $output, $result);

        if ($result !== 0) {
            // Jika mysqldump gagal, gunakan metode PHP alternatif
            $this->warn('   mysqldump tidak tersedia, menggunakan metode alternatif...');
            $this->backupDatabaseAlternative($timestamp);
            return;
        }

        // Kompresi file SQL
        $this->compressFile($backupFullPath);

        $size = $this->formatBytes(filesize($backupFullPath . '.gz'));
        $this->info("   ✓ Database backup: {$filename}.gz ({$size})");

        // Hapus file SQL asli setelah dikompresi
        if (file_exists($backupFullPath)) {
            unlink($backupFullPath);
        }
    }

    /**
     * Backup database menggunakan metode PHP (alternatif jika mysqldump tidak ada)
     */
    protected function backupDatabaseAlternative(string $timestamp): void
    {
        $filename = "database_{$timestamp}.sql";
        $backupFullPath = storage_path("app/{$this->backupPath}/{$filename}");

        $tables = \DB::select('SHOW TABLES');
        $dbName = config('database.connections.mysql.database');
        $tableKey = "Tables_in_{$dbName}";

        $sql = "-- YAMS Database Backup\n";
        $sql .= "-- Generated: " . Carbon::now()->toDateTimeString() . "\n";
        $sql .= "-- Database: {$dbName}\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            // Get create table statement
            $createTable = \DB::select("SHOW CREATE TABLE `{$tableName}`");
            $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
            $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

            // Get table data
            $rows = \DB::table($tableName)->get();

            if ($rows->count() > 0) {
                $columns = array_keys((array) $rows->first());
                $columnList = '`' . implode('`, `', $columns) . '`';

                foreach ($rows->chunk(100) as $chunk) {
                    $values = [];
                    foreach ($chunk as $row) {
                        $rowValues = array_map(function ($value) {
                            if ($value === null) {
                                return 'NULL';
                            }
                            return "'" . addslashes($value) . "'";
                        }, (array) $row);
                        $values[] = '(' . implode(', ', $rowValues) . ')';
                    }
                    $sql .= "INSERT INTO `{$tableName}` ({$columnList}) VALUES\n" . implode(",\n", $values) . ";\n\n";
                }
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        file_put_contents($backupFullPath, $sql);

        // Kompresi
        $this->compressFile($backupFullPath);

        $size = $this->formatBytes(filesize($backupFullPath . '.gz'));
        $this->info("   ✓ Database backup (PHP method): {$filename}.gz ({$size})");

        // Hapus file SQL asli
        if (file_exists($backupFullPath)) {
            unlink($backupFullPath);
        }
    }

    /**
     * Backup file uploads dan konfigurasi penting
     */
    protected function backupFiles(string $timestamp): void
    {
        $this->info('📁 Backup files...');

        $filename = "files_{$timestamp}.zip";
        $backupFullPath = storage_path("app/{$this->backupPath}/{$filename}");

        $zip = new \ZipArchive();

        if ($zip->open($backupFullPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Tidak dapat membuat file ZIP');
        }

        // Backup folder uploads jika ada
        $uploadPath = storage_path('app/public');
        if (is_dir($uploadPath)) {
            $this->addFolderToZip($zip, $uploadPath, 'uploads');
        }

        // Backup .env file (tanpa password sensitif)
        $envPath = base_path('.env');
        if (file_exists($envPath)) {
            $envContent = file_get_contents($envPath);
            // Mask sensitive data
            $envContent = preg_replace('/^(.*PASSWORD.*)=(.*)$/m', '$1=***MASKED***', $envContent);
            $envContent = preg_replace('/^(.*SECRET.*)=(.*)$/m', '$1=***MASKED***', $envContent);
            $envContent = preg_replace('/^(.*KEY.*)=(.*)$/m', '$1=***MASKED***', $envContent);
            $zip->addFromString('config/.env.backup', $envContent);
        }

        $zip->close();

        $size = $this->formatBytes(filesize($backupFullPath));
        $this->info("   ✓ Files backup: {$filename} ({$size})");
    }

    /**
     * Tambahkan folder ke ZIP secara rekursif
     */
    protected function addFolderToZip(\ZipArchive $zip, string $folder, string $zipPath): void
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($folder),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = $zipPath . '/' . substr($filePath, strlen($folder) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
    }

    /**
     * Kompresi file menggunakan gzip
     */
    protected function compressFile(string $filePath): void
    {
        $gzFile = $filePath . '.gz';

        $fp = fopen($filePath, 'rb');
        $gz = gzopen($gzFile, 'wb9');

        while (!feof($fp)) {
            gzwrite($gz, fread($fp, 524288)); // 512KB chunks
        }

        fclose($fp);
        gzclose($gz);
    }

    /**
     * Pastikan direktori backup ada
     */
    protected function ensureBackupDirectoryExists(): void
    {
        $path = storage_path("app/{$this->backupPath}");

        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }

        // Buat .gitignore agar backup tidak ter-commit
        $gitignore = $path . '/.gitignore';
        if (!file_exists($gitignore)) {
            file_put_contents($gitignore, "*\n!.gitignore\n");
        }
    }

    /**
     * Hapus backup lama (keep last N backups)
     */
    protected function cleanOldBackups(): void
    {
        $this->info('🧹 Membersihkan backup lama...');

        $path = storage_path("app/{$this->backupPath}");

        // Get all backup files
        $files = glob($path . '/*');

        // Sort by modification time (newest first)
        usort($files, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        // Group by type (database and files)
        $dbBackups = array_filter($files, fn($f) => str_contains(basename($f), 'database_'));
        $fileBackups = array_filter($files, fn($f) => str_contains(basename($f), 'files_'));

        // Keep only last N backups for each type
        $this->removeOldFiles(array_values($dbBackups), $this->maxBackups);
        $this->removeOldFiles(array_values($fileBackups), $this->maxBackups);

        $this->info("   ✓ Menyimpan {$this->maxBackups} backup terakhir untuk setiap tipe");
    }

    /**
     * Hapus file lama dari array
     */
    protected function removeOldFiles(array $files, int $keep): void
    {
        $toDelete = array_slice($files, $keep);

        foreach ($toDelete as $file) {
            if (is_file($file) && basename($file) !== '.gitignore') {
                unlink($file);
            }
        }
    }

    /**
     * Format bytes ke human readable
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
