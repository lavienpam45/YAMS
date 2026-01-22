import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';

interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    created_at: string;
}

// Fungsi untuk mengambil XSRF token dari cookie (lebih reliable dari meta tag)
function getXsrfToken(): string {
    const regex = /XSRF-TOKEN=([^;]+)/;
    const match = regex.exec(document.cookie);
    if (match) {
        return decodeURIComponent(match[1]);
    }
    // Fallback ke meta tag
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

// Format waktu
function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}j lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}h lalu`;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [actionInProgress, setActionInProgress] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load notifications
    async function loadNotifications() {
        try {
            const response = await fetch('/notifications', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial load dan polling
    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 3000);
        return () => clearInterval(interval);
    }, []);

    // Mark as read handler
    async function onMarkAsRead(id: number) {
        if (actionInProgress) return;
        setActionInProgress(true);

        try {
            const token = getXsrfToken();
            
            const response = await fetch(`/notifications/${id}/mark-as-read`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': token,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                setUnreadCount(data.unread_count ?? 0);
            } else {
                console.error('Failed:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setActionInProgress(false);
        }
    }

    // Delete handler
    async function onDelete(id: number) {
        if (actionInProgress) return;
        setActionInProgress(true);

        try {
            const token = getXsrfToken();
            
            const response = await fetch(`/notifications/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': token,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(prev => prev.filter(n => n.id !== id));
                setUnreadCount(data.unread_count ?? 0);
            } else {
                console.error('Failed:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setActionInProgress(false);
        }
    }

    // Mark all as read handler
    async function onMarkAllAsRead() {
        if (actionInProgress) return;
        setActionInProgress(true);

        try {
            const token = getXsrfToken();
            const response = await fetch('/notifications/mark-all-as-read', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': token,
                },
            });

            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            } else {
                console.error('Mark all failed:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setActionInProgress(false);
        }
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Bell Button */}
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <BellIcon className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={() => onMarkAllAsRead()}
                                disabled={actionInProgress}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-gray-100 border-l-4 ${
                                        notif.is_read ? 'border-l-gray-200 bg-gray-50' : 'border-l-blue-500 bg-blue-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">{formatTime(notif.created_at)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notif.is_read && (
                                                <button
                                                    type="button"
                                                    onClick={() => onMarkAsRead(notif.id)}
                                                    disabled={actionInProgress}
                                                    className="p-1.5 rounded hover:bg-white text-gray-500 hover:text-green-600 disabled:opacity-50"
                                                    title="Tandai dibaca"
                                                >
                                                    <CheckIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => onDelete(notif.id)}
                                                disabled={actionInProgress}
                                                className="p-1.5 rounded hover:bg-white text-gray-500 hover:text-red-600 disabled:opacity-50"
                                                title="Hapus"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
