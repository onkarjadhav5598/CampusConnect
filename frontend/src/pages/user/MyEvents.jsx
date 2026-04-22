import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Ticket, Search, Filter, Loader2, ArrowRight } from 'lucide-react';
import { fetchMyEvents } from '../../services/api';
import EventCard from '../../components/events/EventCard';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

export default function MyEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchMyEvents();
        setRegistrations(data);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredRegistrations = registrations.filter(reg => {
    const isUpcoming = new Date(reg.event.event_date) >= new Date();
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'past') return !isUpcoming;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
          <p className="text-gray-400 text-sm">Track your registered events and access your tickets.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
          {['all', 'upcoming', 'past'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === type ? 'bg-primary text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredRegistrations.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRegistrations.map((reg) => (
              <EventCard key={reg.id} event={reg.event} isRegistered={true} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border border-white/5"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No registrations found</h3>
            <p className="text-gray-500 max-w-xs mb-8">
              {filter === 'all' 
                ? "You haven't registered for any events yet. Explore events to get started!"
                : `You don't have any ${filter} events registered.`}
            </p>
            <Button asChild>
              <Link to="/events" className="flex items-center gap-2">
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
