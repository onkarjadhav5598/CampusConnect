import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/common/Navbar';
import Button from '../components/common/Button';
import EventCard from '../components/events/EventCard';
import { fetchEventById, fetchEvents, registerForEvent, fetchMyEvents } from '../services/api';
import { dummyEvents } from '../data/mockData';
import { Calendar, MapPin, Users, User, ArrowLeft, Clock, Share2, Heart, CheckCircle2 } from 'lucide-react';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      fetchEventById(id).catch(() => null),
      fetchEvents().catch(() => []),
      isAuthenticated ? fetchMyEvents().catch(() => []) : Promise.resolve([])
    ]).then(([eventData, allEvents, myEvents]) => {
      const resolvedEvent = eventData ||
        dummyEvents.find((e) => e.id === parseInt(id)) ||
        dummyEvents[0];
      setEvent(resolvedEvent);
      
      const all = Array.isArray(allEvents) ? allEvents : allEvents.events ?? [];
      setRelatedEvents(all.filter((e) => e.id !== resolvedEvent?.id).slice(0, 3));
      
      // Check if already registered
      const isReg = Array.isArray(myEvents) && myEvents.some(e => e.id === parseInt(id));
      setIsRegistered(isReg);
    }).finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold text-sm">Successfully Registered!</p>
          <p className="text-xs text-gray-500">Thank you for registering. You are now enrolled in {event.title}.</p>
        </div>,
        { duration: 5000, icon: '🎉' }
      );
    } catch (error) {
      toast.error(error.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!event) return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Event not found.</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    </div>
  );

  const displayDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : event.date || 'TBA';

  const displayTime = event.event_date
    ? new Date(event.event_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : event.time || '';

  const poster = event.poster_url || event.poster || `https://picsum.photos/seed/${event.id}/1200/600`;
  const fillPct = event.totalSeats
    ? Math.round(((event.totalSeats - (event.seatsLeft ?? event.seats ?? 0)) / event.totalSeats) * 100)
    : 70;

  return (
    <div className="min-h-screen bg-background text-white pb-24 selection:bg-primary/30">
      <Navbar />

      {/* Banner */}
      <div className="relative pt-24 h-[50vh] min-h-[380px] w-full">
        <div className="absolute inset-0">
          <img src={poster} alt={event.title} className="w-full h-full object-cover opacity-40 blur-sm" />
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl border border-white/10">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  {event.category || 'General'}
                </span>
                {event.organizer && (
                  <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-semibold rounded-full border border-white/10">
                    By {event.organizer}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{event.title}</h1>

              <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8 pb-8 border-b border-white/10">
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />{displayDate}</div>
                {displayTime && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />{displayTime}</div>}
                {event.venue && <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />{event.venue}</div>}
              </div>

              <h3 className="text-2xl font-bold mb-4">About the Event</h3>
              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                {event.description || 'No description provided.'}
              </p>

              <h3 className="text-2xl font-bold mb-4">Agenda</h3>
              <div className="space-y-6 relative border-l border-white/10 ml-3 pl-8 pb-4">
                {['10:00 AM — Registration & Welcome', '11:00 AM — Keynote Speech', '12:30 PM — Networking & Lunch', '02:00 PM — Workshop & Q&A'].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[45px] top-1 w-4 h-4 bg-primary rounded-full ring-4 ring-background" />
                    <p className="text-gray-300 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Speakers */}
            {event.speakers?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">Speakers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, idx) => (
                    <div key={idx} className="glass flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">{speaker}</h4>
                        <p className="text-sm text-gray-400">Industry Expert</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-32 glass p-6 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-white/5">
                <img src={poster} alt="Poster" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2 text-sm">
                  <span className="text-gray-300 font-medium">Availability</span>
                  <span className="text-primary font-bold">{event.seats ?? event.seatsLeft ?? '—'} seats</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-primary h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">{event.totalSeats ?? event.seats ?? '—'} total capacity</p>
              </div>

              <div className="space-y-3">
                {isRegistered ? (
                  <Button size="lg" className="w-full text-lg cursor-default bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Registered
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full text-lg shadow-glow" 
                    onClick={handleRegister}
                    isLoading={registering}
                  >
                    Register Now
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1"><Share2 className="w-4 h-4 mr-2" />Share</Button>
                  <Button variant="outline" className="flex-1"><Heart className="w-4 h-4 mr-2" />Save</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedEvents.length > 0 && (
        <div className="container mx-auto px-6 mt-24">
          <h2 className="text-3xl font-bold tracking-tight mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
