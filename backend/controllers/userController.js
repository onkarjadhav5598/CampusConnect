const prisma = require('../utils/prisma');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

const getUserEvents = async (req, res, next) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { user_id: req.user.id },
      include: {
        event: true,
      },
    });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { full_name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { full_name, email },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, getUserEvents, updateUserProfile };
