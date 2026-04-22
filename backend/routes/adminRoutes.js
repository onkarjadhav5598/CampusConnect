const express = require('express');
const router = express.Router();
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getUsers,
  getRegistrations,
  markAttendance,
  getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

// Ensure all routes below are protected and require admin execution
router.use(protect, admin);

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

router.get('/users', getUsers);
router.get('/registrations', getRegistrations);
router.put('/attendance/:id', markAttendance);
router.get('/analytics', getAnalytics);

module.exports = router;
