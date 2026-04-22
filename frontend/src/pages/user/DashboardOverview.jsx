import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents, fetchMyEvents } from '../../services/api';
import { Calendar, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const attendanceData = [
  { name: 'Attended', value: 7, color: '#a855f7' },
  { name: 'Missed', value: 2, color: '#ef4444' },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchEvents(), fetchMyEvents()])
      .then(([allEvents, myRegs]) => {
        setEvents(Array.isArray(allEvents) ? allEvents.slice(0, 4) : []);
        setRegistrations(myRegs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-gray-400">Here is what's happening with your campus activities.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatsCard title="Registered Events" value={registrations.length} icon={Calendar} />
        <StatsCard title="Events Attended" value={7} icon={CheckCircle} trend={{ value: 15, isPositive: true }} />
        <StatsCard title="Hours Credited" value={14} icon={Clock} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <motion.div
          className="col-span-1 lg:col-span-2 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Upcoming Events</h3>
            <Link to="/events" className="text-sm text-primary hover:underline">Explore all</Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-2xl border border-white/5 h-28 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="glass rounded-2xl border border-white/5 p-8 text-center text-gray-500">
              No upcoming events. <br />
              <Link to="/events" className="text-primary text-sm hover:underline">Explore events →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="glass rounded-2xl border border-white/5 p-4 flex flex-col sm:flex-row gap-4 hover:border-white/10 transition-colors">
                  <img
                    src={event.poster_url || event.poster || `https://picsum.photos/seed/${event.id}/200/150`}
                    alt={event.title}
                    className="w-full sm:w-40 h-28 object-cover rounded-xl shrink-0"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id}/200/150`; }}
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <span className="text-primary text-xs font-semibold px-2 py-1 bg-primary/10 rounded-md">
                        {event.category || 'General'}
                      </span>
                      <h4 className="text-base font-bold mt-2 mb-1">{event.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : event.date || 'TBA'}
                    </p>
                  </div>
                  <button className="self-start text-gray-500 hover:text-white p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ChartCard
              title="Attendance Overview"
              data={attendanceData}
              dataKey="value"
              type="bar"
              color="#a855f7"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-primary flex justify-center items-center text-xl font-bold shadow-glow">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{user?.full_name || 'Student'}</h3>
                  <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 space-y-1">
                <Link to="/dashboard/settings" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-primary" /> Edit Profile
                </Link>
                <Link to="/dashboard/events" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-primary" /> My Registrations
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
