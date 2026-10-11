const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'femoraah-default-jwt-secret-2026';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// =================== Google OAuth Routes ===================

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: 'Google OAuth is not configured. Please login with Email/Password.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('/login?error=oauth_not_configured');
  }
  passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' })(req, res, () => {
    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || '';
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  });
});

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
// @desc    Login with email (Auto-provisions user if new, assigns super_admin to owners)
router.post('/login', async (req, res) => {
  try {
    const emailRaw = (req.body.email || '').trim().toLowerCase();
    if (!emailRaw) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const { isDbConnected, users } = require('../utils/mockStore');
    let user;

    if (isDbConnected()) {
      user = await User.findOne({ email: emailRaw, isActive: true });
    } else {
      user = users.find(u => u.email.toLowerCase() === emailRaw && u.isActive);
    }

    // If user does not exist, auto-create them seamlessly
    if (!user) {
      const isSuperAdmin = emailRaw.includes('kartik') || emailRaw.includes('maanav') || emailRaw.includes('manav');
      const namePart = emailRaw.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      if (isDbConnected()) {
        user = await User.create({
          email: emailRaw,
          name: displayName,
          role: isSuperAdmin ? 'super_admin' : 'member',
          jobTitle: isSuperAdmin ? 'Founder / Super Admin' : 'Team Member',
          expertise: isSuperAdmin ? 'Full System & Operations' : 'General Tasks',
          maxOpenTasks: isSuperAdmin ? 20 : 10,
          isActive: true
        });
      } else {
        user = {
          _id: new (require('mongoose').Types.ObjectId)().toString(),
          email: emailRaw,
          name: displayName,
          role: isSuperAdmin ? 'super_admin' : 'member',
          jobTitle: isSuperAdmin ? 'Founder / Super Admin' : 'Team Member',
          expertise: isSuperAdmin ? 'Full System & Operations' : 'General Tasks',
          maxOpenTasks: isSuperAdmin ? 20 : 10,
          isActive: true
        };
        users.push(user);
      }
    }

    if (isDbConnected() && typeof user.save === 'function') {
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
        avatar: user.avatar || '',
        jobTitle: user.jobTitle || 'Team Member'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
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
