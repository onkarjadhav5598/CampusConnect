import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Zap, Home, Calendar, Users, Settings, LogOut, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const userLinks = [
  { name: 'Overview', path: '/dashboard', icon: Home },
  { name: 'My Events', path: '/dashboard/events', icon: Calendar },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: BarChart3 },
  { name: 'Manage Events', path: '/admin/events', icon: Calendar },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-card/30 backdrop-blur-3xl hidden md:flex min-h-screen flex-col shrink-0">
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <div className="p-1.5 bg-gradient-primary rounded-lg shadow-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          CampusConnect
        </Link>
        {isAdmin && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Panel
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-8 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {user && (
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-sm font-medium text-gray-300 truncate">{user.full_name}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
