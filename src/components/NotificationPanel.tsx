import React, { useState, useEffect, useRef } from 'react';
import { X, BellOff, CheckCheck } from 'lucide-react';
import { useNotifications, Notification, NotificationCategory } from '../context/NotificationContext';

interface Props {
    open: boolean;
    onClose: () => void;
}

type Tab = 'all' | NotificationCategory;

const TABS: { label: string; value: Tab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Alerts', value: 'alert' },
    { label: 'Security', value: 'security' },
    { label: 'AI', value: 'ai' },
];

const SEVERITY_BORDER: Record<string, string> = {
    danger: 'border-l-red-500',
    warning: 'border-l-orange-400',
    success: 'border-l-emerald-400',
    info: 'border-l-blue-400',
    ai: 'border-l-brand-purple',
};

const SEVERITY_BG: Record<string, string> = {
    danger: 'bg-red-500/5',
    warning: 'bg-orange-400/5',
    success: 'bg-emerald-400/5',
    info: 'bg-blue-400/5',
    ai: 'bg-purple-500/5',
};

const SEVERITY_DOT: Record<string, string> = {
    danger: 'bg-red-500',
    warning: 'bg-orange-400',
    success: 'bg-emerald-400',
    info: 'bg-blue-400',
    ai: 'bg-purple-500',
};

function timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationCard({ n, onDismiss, onRead }: {
    n: Notification;
    onDismiss: (id: string) => void;
    onRead: (id: string) => void;
}) {
    return (
        <div
            onClick={() => onRead(n.id)}
            className={`
        relative flex gap-3 p-4 border-l-4 rounded-r-xl cursor-pointer
        transition-all duration-200 hover:brightness-110
        ${SEVERITY_BORDER[n.severity]} ${SEVERITY_BG[n.severity]}
        ${n.read ? 'opacity-60' : 'opacity-100'}
      `}
        >
            {/* Unread dot */}
            {!n.read && (
                <span className={`absolute top-3 right-8 w-2 h-2 rounded-full ${SEVERITY_DOT[n.severity]} animate-pulse`} />
            )}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary leading-snug">{n.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{n.message}</p>
                {n.subtext && (
                    <p className="text-xs text-text-muted mt-1 italic">{n.subtext}</p>
                )}
                <p className="text-[10px] text-text-muted mt-2 font-medium">{timeAgo(n.timestamp)}</p>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
                className="self-start p-1 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors shrink-0"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export function NotificationPanel({ open, onClose }: Props) {
    const { notifications, unreadCount, markAllRead, markRead, dismiss } = useNotifications();
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, onClose]);

    const filtered = notifications.filter(
        (n) => activeTab === 'all' || n.category === activeTab
    );

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`
          fixed top-0 right-0 h-full w-96 bg-bg-surface border-l border-border
          z-50 flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg text-text-primary">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-xs text-brand-purple hover:text-brand-cyan transition-colors font-medium"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-bg-elevated text-text-muted hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-4 py-3 border-b border-border shrink-0">
                    {TABS.map((t) => {
                        const count = t.value === 'all'
                            ? notifications.filter(n => !n.read).length
                            : notifications.filter(n => n.category === t.value && !n.read).length;
                        return (
                            <button
                                key={t.value}
                                onClick={() => setActiveTab(t.value)}
                                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${activeTab === t.value
                                        ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30'
                                        : 'text-text-muted hover:text-white hover:bg-bg-elevated'
                                    }
                `}
                            >
                                {t.label}
                                {count > 0 && (
                                    <span className={`w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center ${activeTab === t.value ? 'bg-brand-purple text-white' : 'bg-bg-elevated text-text-muted'
                                        }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
                            <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center">
                                <BellOff className="w-6 h-6 text-text-muted" />
                            </div>
                            <p className="text-text-muted text-sm">No notifications here</p>
                        </div>
                    ) : (
                        filtered.map((n) => (
                            <NotificationCard
                                key={n.id}
                                n={n}
                                onDismiss={dismiss}
                                onRead={markRead}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border text-center shrink-0">
                    <p className="text-[10px] text-text-muted">
                        Live alerts refresh every 5 minutes
                    </p>
                </div>
            </div>
        </>
    );
}
