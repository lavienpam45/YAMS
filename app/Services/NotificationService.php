<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    /**
     * Kirim notifikasi ke semua admin dan superadmin
     */
    public static function notifyAdmins(string $title, string $message, string $type = 'info', ?array $actionData = null): void
    {
        // Ambil semua user dengan role admin atau superadmin
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
    public static function notifyUser(int $userId, string $title, string $message, string $type = 'info', ?array $actionData = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'action_data' => $actionData,
        ]);
    }

    /**
     * Ambil notifikasi untuk user (unread first, then recent)
     */
    public static function getUserNotifications(int $userId, int $limit = 10): Collection
    {
        return Notification::forUser($userId)
            ->orderBy('is_read', 'asc')
            ->orderByDesc('created_at')
            ->take($limit)
            ->get();
    }

    /**
     * Hitung notifikasi belum dibaca untuk user
     */
    public static function getUnreadCount(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    /**
     * Mark all notifications as read untuk user
     */
    public static function markAllAsRead(int $userId): void
    {
        Notification::forUser($userId)->unread()->update(['is_read' => true]);
    }
}
