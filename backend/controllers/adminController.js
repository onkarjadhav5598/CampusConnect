const prisma = require('../utils/prisma');

const createEvent = async (req, res, next) => {
  try {
    const { title, description, venue, event_date, category, poster_url, seats } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        venue,
        event_date: new Date(event_date),
        category,
        poster_url,
        seats: parseInt(seats) || 0,
        created_by: req.user.id,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const { title, description, venue, event_date, category, poster_url, seats } = req.body;

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        venue,
        ...(event_date && { event_date: new Date(event_date) }),
        category,
        poster_url,
        ...(seats && { seats: parseInt(seats) }),
      },
    });

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getRegistrations = async (req, res, next) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        user: { select: { id: true, full_name: true, email: true } },
        event: { select: { id: true, title: true, event_date: true } },
      },
    });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

const markAttendance = async (req, res, next) => {
  try {
    const registrationId = parseInt(req.params.id);
    const { attendance_status } = req.body;

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: { attendance_status },
    });

    res.json(registration);
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalEvents, totalRegistrations] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count(),
    ]);

    res.json({ totalUsers, totalEvents, totalRegistrations });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getUsers,
  getRegistrations,
  markAttendance,
  getAnalytics,
};
