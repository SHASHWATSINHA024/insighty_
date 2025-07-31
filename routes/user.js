const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update subreddit preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { subredditPreferences } = req.body;

    if (!Array.isArray(subredditPreferences)) {
      return res.status(400).json({ message: 'Subreddit preferences must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subredditPreferences },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Preferences updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subredditPreferences: user.subredditPreferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subredditPreferences');
    res.json({ subredditPreferences: user.subredditPreferences });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;

    // Check if username or email already exists
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ],
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subredditPreferences: user.subredditPreferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 