import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.full_name?.split(' ')[0] || 'User'}!`);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-white selection:bg-primary/30">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-black border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-secondary/20 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/4" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            CampusConnect
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-lg"
        >
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Welcome back to the community.
          </h2>
          <p className="text-gray-400 text-lg">
            Access your tickets, manage events, and stay connected with everything happening on campus.
          </p>
        </motion.div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <Link to="/" className="absolute top-8 left-6 lg:hidden text-gray-400 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Sign in to your account</h1>
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email" name="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="student@university.edu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button id="login-submit" type="submit" className="w-full mt-6" size="lg" isLoading={isLoading} disabled={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                Google
              </button>
              <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors">
                University ID
              </button>
            </div>

            {/* Demo Credentials Shortcut */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-4 text-center uppercase tracking-widest font-semibold italic">Demo Access</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ email: 'admin@campusconnect.com', password: 'admin123' })}
                  className="flex items-center justify-center h-10 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                >
                  ADMIN LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ email: 'alex.doe@student.edu', password: 'admin123' })}
                  className="flex items-center justify-center h-10 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all font-mono"
                >
                  USER LOGIN
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
