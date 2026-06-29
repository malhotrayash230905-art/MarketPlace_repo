const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const auth = require('../middleware/authMiddleware');

// @route   GET api/auth/colleges
// @desc    Get all colleges
// @access  Public
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find({}).sort({ collegeName: 1 });
    res.json(colleges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password, collegeId, age, gender } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Verify college
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(400).json({ msg: 'Invalid college selected' });
    }

    user = new User({
      name,
      email,
      password,
      collegeId,
      age,
      gender
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            totalListings: user.totalListings || 0,
            collegeId: user.collegeId,
            collegeName: college.collegeName
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Populate college
    const college = await College.findById(user.collegeId);

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            totalListings: user.totalListings || 0,
            collegeId: user.collegeId,
            collegeName: college ? college.collegeName : ''
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile details
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, age, gender } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender) user.gender = gender;

    await user.save();

    const college = await College.findById(user.collegeId);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      totalListings: user.totalListings || 0,
      collegeId: user.collegeId,
      collegeName: college ? college.collegeName : ''
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const college = await College.findById(user.collegeId);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      totalListings: user.totalListings || 0,
      collegeId: user.collegeId,
      collegeName: college ? college.collegeName : ''
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
