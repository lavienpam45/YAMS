<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Ambil notifikasi untuk user yang login
     */
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

    /**
     * Mark notifikasi sebagai sudah dibaca
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('view', $notification);

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notifikasi sudah dibaca',
            'unread_count' => NotificationService::getUnreadCount(Auth::id()),
        ]);
    }

    /**
     * Mark semua notifikasi sebagai sudah dibaca
     */
    public function markAllAsRead(): JsonResponse
    {
        NotificationService::markAllAsRead(Auth::id());

        return response()->json([
            'message' => 'Semua notifikasi sudah dibaca',
            'unread_count' => 0,
        ]);
    }

    /**
     * Hapus notifikasi
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        $notification->delete();

        return response()->json([
            'message' => 'Notifikasi dihapus',
            'unread_count' => NotificationService::getUnreadCount(Auth::id()),
        ]);
    }
}
