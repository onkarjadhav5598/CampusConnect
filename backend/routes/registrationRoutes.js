const express = require('express');
const router = express.Router();
const { registerForEvent, cancelRegistration } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registerForEvent);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
