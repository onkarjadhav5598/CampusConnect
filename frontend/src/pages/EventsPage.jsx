import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { EventCard } from '../components/ui/EventCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { dummyEvents } from '../data/mockData';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Technology', 'Design', 'Business', 'Entertainment'];

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setEvents(dummyEvents);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-white pb-24 selection:bg-primary/30">
      <Navbar />
      
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
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
          </div>

          {/* Filters & Search */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-12"
          >
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
              />
            </div>
            
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl overflow-x-auto hide-scrollbar whitespace-nowrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === category 
                      ? 'bg-gradient-primary text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-sm font-medium md:ml-auto">
              <SlidersHorizontal className="w-4 h-4" />
              Sort By
              <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
            </button>
          </motion.div>

          {/* Event Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
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
