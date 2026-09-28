const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and attach user
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function admin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ message: 'Admin only' });
}

module.exports = { protect, admin };
