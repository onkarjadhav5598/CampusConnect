import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../components/common/Sidebar';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  User as UserIcon,
  CheckCircle2,
  Clock,
  Trash2,
  Edit
} from 'lucide-react';
import { cn } from '../../lib/utils';

const mockUsers = [
  { id: 1, full_name: 'Sarah Jenkins', email: 'sarah.j@university.edu', role: 'admin', status: 'active', joined: '2026-01-15' },
  { id: 2, full_name: 'Michael Rivera', email: 'm.rivera@student.edu', role: 'user', status: 'active', joined: '2026-02-10' },
  { id: 3, full_name: 'David Chen', email: 'd.chen@faculty.edu', role: 'user', status: 'inactive', joined: '2026-01-20' },
  { id: 4, full_name: 'Emily Watson', email: 'emily.w@student.edu', role: 'user', status: 'active', joined: '2026-03-05' },
  { id: 5, full_name: 'James Wilson', email: 'j.wilson@admin.edu', role: 'admin', status: 'active', joined: '2026-01-05' },
  { id: 6, full_name: 'Jessica Thompson', email: 'jess.t@student.edu', role: 'user', status: 'active', joined: '2026-02-28' },
  { id: 7, full_name: 'Robert Miller', email: 'r.miller@student.edu', role: 'user', status: 'pending', joined: '2026-04-12' },
  { id: 8, full_name: 'Lisa Anderson', email: 'lisa.a@student.edu', role: 'user', status: 'active', joined: '2026-03-15' },
  { id: 9, full_name: 'Kevin Smith', email: 'k.smith@faculty.edu', role: 'user', status: 'active', joined: '2026-01-30' },
  { id: 10, full_name: 'Amanda White', email: 'amanda.w@student.edu', role: 'user', status: 'inactive', joined: '2026-02-15' },
];

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || user.role === activeTab || user.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
      <Sidebar isAdmin />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-6 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
            <p className="text-xs text-gray-500 mt-1">View and manage all registered users on the platform</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{mockUsers.length} Total</span>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl self-stretch md:self-auto">
              {['all', 'admin', 'user', 'pending'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                    activeTab === tab ? "bg-primary text-white shadow-glow" : "text-gray-400 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, idx) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-primary border border-white/10">
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-200">{user.full_name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.role === 'admin' ? (
                              <Shield className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span className={cn(
                              "text-xs font-medium",
                              user.role === 'admin' ? "text-amber-400" : "text-blue-400"
                            )}>
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            user.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                            user.status === 'pending' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                            "bg-red-500/10 text-red-500 border border-red-500/20"
                          )}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-primary transition-colors">
                               <Edit className="w-4 h-4" />
                             </button>
                             <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                             <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                               <MoreVertical className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                    <Filter className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-300">No users found</h4>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
