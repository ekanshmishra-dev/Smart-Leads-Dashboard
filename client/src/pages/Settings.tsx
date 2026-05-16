import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, Moon, Sun, Monitor, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';
import api from '../utils/api';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { notifications, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) {
      return toast.error('Please fill in all fields');
    }
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('Password updated successfully!');
      setPasswords({ current: '', new: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
  ];

  const handleSave = () => {
    toast.success('Settings updated in real-time!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 bg-card rounded-3xl p-8 border border-border shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-card shadow-lg">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                    {user?.role} Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <input 
                    defaultValue={user?.name}
                    className="w-full bg-muted border-none rounded-xl px-4 py-2.5 text-sm outline-none ring-primary/20 focus:ring-2 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <input 
                    defaultValue={user?.email}
                    disabled
                    className="w-full bg-muted/50 border-none rounded-xl px-4 py-2.5 text-sm cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all mt-4"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg">Theme Preference</h3>
                <p className="text-sm text-muted-foreground">Select how the dashboard should look for you</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all",
                    theme === 'light' ? "border-primary bg-primary/5 shadow-inner" : "border-transparent bg-muted hover:border-muted-foreground/20"
                  )}
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-border">
                    <Sun size={24} className="text-orange-500" />
                  </div>
                  <span className="font-semibold text-sm">Light Mode</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all",
                    theme === 'dark' ? "border-primary bg-primary/5 shadow-inner" : "border-transparent bg-muted hover:border-muted-foreground/20"
                  )}
                >
                  <div className="w-12 h-12 bg-slate-900 rounded-full shadow-sm flex items-center justify-center border border-slate-700">
                    <Moon size={24} className="text-blue-400" />
                  </div>
                  <span className="font-semibold text-sm">Dark Mode</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg">Security Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your password and session security</p>
              </div>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••" 
                    className="w-full bg-muted border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                    placeholder="Min. 6 characters" 
                    className="w-full bg-muted border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all mt-4 w-full">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Activity History</h3>
                  <p className="text-sm text-muted-foreground">Recent actions on your account</p>
                </div>
                <button 
                  onClick={clearAll}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground italic">
                    No recent activity
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        item.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        <CheckCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.message}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
