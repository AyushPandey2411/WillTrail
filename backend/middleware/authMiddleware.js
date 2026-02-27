const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ message: 'Not authorised — no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user)           return res.status(401).json({ message: 'User not found' });
    if (!user.isActive)  return res.status(403).json({ message: 'Account is deactivated' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorised — invalid token' });
  }
};

module.exports = { protect };
