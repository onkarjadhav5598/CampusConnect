import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/common/Navbar';
import EventCard from '../components/events/EventCard';
import { fetchEvents } from '../services/api';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Business', 'Entertainment', 'Sports', 'Cultural', 'Academic'];

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
        <div className="flex gap-3 pt-3 border-t border-white/5">
          <div className="h-9 bg-white/5 rounded-lg flex-1" />
          <div className="h-9 bg-white/5 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // asc = newest first

  useEffect(() => {
    fetchEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events
    .filter((event) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        event.title?.toLowerCase().includes(q) ||
        event.venue?.toLowerCase().includes(q) ||
        event.category?.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || event.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const dA = new Date(a.event_date || a.date || 0);
      const dB = new Date(b.event_date || b.date || 0);
      return sortOrder === 'asc' ? dA - dB : dB - dA;
    });

  return (
    <div className="min-h-screen bg-background text-white pb-24 selection:bg-primary/30">
      <Navbar />

      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            >
              Discover Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg max-w-xl"
            >
              Find and register for the best events happening around the campus.
            </motion.p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col md:flex-row gap-4 mb-10"
          >
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="events-search"
                type="text"
                placeholder="Search events, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600 text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl overflow-x-auto gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-sm font-medium md:ml-auto shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Date ↑' : 'Date ↓'}
              <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
            </button>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map((event, index) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-gray-500 mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No events found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
