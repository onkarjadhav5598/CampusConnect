import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EventCard } from '../components/ui/EventCard';
import { dummyEvents } from '../data/mockData';
import { Calendar, MapPin, Users, User, ArrowLeft, Clock, Share2, Heart } from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = dummyEvents.find(e => e.id === parseInt(id)) || dummyEvents[0];
  const relatedEvents = dummyEvents.filter(e => e.id !== event.id).slice(0, 3);
  
  const fillPercentage = ((event.totalSeats - event.seatsLeft) / event.totalSeats) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-white pb-24 selection:bg-primary/30">
      <Navbar />
      
      {/* Dynamic Banner */}
      <div className="relative pt-24 h-[50vh] min-h-[400px] w-full">
        <div className="absolute inset-0">
          <img 
            src={event.poster} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-40 blur-sm mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative -mt-32 z-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border-white/10"
            >
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-semibold rounded-full border border-white/10">
                  By {event.organizer}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{event.title}</h1>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8 pb-8 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.venue}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">About the Event</h3>
              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                {event.description}
              </p>

              <h3 className="text-2xl font-bold mb-4">Agenda</h3>
              <div className="space-y-6 relative border-l border-white/10 ml-3 pl-8 pb-4">
                {[
                  { time: '10:00 AM', label: 'Registration & Welcome Drinks' },
                  { time: '11:00 AM', label: 'Keynote Speech' },
                  { time: '12:30 PM', label: 'Networking Session & Lunch' },
                  { time: '02:00 PM', label: 'Workshop & Q&A' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[45px] top-1 w-4 h-4 bg-primary rounded-full ring-4 ring-background" />
                    <span className="text-primary font-bold text-sm block mb-1">{item.time}</span>
                    <p className="text-gray-300 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Speakers Sections */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-6 tracking-tight">Speakers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, idx) => (
                  <Card key={idx} className="flex items-center gap-4 p-4 hover:border-primary/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{speaker}</h4>
                      <p className="text-sm text-gray-400">Industry Expert</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-32 glass p-6 rounded-3xl border-white/10 shadow-2xl"
            >
              <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-white/5">
                <img src={event.poster} alt="Poster" className="w-full h-full object-cover" />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2 text-sm">
                  <span className="text-gray-300 font-medium">Availability</span>
                  <span className="text-primary font-bold">{event.seatsLeft} seats left</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-primary h-full rounded-full" 
                  />
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">{event.totalSeats} total capacity</p>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full text-lg shadow-glow">
                  Register Now
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" /> Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Events */}
      <div className="container mx-auto px-6 mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">You might also like</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedEvents.map((relatedEvent, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <EventCard event={relatedEvent} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
