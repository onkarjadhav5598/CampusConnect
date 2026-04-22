import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import MyEvents from './MyEvents';
import Settings from './Settings';
import NotificationCenter from '../../components/dashboard/NotificationCenter';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">Student Portal</h2>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex justify-center items-center font-bold shadow-glow border border-white/10 text-white">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="p-2">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/events" element={<MyEvents />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
