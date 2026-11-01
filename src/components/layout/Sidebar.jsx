import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, Library, Calendar, ListOrdered,
  History, Settings, Zap, LogOut, Instagram
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Videos' },
  { to: '/library', icon: Library, label: 'Content Library' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/queue', icon: ListOrdered, label: 'Publishing Queue' },
  { to: '/history', icon: History, label: 'History' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="w-64 flex flex-col border-r border-white/[0.06] bg-surface-50/50 backdrop-blur-sm shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white leading-none">ReelFlow</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Reel Scheduler</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="pt-2 border-t border-white/[0.06] space-y-1">
          <NavLink
            to="/meta-setup"
            id="nav-meta-setup"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Instagram className="w-4 h-4 shrink-0 text-pink-400" />
            Meta Setup
          </NavLink>
          <NavLink
            to="/settings"
            id="nav-settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            id="btn-logout"
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
