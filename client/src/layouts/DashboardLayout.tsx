import { useState } from 'react';
import { useNavigate, Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  Sun, 
  Moon,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '../utils/cn';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  const handleGlobalSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate(`/leads?q=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Leads', icon: Users, path: '/leads' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex" onClick={() => setIsNotificationsOpen(false)}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-all duration-300 sidebar-gradient lg:static lg:block",
        !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-10 h-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
              S
            </div>
            {isSidebarOpen && (
              <span className="font-display font-bold text-xl tracking-tight">SmartLeads</span>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-border">
            <button
              onClick={logout}
              className={cn(
                "flex items-center gap-3 px-3 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut size={22} />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-20 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}
              className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-muted px-4 py-2 rounded-xl w-80 ring-primary/20 focus-within:ring-2 transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input 
                placeholder="Search leads (Press Enter)..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleGlobalSearch}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsNotificationsOpen(!isNotificationsOpen); }}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-destructive text-[10px] text-white flex items-center justify-center rounded-full border-2 border-card font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50" onClick={(e) => e.stopPropagation()}>
                  <p className="font-bold text-sm mb-3">Notifications</p>
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="text-xs p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
                          <p className="font-semibold">{n.message}</p>
                          <p className="text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                    <Link 
                      to="/settings" 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block text-center text-xs text-primary font-bold mt-2 hover:underline"
                    >
                      View all history
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/settings" className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-card shadow-sm">
                {user?.name.charAt(0)}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
