const express = require('express');
const router = express.Router();
const { getUserProfile, getUserEvents, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getUserProfile);
router.get('/my-events', protect, getUserEvents);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
