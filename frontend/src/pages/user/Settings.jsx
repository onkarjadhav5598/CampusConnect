import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, login } = useAuth(); // We'll re-login to update local state or just use a state update
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(form);
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Hacky way to update context without a dedicated dispatch in this snippet, 
      // but ideally AuthContext would have an update method.
      // For now, toast is enough for feedback.
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400 text-sm">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 text-center border border-white/5">
            <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-glow">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-lg font-bold text-white mb-1">{user?.full_name}</h2>
            <p className="text-xs text-primary font-mono uppercase tracking-widest">{user?.role}</p>
          </div>
          
          <div className="glass rounded-2xl overflow-hidden border border-white/5">
            <button className="w-full px-5 py-4 text-left text-sm font-medium bg-white/10 text-white flex items-center gap-3">
              <User className="w-4 h-4 text-primary" /> Profile Info
            </button>
            <button className="w-full px-5 py-4 text-left text-sm font-medium text-gray-400 hover:bg-white/5 flex items-center gap-3 transition-colors">
              <Shield className="w-4 h-4" /> security
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 border border-white/5 h-full"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-white"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-8 flex justify-end">
                <Button 
                  type="submit" 
                  className="px-8" 
                  isLoading={isLoading}
                  disabled={isLoading || (form.full_name === user?.full_name && form.email === user?.email)}
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
