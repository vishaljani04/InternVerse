import { useState, useEffect, useRef } from 'react';
import { Bell, BellDot, Check, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';

const NotificationBell = ({ align = 'right' }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications/my');
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors"
                id="notification-bell"
            >
                {unreadCount > 0 ? (
                    <BellDot className="text-primary-600 animate-pulse" size={20} />
                ) : (
                    <Bell size={20} />
                )}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-80 max-h-[400px] bg-white rounded-2xl shadow-2xl border border-surface-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
                    <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50 text-left">
                        <h3 className="font-bold text-surface-900 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} New</span>}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[320px]">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-surface-400">
                                <Bell className="mx-auto mb-2 opacity-20" size={32} />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-4 border-b border-surface-50 hover:bg-surface-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                >
                                    {!n.isRead && <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-primary-500 rounded-full" />}
                                    <div className="flex justify-between items-start gap-2 mb-1 pl-2">
                                        <p className={`text-sm font-bold ${!n.isRead ? 'text-surface-900' : 'text-surface-600'}`}>
                                            {n.title}
                                        </p>
                                        <span className="text-[10px] text-surface-400 whitespace-nowrap">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed pl-2">{n.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 bg-surface-50 border-t border-surface-100 text-center">
                        <button className="text-xs font-semibold text-surface-500 hover:text-surface-800 transition-colors">
                            View all history
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
