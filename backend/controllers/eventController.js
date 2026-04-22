const prisma = require('../utils/prisma');

const getEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { event_date: 'asc' },
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        creator: {
          select: { full_name: true, email: true },
        },
      },
    });

    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById };
