const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    const { isDbConnected, users } = require('../utils/mockStore');
    if (isDbConnected()) {
      user = await User.findById(decoded.userId);
    } else {
      user = users.find(u => u._id === decoded.userId || u.email === decoded.userId);
    }
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Check if user can access a specific resource
const canAccessTask = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Super admin and team leads can access all tasks
    if (user.role === 'super_admin' || user.role === 'team_lead') {
      return next();
    }
    
    // Members can only access their own tasks
    const Task = require('../models/Task');
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You can only access your own tasks' });
    }
    
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, authorize, canAccessTask };
