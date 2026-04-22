import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/common/Sidebar';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminAnalytics } from '../../services/api';
import { Users, Calendar, BarChart3, TrendingUp, Bell } from 'lucide-react';

const fallbackStats = { totalUsers: 0, totalEvents: 0, upcomingEvents: 0, feedbacks: 0 };
const fallbackChart = [
  { name: 'Mon', registrations: 0 },
  { name: 'Tue', registrations: 0 },
  { name: 'Wed', registrations: 0 },
  { name: 'Thu', registrations: 0 },
  { name: 'Fri', registrations: 0 },
  { name: 'Sat', registrations: 0 },
  { name: 'Sun', registrations: 0 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(fallbackChart);

  useEffect(() => {
    fetchAdminAnalytics()
      .then((data) => {
        setStats(data.stats || fallbackStats);
        if (data.chartData) setChartData(data.chartData);
      })
      .catch(() => setStats(fallbackStats));
  }, []);

  const s = stats || fallbackStats;

  const recentActivity = [
    { user: 'Sarah K.', action: 'registered for', target: 'Global Tech Summit', time: '2h ago' },
    { user: 'Michael R.', action: 'created', target: 'Design Meets Code', time: '5h ago' },
    { user: 'Jessica T.', action: 'cancelled', target: 'Music Festival', time: '1d ago' },
    { user: 'Admin', action: 'updated policy', target: 'Terms of Service', time: '2d ago' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
      <Sidebar isAdmin />

      <main className="flex-1 overflow-y-auto">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Admin Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">Logged in as {user?.full_name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex justify-center items-center font-bold shadow-glow cursor-pointer">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Here's what's happening across campus today.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Users" value={s.totalUsers} icon={Users} trend={{ value: 12, isPositive: true }} />
            <StatsCard title="Total Events" value={s.totalEvents} icon={Calendar} trend={{ value: 4, isPositive: true }} />
            <StatsCard title="Upcoming Events" value={s.upcomingEvents} icon={TrendingUp} />
            <StatsCard title="Feedbacks" value={s.feedbacks} icon={BarChart3} trend={{ value: 2, isPositive: false }} />
          </div>

          {/* Chart + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ChartCard
                title="Registrations Overview"
                data={chartData}
                dataKey="registrations"
                type="area"
              >
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-primary">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This Year</option>
                </select>
              </ChartCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass rounded-2xl border border-white/5 p-6 h-full">
                <h3 className="text-base font-bold mb-5">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="p-3 border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-sm">
                      <p className="font-medium text-gray-300">
                        <span className="text-white">{act.user}</span> {act.action}{' '}
                        <span className="text-primary">{act.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
