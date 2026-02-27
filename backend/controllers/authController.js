const jwt  = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'An account with this email already exists' });

    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated. Contact support.' });

    // Track login stats
    await User.findByIdAndUpdate(user._id, {
      $set:  { lastLoginAt: new Date() },
      $inc:  { loginCount: 1 },
    });

    const token = signToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};

module.exports = { register, login, getMe };
