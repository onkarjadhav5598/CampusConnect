import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { EventCard } from '../components/ui/EventCard';
import { dummyEvents } from '../data/mockData';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const featuredEvents = dummyEvents.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-8 text-gray-300">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              The Premier Campus Event Platform
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              Discover, Register & Manage <br className="hidden md:block" />
              <span className="text-gradient">Campus Events</span> Effortlessly
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Connect with your campus community through engaging events, 
              workshops, and festivals. Your all-in-one portal for a vibrant college life.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/events">
                  Explore Events <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/dashboard">Host an Event</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { label: "Active Users", value: "10K+" },
              { label: "Events Hosted", value: "500+" },
              { label: "Categories", value: "24+" },
              { label: "Partner Clubs", value: "50+" },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Trending This Week</h2>
              <p className="text-gray-400">Don't miss out on the most anticipated events happening around the campus.</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" asChild>
              <Link to="/events">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredEvents.map((event) => (
              <motion.div key={event.id} variants={fadeIn}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">Loved by Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Computer Science, '27", text: "CampusConnect made it so easy to find hackathons and tech meetups. I've met amazing teammates here!" },
              { name: "Michael R.", role: "Design Club President", text: "Hosting our annual design sprint was a breeze. the attendee management tools are game-changing." },
              { name: "Jessica T.", role: "Business Admin, '26", text: "I love the sleek interface. It feels like a premium app rather than a clunky university portal." },
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                className="glass p-8 rounded-2xl relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/50 text-gray-400 text-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white mb-4">
                <Zap className="w-5 h-5 text-primary" />
                CampusConnect
              </Link>
              <p className="max-w-md">Bridging the gap between students and campus activities through beautiful design and powerful technology.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Links</h4>
              <ul className="space-y-2">
                <li><Link to="/events" className="hover:text-primary transition-colors">All Events</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Host Event</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2026 CampusConnect. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed with modern aesthetics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
