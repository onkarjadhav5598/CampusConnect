const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const dummyEvents = [
  {
    title: "Global Tech Summit 2026",
    event_date: new Date("2026-08-15T10:00:00Z"),
    venue: "Main Auditorium",
    category: "Technology",
    seats: 200,
    description: "Join the biggest tech event on campus featuring talks from industry leaders, workshops on AI and Web3, and networking opportunities.",
    poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Design Meets Code",
    event_date: new Date("2026-09-02T14:00:00Z"),
    venue: "Design Lab 3",
    category: "Design",
    seats: 50,
    description: "A collaborative workshop where designers and developers team up to build prototype applications in 4 hours.",
    poster_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Campus Music Festival",
    event_date: new Date("2026-10-10T18:00:00Z"),
    venue: "Open Grounds",
    category: "Entertainment",
    seats: 500,
    description: "An evening of live band performances, electronic music, and food stalls.",
    poster_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Startup Pitch Deck 4.0",
    event_date: new Date("2026-11-05T09:00:00Z"),
    venue: "Conference Hall B",
    category: "Business",
    seats: 100,
    description: "Pitch your startup ideas to angel investors and get on-the-spot feedback and potential funding.",
    poster_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  }
];

async function main() {
  console.log('Seeding database...');
  
  // Wipe all existing data
  await prisma.feedback.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create an admin user
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash('admin123', salt);

  const admin = await prisma.user.create({
    data: {
      full_name: 'Admin User',
      email: 'admin@campusconnect.com',
      password_hash,
      role: 'admin',
    },
  });

  // Create a standard user
  const standardUser = await prisma.user.create({
    data: {
      full_name: 'Alex Doe',
      email: 'alex.doe@student.edu',
      password_hash,
      role: 'user',
    },
  });

  // Create events mapped to admin
  console.log(`Created users. Admin: ${admin.email}`);

  for (const ev of dummyEvents) {
    const createdEvent = await prisma.event.create({
      data: {
        ...ev,
        created_by: admin.id,
      },
    });
    
    // Register the standard user to the first two events automatically
    if (createdEvent.title.includes('Global') || createdEvent.title.includes('Design')) {
      await prisma.registration.create({
        data: {
          user_id: standardUser.id,
          event_id: createdEvent.id,
          attendance_status: createdEvent.title.includes('Global') // Let's mark one as attended
        }
      });
    }
  }

  console.log('Successfully seeded database with users, events, and mock registrations!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
