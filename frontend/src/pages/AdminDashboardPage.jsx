import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { adminStats, dummyEvents, registrationChartData } from '../data/mockData';
import { Users, Calendar, BarChart3, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export default function AdminDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState(dummyEvents);

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
      <Sidebar isAdmin={true} />
      
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Admin Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" /> Create Event
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex justify-center items-center font-bold relative cursor-pointer">
              A
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-background"></span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatsCard 
              title="Total Users" 
              value={adminStats.totalUsers} 
              icon={Users} 
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard 
              title="Total Events" 
              value={adminStats.totalEvents} 
              icon={Calendar} 
              trend={{ value: 4, isPositive: true }}
            />
            <StatsCard 
              title="Upcoming Events" 
              value={adminStats.upcomingEvents} 
              icon={Calendar} 
            />
            <StatsCard 
              title="Total Feedbacks" 
              value={adminStats.feedbacks} 
              icon={BarChart3} 
              trend={{ value: 2, isPositive: false }}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Area */}
            <motion.div 
              className="col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-white/5 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Registrations Overview</h3>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-primary">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationChartData}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#2a2a35', borderRadius: '8px' }}
                        itemStyle={{ color: '#a855f7' }}
                      />
                      <Area type="monotone" dataKey="registrations" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions / Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-white/5 py-6 px-4">
                <h3 className="text-lg font-bold mb-4 px-2">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { user: "Sarah K.", action: "registered for", target: "Global Tech Summit", time: "2h ago" },
                    { user: "Michael R.", action: "created", target: "Design Meets Code", time: "5h ago" },
                    { user: "Jessica T.", action: "cancelled", target: "Music Festival", time: "1d ago" },
                    { user: "Admin", action: "updated policy", target: "Terms of Service", time: "2d ago" },
                  ].map((act, i) => (
                    <div key={i} className="p-3 border border-white/5 rounded-xl hover:bg-white/5 transition-colors text-sm">
                      <p className="font-medium text-gray-300">
                        <span className="text-white">{act.user}</span> {act.action} <span className="text-primary">{act.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Events Management Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-white/5 p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h3 className="text-lg font-bold">Manage Events</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search events..."
                      className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary w-full md:w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="px-3 border-white/10">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                  <thead className="bg-white/5 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Event Name</th>
                      <th className="px-6 py-4 font-medium">Organizer</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Seats</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={event.poster} alt="" className="w-10 h-10 rounded object-cover" />
                            <span className="font-medium text-white">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{event.organizer}</td>
                        <td className="px-6 py-4">{event.date} • {event.time}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-white/10 rounded-full h-1.5 max-w-[50px]">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${((event.totalSeats - event.seatsLeft) / event.totalSeats) * 100}%` }}
                              ></div>
                            </div>
                            <span>{event.totalSeats - event.seatsLeft}/{event.totalSeats}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-white p-2 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-400 p-2 transition-colors ml-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {events.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No active events found.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

        </div>
      </main>

      {/* Create Event Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Event"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Event Title</label>
            <input type="text" required placeholder="e.g. CodeFest 2026" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Date</label>
              <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Time</label>
              <input type="time" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Total Capacity</label>
            <input type="number" required placeholder="100" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <Button type="submit" className="w-full mt-6">Publish Event</Button>
        </form>
      </Modal>

    </div>
  );
}
