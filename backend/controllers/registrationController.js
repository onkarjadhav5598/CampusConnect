const prisma = require('../utils/prisma');
const { createNotification } = require('./notificationController');

const registerForEvent = async (req, res, next) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id; // From auth middleware

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(event_id) },
    });

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        user_id_event_id: {
          user_id: user_id,
          event_id: parseInt(event_id),
        },
      },
    });

    if (existingRegistration) {
      res.status(400);
      throw new Error('Already registered for this event');
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        user_id,
        event_id: parseInt(event_id),
      },
    });

    // Create notification
    await createNotification(
      user_id,
      `Successfully registered for ${event.title}! 🎉`,
      'success'
    );

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

const cancelRegistration = async (req, res, next) => {
  try {
    const registrationId = parseInt(req.params.id);
    const user_id = req.user.id;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      res.status(404);
      throw new Error('Registration not found');
    }

    // Ensure users can only cancel their own registration
    if (registration.user_id !== user_id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this registration');
    }

    await prisma.registration.delete({
      where: { id: registrationId },
    });

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerForEvent, cancelRegistration };
