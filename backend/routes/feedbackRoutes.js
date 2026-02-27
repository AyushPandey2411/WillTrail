const router  = require('express').Router();
const { submitFeedback, getTestimonials } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Anyone can read public testimonials
router.get('/testimonials', getTestimonials);

// Auth optional for submission — use protect + optional user
router.post('/', protect, submitFeedback);

module.exports = router;
