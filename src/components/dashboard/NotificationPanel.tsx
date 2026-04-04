"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Calendar, FileWarning, Package, X } from "lucide-react";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/notifications";

interface Notification {
    id: string;
    type: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

interface NotificationPanelProps {
    notifications: Notification[];
    bandId: string;
}

const typeIcons: Record<string, any> = {
    GIG_UPCOMING: Calendar,
    DOC_EXPIRING: FileWarning,
    STOCK_ZERO: Package,
};

const typeColors: Record<string, string> = {
    GIG_UPCOMING: "bg-blue-100 text-blue-600 dark:bg-blue-950/30",
    DOC_EXPIRING: "bg-amber-100 text-amber-600 dark:bg-amber-950/30",
    STOCK_ZERO: "bg-red-100 text-red-600 dark:bg-red-950/30",
};

export function NotificationPanel({ notifications, bandId }: NotificationPanelProps) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Bell className="h-5 w-5 text-secondary" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-card shadow-2xl ring-1 ring-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-sm font-bold text-foreground">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllNotificationsAsRead(bandId)}
                                className="text-[10px] font-bold text-secondary hover:underline flex items-center gap-1"
                            >
                                <CheckCheck className="h-3 w-3 text-secondary" /> Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800">
                        {notifications.length > 0 ? (
                            notifications.slice(0, 10).map((notif) => {
                                const IconComp = typeIcons[notif.type] || Bell;
                                const colorClass = typeColors[notif.type] || "bg-zinc-100 text-zinc-600";
                                return (
                                    <div
                                        key={notif.id}
                                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${notif.isRead ? "opacity-50" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-lg ${colorClass} mt-0.5`}>
                                            <IconComp className="h-3.5 w-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-foreground leading-relaxed">{notif.message}</p>
                                            <p className="text-[10px] text-zinc-400 mt-1">
                                                {typeof window !== 'undefined' ? new Date(notif.createdAt).toLocaleDateString('pt-BR') : ''}
                                            </p>
                                        </div>
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markNotificationAsRead(notif.id)}
                                                className="p-1 text-zinc-400 hover:text-secondary transition-colors"
                                                title="Marcar como lida"
                                                aria-label="Marcar como lida"
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
                                <p className="text-xs text-zinc-400">Tudo tranquilo por aqui!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
