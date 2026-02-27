const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',
  [body('name').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 })],
  register);

router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  login);

router.get('/me', protect, getMe);

module.exports = router;
