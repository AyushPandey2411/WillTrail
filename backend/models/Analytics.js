const mongoose = require('mongoose');

// Lightweight daily-rollup analytics — avoids writing one doc per event
const analyticsSchema = new mongoose.Schema(
  {
    date:  { type: String, required: true },  // 'YYYY-MM-DD'
    event: { type: String, required: true },  // 'user.register', 'directive.save', etc.
    count: { type: Number, default: 1 },
    meta:  { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: false }
);

analyticsSchema.index({ date: -1, event: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
