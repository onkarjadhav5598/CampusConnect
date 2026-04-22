const prisma = require('../utils/prisma');

const submitFeedback = async (req, res, next) => {
  try {
    const { event_id, rating, comments } = req.body;
    const user_id = req.user.id;

    // Verify registration
    const registration = await prisma.registration.findUnique({
      where: {
        user_id_event_id: {
          user_id,
          event_id: parseInt(event_id),
        },
      },
    });

    if (!registration) {
      res.status(400);
      throw new Error('You must be registered for the event to submit feedback');
    }

    // Upsert feedback
    const feedback = await prisma.feedback.upsert({
      where: {
        user_id_event_id: {
          user_id,
          event_id: parseInt(event_id),
        },
      },
      update: {
        rating: parseInt(rating),
        comments,
      },
      create: {
        user_id,
        event_id: parseInt(event_id),
        rating: parseInt(rating),
        comments,
      },
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const getEventFeedback = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);

    const feedbacks = await prisma.feedback.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          select: { full_name: true },
        },
      },
    });

    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getEventFeedback };
