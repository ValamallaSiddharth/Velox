const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

/* ── POST /api/auth/register ─────────────────────────────── */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill in all fields' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Account created successfully!',
      token:   generateToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/* ── POST /api/auth/login ────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please provide email and password' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      message: 'Login successful!',
      token:   generateToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/* ── POST /api/auth/social ───────────────────────────────────
   Called after Firebase Google sign-in succeeds on the frontend.
   Accepts { name, email, googleId } — no password needed.
   Creates user if new, logs in if existing.
   ─────────────────────────────────────────────────────────── */
router.post('/social', async (req, res) => {
  const { name, email, googleId } = req.body;

  if (!email || !name)
    return res.status(400).json({ message: 'Missing user data from Google' });

  try {
    let user = await User.findOne({ email });

    if (!user) {
      /* New Google user — create without password (use googleId as placeholder) */
      user = await User.create({
        name,
        email,
        password: googleId || `google_${Date.now()}`, // hashed by pre-save hook
        provider: 'google',
      });
    }

    res.json({
      message: 'Social login successful!',
      token:   generateToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Social login error:', err.message);
    res.status(500).json({ message: 'Server error during social login' });
  }
});

module.exports = router;
