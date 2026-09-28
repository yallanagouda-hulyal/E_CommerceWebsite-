const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const user = await User.create({ name, email, password });
    res.json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: sign(user._id),
    });
  } catch (e) { next(e); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: sign(user._id),
    });
  } catch (e) { next(e); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.user));

// GET /api/auth/users (admin only)
router.get('/users', protect, admin, async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json(users);
  } catch (e) { next(e); }
});

// PUT /api/auth/users/:id (admin only) - toggle admin role
router.put('/users/:id', protect, admin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot revoke your own admin rights' });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json(user);
  } catch (e) { next(e); }
});

// DELETE /api/auth/users/:id (admin only)
router.delete('/users/:id', protect, admin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
