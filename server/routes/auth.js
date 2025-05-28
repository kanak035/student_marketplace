const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Email validation function
const isValidCollegeEmail = (email) => {
  return email && typeof email === 'string' && email.toLowerCase().endsWith('@iiitm.ac.in');
};

// Signup
router.post('/signup', async (req, res) => {
  console.log('Signup request body:', req.body); // Debug log
  const { email, password, name, collegeId } = req.body;

  try {
    // Validate email
    if (!isValidCollegeEmail(email)) {
      return res.status(400).json({ msg: 'Email must end with @iiitm.ac.in' });
    }

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, name, collegeId });
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'your_jwt_secret_key_here', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.log('Signup error:', err.message); // Debug log
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body); // Debug log
  const { email, password } = req.body;

  try {
    // Validate email
    if (!isValidCollegeEmail(email)) {
      return res.status(400).json({ msg: 'Email must end with @collegeitm.ac.in' });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'your_jwt_secret_key_here', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.log('Login error:', err.message); // Debug log
    res.status(500).json({ msg: 'Server error' });
  }
});

// Protected route
router.get('/protected', auth, (req, res) => {
  res.json({ msg: 'Protected route accessed', userId: req.user });
});

module.exports = router;