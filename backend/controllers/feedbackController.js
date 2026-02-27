const Feedback = require('../models/Feedback');

// Submit feedback (authenticated or anonymous)
const submitFeedback = async (req, res) => {
  try {
    const { type, rating, subject, message, displayName, displayRole } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const fb = await Feedback.create({
      user:        req.user?._id,
      type:        type || 'general',
      rating,
      subject,
      message,
      displayName: displayName || req.user?.name,
      displayRole,
    });

    res.status(201).json({ message: 'Thank you for your feedback!', id: fb._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Get public testimonials (no auth needed)
const getTestimonials = async (req, res) => {
  try {
    const items = await Feedback.find({ type: 'testimonial', isPublic: true, status: 'reviewed' })
      .select('rating subject message displayName displayRole createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(items);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { submitFeedback, getTestimonials };
