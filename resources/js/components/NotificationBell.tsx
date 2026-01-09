import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    created_at: string;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = async () => {
        try {
            const response = await fetch(route('notifications.index'), {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (!response.ok) throw new Error(`Load failed: ${response.status}`);
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        // Poll setiap 30 detik
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(route('notifications.mark-as-read', notificationId), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            if (!response.ok) throw new Error(`Mark read failed: ${response.status}`);
            const data = await response.json();
            setUnreadCount(typeof data.unread_count === 'number' ? data.unread_count : unreadCount);
            setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (notificationId: number) => {
        try {
            const target = notifications.find((n) => n.id === notificationId);
            const response = await fetch(route('notifications.destroy', notificationId), {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            if (target && !target.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(route('notifications.mark-all-as-read'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            if (!response.ok) throw new Error(`Mark all read failed: ${response.status}`);
            const data = await response.json();
            setUnreadCount(typeof data.unread_count === 'number' ? data.unread_count : 0);
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getTypeTextColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'text-green-700';
            case 'warning':
                return 'text-yellow-700';
            case 'error':
                return 'text-red-700';
            default:
                return 'text-blue-700';
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins}m yang lalu`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h yang lalu`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d yang lalu`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <BellIcon className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-l-4 transition ${
                                        notification.is_read
                                            ? 'border-l-gray-200 bg-gray-50'
                                            : 'border-l-blue-500 bg-blue-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-sm">{notification.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">{formatTime(notification.created_at)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                                                    title="Tandai dibaca"
                                                >
                                                    <CheckIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
