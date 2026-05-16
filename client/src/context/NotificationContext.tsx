import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    let parsed = null;
    try {
      parsed = saved ? JSON.parse(saved) : null;
    } catch(e) {}
    
    return Array.isArray(parsed) ? parsed : [
      {
        id: '1',
        message: 'Welcome to SmartLeads! Start managing your leads today.',
        type: 'info',
        time: 'Just now',
        read: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message: string, type: Notification['type'] = 'success') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      type,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
