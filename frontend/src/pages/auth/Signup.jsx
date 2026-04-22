import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      const user = await signup({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      toast.success('Account created! Welcome 🎉');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-white selection:bg-primary/30">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-black border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-secondary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-primary/20 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/4" />
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
            Join the ultimate campus experience.
          </h2>
          <p className="text-gray-400 text-lg">
            Create an account to register for events, collaborate with peers, and host your own activities.
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
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5 pb-2">
                <label className="text-sm font-medium text-gray-300">I am joining as a</label>
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: 'user' }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      form.role === 'user' ? "bg-white/10 text-white shadow-inner" : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    STUDENT
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: 'admin' }))}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      form.role === 'admin' ? "bg-primary/20 text-primary border border-primary/20 shadow-glow" : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    ADMIN / HOST
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text" name="full_name" required
                    value={form.full_name} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

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
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'} name="confirmPassword" required
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <Button id="signup-submit" type="submit" className="w-full mt-6" size="lg" isLoading={isLoading} disabled={isLoading}>
                Create {form.role === 'admin' ? 'Admin' : ''} Account
              </Button>
            </form>

            <p className="mt-6 text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
