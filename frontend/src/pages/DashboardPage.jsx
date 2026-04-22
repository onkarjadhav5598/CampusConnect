import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { userProfile, dummyEvents } from '../data/mockData';
import { Calendar, CheckCircle, Clock, Bell, User, Settings, MoreHorizontal } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

export default function DashboardPage() {
  const registeredEvents = dummyEvents.filter(e => userProfile.registeredEvents.includes(e.id));
  
  const attendanceData = [
    { name: 'Attended', value: userProfile.attendanceStats.attended, color: '#a855f7' },
    { name: 'Missed', value: userProfile.attendanceStats.missed, color: '#ef4444' }
  ];

  return (
    <div className="flex min-h-screen bg-background text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Student Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex justify-center items-center font-bold">
              {userProfile.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name.split(' ')[0]} 👋</h1>
              <p className="text-gray-400">Here is what's happening with your campus activities.</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <StatsCard 
              title="Registered Events" 
              value={userProfile.registeredEvents.length} 
              icon={Calendar} 
            />
            <StatsCard 
              title="Events Attended" 
              value={userProfile.attendanceStats.attended} 
              icon={CheckCircle} 
            />
            <StatsCard 
              title="Hours Credited" 
              value={userProfile.attendanceStats.attended * 2} // mock logic
              icon={Clock} 
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upcoming Events */}
            <motion.div 
              className="col-span-1 lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center bg-card/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-xl font-bold">Your Upcoming Events</h3>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="p-4 flex flex-col md:flex-row gap-4 hover:bg-white/[0.03] transition-colors border-white/5">
                    <img src={event.poster} alt={event.title} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                    <div className="flex-1 flex flex-col py-2">
                      <div className="flex justify-between items-start">
                        <span className="text-primary text-xs font-semibold px-2 py-1 bg-primary/10 rounded-md mb-2">
                          {event.category}
                        </span>
                        <button className="text-gray-500 hover:text-white"><MoreHorizontal className="w-5 h-5"/></button>
                      </div>
                      <h4 className="text-lg font-bold mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-2 mt-auto">
                        <Calendar className="w-4 h-4"/> {event.date} • {event.time}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Side Column */}
            <div className="space-y-8">
              
              {/* Chart Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full border-white/5">
                  <h3 className="font-bold mb-6">Attendance Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" axisLine={false} tickLine={false} />
                        <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: '#1f1f2e'}}
                          contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#2a2a35', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {attendanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-white/5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-primary flex justify-center items-center text-2xl font-bold shadow-glow">
                      {userProfile.name.charAt(0)}
                  </div>
                    <div>
                      <h3 className="font-bold text-lg">{userProfile.name}</h3>
                      <p className="text-gray-400 text-sm">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300">
                      <span className="flex items-center gap-2"><User className="w-4 h-4"/> Edit Profile</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300">
                      <span className="flex items-center gap-2"><Settings className="w-4 h-4"/> Preferences</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
