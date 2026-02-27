const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // optional (anonymous allowed)
    type:     { type: String, enum: ['bug', 'feature', 'general', 'testimonial'], required: true },
    rating:   { type: Number, min: 1, max: 5 },
    subject:  { type: String, maxlength: 200 },
    message:  { type: String, required: true, maxlength: 2000 },
    isPublic: { type: Boolean, default: false },  // testimonials can be made public
    status:   { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' },
    adminNote:{ type: String, maxlength: 500 },
    // For testimonials shown on About page
    displayName: { type: String },
    displayRole: { type: String },
  },
  { timestamps: true }
);

feedbackSchema.index({ type: 1, isPublic: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
