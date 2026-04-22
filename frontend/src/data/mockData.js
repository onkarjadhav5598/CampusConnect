export const dummyEvents = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Aug 15, 2026",
    time: "10:00 AM",
    venue: "Main Auditorium",
    category: "Technology",
    seatsLeft: 42,
    totalSeats: 200,
    organizer: "Computer Science Dept",
    description: "Join the biggest tech event on campus featuring talks from industry leaders, workshops on AI and Web3, and networking opportunities.",
    poster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    speakers: ["Dr. Alan Turing", "Grace Hopper"],
  },
  {
    id: 2,
    title: "Design Meets Code",
    date: "Sep 2, 2026",
    time: "02:00 PM",
    venue: "Design Lab 3",
    category: "Design",
    seatsLeft: 5,
    totalSeats: 50,
    organizer: "UX/UI Society",
    description: "A collaborative workshop where designers and developers team up to build prototype applications in 4 hours.",
    poster: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    speakers: ["Don Norman"],
  },
  {
    id: 3,
    title: "Campus Music Festival",
    date: "Oct 10, 2026",
    time: "06:00 PM",
    venue: "Open Grounds",
    category: "Entertainment",
    seatsLeft: 150,
    totalSeats: 500,
    organizer: "Cultural Club",
    description: "An evening of live band performances, electronic music, and food stalls.",
    poster: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    speakers: ["The Local Natives"],
  },
  {
    id: 4,
    title: "Startup Pitch Deck 4.0",
    date: "Nov 5, 2026",
    time: "09:00 AM",
    venue: "Conference Hall B",
    category: "Business",
    seatsLeft: 12,
    totalSeats: 100,
    organizer: "Entrepreneurship Cell",
    description: "Pitch your startup ideas to angel investors and get on-the-spot feedback and potential funding.",
    poster: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    speakers: ["Elon Musk", "Sam Altman"],
  }
];

export const userProfile = {
  name: "Alex Doe",
  email: "alex.doe@student.edu",
  registeredEvents: [1, 2],
  attendanceStats: { attended: 12, missed: 2 }
};

export const adminStats = {
  totalUsers: 1450,
  totalEvents: 45,
  upcomingEvents: 12,
  feedbacks: 890
};

export const registrationChartData = [
  { name: 'Mon', registrations: 12 },
  { name: 'Tue', registrations: 19 },
  { name: 'Wed', registrations: 30 },
  { name: 'Thu', registrations: 25 },
  { name: 'Fri', registrations: 45 },
  { name: 'Sat', registrations: 60 },
  { name: 'Sun', registrations: 20 },
];
