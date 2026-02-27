const User      = require('../models/User');
const Directive  = require('../models/Directive');
const Document   = require('../models/Document');
const Feedback   = require('../models/Feedback');
const Analytics  = require('../models/Analytics');

// GET /api/admin/stats — platform overview
const getStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, completedDirectives, totalDocs, pendingFeedback] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Directive.countDocuments({ isComplete: true }),
        Document.countDocuments(),
        Feedback.countDocuments({ status: 'new' }),
      ]);

    // Growth: new users last 7 days
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers7d = await User.countDocuments({ createdAt: { $gte: since7d } });

    res.json({ totalUsers, activeUsers, completedDirectives, totalDocs, pendingFeedback, newUsers7d });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/admin/analytics?days=7
const getAnalytics = async (req, res) => {
  try {
    const days  = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const dateStr = since.toISOString().split('T')[0];

    const rows = await Analytics.find({ date: { $gte: dateStr } }).sort({ date: 1 });
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PATCH /api/admin/users/:id — toggle active / change role
const updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const allowed = {};
    if (typeof isActive === 'boolean') allowed.isActive = isActive;
    if (role && ['user','moderator','admin'].includes(role)) allowed.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/admin/feedback
const getFeedback = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type)   filter.type   = req.query.type;

    const items = await Feedback.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(items);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PATCH /api/admin/feedback/:id
const updateFeedback = async (req, res) => {
  try {
    const { status, isPublic, adminNote } = req.body;
    const fb = await Feedback.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(typeof isPublic === 'boolean' && { isPublic }), ...(adminNote && { adminNote }) },
      { new: true }
    );
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    res.json(fb);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getStats, getAnalytics, getUsers, updateUser, getFeedback, updateFeedback };
