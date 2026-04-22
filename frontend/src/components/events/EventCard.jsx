import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { registerForEvent } from '../../services/api';
import toast from 'react-hot-toast';

const EventCard = ({ event, isRegistered: initialRegistered = false }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(initialRegistered);

  // Determine if event is upcoming or past
  const isUpcoming = event.event_date
    ? new Date(event.event_date) >= new Date()
    : event.date
      ? new Date(event.date) >= new Date()
      : true;

  const displayDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : event.date || 'TBA';

  const displayVenue = event.venue || 'Venue TBA';
  const displaySeats = event.seats ?? event.seatsLeft ?? '—';
  const poster = event.poster_url || event.poster || `https://picsum.photos/seed/${event.id || 1}/800/500`;

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    if (user?.role === 'admin') {
      toast.error('Admins cannot register for events');
      return;
    }

    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      setIsRegistered(true);
      toast.success('Registration successful! 🎉');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to register');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group glass rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <img
          src={poster}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id || 1}/800/500`; }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
          {event.category || 'General'}
        </div>
        {/* Status badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold",
          isUpcoming
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
        )}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-3 line-clamp-1 text-white">{event.title}</h3>

        <div className="space-y-2 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{displayDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{displayVenue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <span>{displaySeats} seats</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
          <Button variant="outline" className="flex-1 text-sm h-9" asChild>
            <Link to={`/events/${event.id}`}>Details</Link>
          </Button>
          
          {isRegistered ? (
            <Button className="flex-1 text-sm h-9 bg-green-500/20 text-green-400 border-green-500/30 cursor-default hover:bg-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Registered
            </Button>
          ) : (
            <Button 
              className="flex-1 text-sm h-9" 
              onClick={handleRegister} 
              isLoading={isRegistering}
              disabled={!isUpcoming}
            >
              {isUpcoming ? 'Register' : 'Closed'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { EventCard };
export default EventCard;
