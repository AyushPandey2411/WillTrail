const router = require('express').Router();
const { getStats, getAnalytics, getUsers, updateUser, getFeedback, updateFeedback } =
  require('../controllers/adminController');
const { protect }      = require('../middleware/authMiddleware');
const { requireRole }  = require('../middleware/rbac');

router.use(protect, requireRole('admin', 'moderator'));

router.get('/stats',          getStats);
router.get('/analytics',      getAnalytics);
router.get('/users',          requireRole('admin'), getUsers);
router.patch('/users/:id',    requireRole('admin'), updateUser);
router.get('/feedback',       getFeedback);
router.patch('/feedback/:id', getFeedback, updateFeedback);

module.exports = router;
