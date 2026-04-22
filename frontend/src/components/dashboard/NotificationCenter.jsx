import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Clock, Check } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';
import { cn } from '../../lib/utils';
import Button from '../common/Button';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Polling every 30s
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

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-glow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-80 glass rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.read && handleMarkRead(notification.id)}
                      className={cn(
                        "p-4 transition-colors cursor-pointer flex gap-3",
                        notification.read ? "bg-transparent opacity-60" : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-xs leading-relaxed", notification.read ? "text-gray-400" : "text-white")}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-1 shadow-glow" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Bell className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500 italic">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <button className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors">
                View all activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
