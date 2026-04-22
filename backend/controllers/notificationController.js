const prisma = require('../utils/prisma');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      take: 20,
    });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { read: true },
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// Internal helper for create
const createNotification = async (userId, message, type = 'info') => {
  try {
    await prisma.notification.create({
      data: {
        user_id: userId,
        message,
        type,
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };
