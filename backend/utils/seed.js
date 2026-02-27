/**
 * Seed script — creates an admin user and sample analytics data.
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Feedback = require('../models/Feedback');
const Analytics = require('../models/Analytics');
const connectDB = require('../config/db');

const run = async () => {
  await connectDB();

  // Create admin user
  const existing = await User.findOne({ email: 'admin@willtrail.com' });
  if (!existing) {
    await User.create({
      name: 'WillTrail Admin',
      email: 'admin@willtrail.com',
      password: 'Admin@12345',
      role: 'admin',
      isVerified: true,
    });
    console.log('✅  Admin user created: admin@willtrail.com / Admin@12345');
  } else {
    console.log('ℹ️   Admin user already exists');
  }

  // Seed public testimonials
  const testimonials = [
    { type: 'testimonial', rating: 5, subject: 'Peace of mind finally', message: 'After my father passed without any advance directives, dealing with medical decisions was chaotic and devastating. WillTrail means my family will never face that.', displayName: 'Sarah M.', displayRole: 'Registered Nurse', isPublic: true, status: 'reviewed' },
    { type: 'testimonial', rating: 5, subject: 'My whole team uses it', message: 'I recommended WillTrail to every first responder in my unit. Having instant QR access to patient wishes changes outcomes. This is what healthcare needs.', displayName: 'James R.', displayRole: 'Paramedic, 12 years', isPublic: true, status: 'reviewed' },
    { type: 'testimonial', rating: 5, subject: 'Simple and secure', message: 'I am not technical at all, but I set up my complete vault in under 20 minutes. The QR card is in my wallet. My doctor was impressed.', displayName: 'Linda K.', displayRole: 'Retired Teacher', isPublic: true, status: 'reviewed' },
  ];

  for (const t of testimonials) {
    const exists = await Feedback.findOne({ displayName: t.displayName, type: 'testimonial' });
    if (!exists) await Feedback.create(t);
  }
  console.log('✅  Testimonials seeded');

  // Seed sample analytics (last 7 days)
  const events = ['user.register','directive.save','document.upload','qr.generate','pdf.download'];
  const today  = new Date();
  for (let d = 6; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    for (const event of events) {
      await Analytics.findOneAndUpdate(
        { date: dateStr, event },
        { $set: { count: Math.floor(Math.random() * 30) + 1 } },
        { upsert: true }
      );
    }
  }
  console.log('✅  Sample analytics seeded');

  await mongoose.connection.close();
  console.log('🎉  Seed complete!');
};

run().catch(e => { console.error(e); process.exit(1); });
