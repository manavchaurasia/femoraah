const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// =================== Google OAuth Routes ===================

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// =================== Email/Password Auth (Fallback) ===================

// @route   POST /api/auth/register
// @desc    Register a new user (Super Admin only)
router.post('/register', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { email, name, role, expertise, jobTitle, maxOpenTasks } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      email,
      name,
      role: role || 'member',
      expertise: expertise || '',
      jobTitle: jobTitle || '',
      maxOpenTasks: maxOpenTasks || 10
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login with email (simplified - for demo purposes, no password needed if Google OAuth is primary)
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const { isDbConnected, users } = require('../utils/mockStore');
    let user;

    if (isDbConnected()) {
      user = await User.findOne({ email, isActive: true });
    } else {
      user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.isActive);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or user not found' });
    }

    if (isDbConnected()) {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        jobTitle: user.jobTitle
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/seed
// @desc    Seed initial team members (run once)
router.post('/seed', async (req, res) => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({ message: 'Database already has users. Seed skipped.' });
    }

    const teamMembers = [
      {
        name: 'Kartik',
        email: 'kartik@femoraah.com',
        role: 'super_admin',
        jobTitle: 'Founder',
        expertise: 'Approvals, escalations, anything not covered above',
        maxOpenTasks: 15
      },
      {
        name: 'Shruti',
        email: 'shruti@femoraah.com',
        role: 'team_lead',
        jobTitle: 'Listings & Team Lead',
        expertise: 'Listing on all platforms, handling the team, exchanges, query follow-ups, ad hoc work',
        maxOpenTasks: 10
      },
      {
        name: 'Sanket',
        email: 'sanket@femoraah.com',
        role: 'team_lead',
        jobTitle: 'Warehouse Lead',
        expertise: 'Warehouse management, monthly inventory count, packing count, label processing, daily hold sheet, dispatch, Myntra ticket raising',
        maxOpenTasks: 10
      },
      {
        name: 'Zinia',
        email: 'zinia@femoraah.com',
        role: 'member',
        jobTitle: 'Customer Support',
        expertise: 'Customer queries, hold status, NDR management, order confirmation calls',
        maxOpenTasks: 10
      },
      {
        name: 'Dev',
        email: 'dev@femoraah.com',
        role: 'member',
        jobTitle: 'Packing (reports to Sanket)',
        expertise: 'Packing, plus tasks assigned by Sanket',
        maxOpenTasks: 10
      }
    ];

    const users = await User.insertMany(teamMembers);
    res.json({ message: 'Team seeded successfully', users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
