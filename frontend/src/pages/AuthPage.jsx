import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AuthPage({ type = 'login' }) {
  const isLogin = type === 'login';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy authentication
    navigate('/dashboard');
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen flex bg-background text-white selection:bg-primary/30">
      
      {/* Left Branding Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-black border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-secondary/20 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/4 pointer-events-none" />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            CampusConnect
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto pb-12">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {isLogin ? "Welcome back to the community." : "Join the ultimate campus experience."}
            </h2>
            <p className="text-gray-400 text-lg">
              {isLogin 
                ? "Access your tickets, manage events, and stay connected with everything happening on campus."
                : "Create an account to register for events, collaborate with peers, and host your own activities."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-8 left-6 md:left-12 lg:hidden text-gray-400 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <div className="w-full max-w-md">
          <motion.div
             key={type}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {isLogin ? "Sign in to your account" : "Create an account"}
              </h1>
              <p className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link to={isLogin ? "/signup" : "/login"} className="text-primary hover:underline font-medium">
                  {isLogin ? "Sign up" : "Log in"}
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4",
                        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
                        "placeholder:text-gray-600"
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4",
                      "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
                      "placeholder:text-gray-600"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder={isLogin ? "••••••••" : "Create a strong password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10",
                      "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
                      "placeholder:text-gray-600"
                    )}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-white w-full">
                Google
              </Button>
              <Button variant="outline" type="button" className="bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-white w-full">
                University ID
              </Button>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
