import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { Menu, X, Zap, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import NotificationCenter from '../dashboard/NotificationCenter';
import { Calendar, Settings as SettingsIcon } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3" : "py-5 bg-transparent"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          CampusConnect
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "transition-colors hover:text-white",
                    location.pathname === link.path ? "text-white" : "text-gray-400"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            {isAuthenticated && <NotificationCenter />}
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={dashboardPath} className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout} className="flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-0 left-0 h-screen bg-background/95 backdrop-blur-xl z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col gap-6 mt-10 text-xl font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/10 pb-4"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-8">
                {isAuthenticated ? (
                  <>
                    {!isAdmin && (
                      <div className="flex flex-col gap-4 mb-4">
                        <Link to="/dashboard/events" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-300">
                          <Calendar className="w-5 h-5 text-primary" /> My Events
                        </Link>
                        <Link to="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-gray-300">
                          <SettingsIcon className="w-5 h-5 text-primary" /> Settings
                        </Link>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" asChild>
                        <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                          {isAdmin ? 'Admin Panel' : 'Dashboard'}
                        </Link>
                      </Button>
                      <Button onClick={handleLogout}>Logout</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
