const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticate, authorize, canAccessTask } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get tasks (filtered by role)
router.get('/', authenticate, async (req, res) => {
  try {
    const { isDbConnected, tasks: mockTasks } = require('../utils/mockStore');
    if (!isDbConnected()) {
      let filtered = [...mockTasks];
      if (req.user.role === 'member') {
        filtered = filtered.filter(t => t.owner?._id === req.user._id || t.owner?.email === req.user.email);
      }
      return res.json({
        tasks: filtered,
        pagination: { page: 1, limit: 50, total: filtered.length, pages: 1 }
      });
    }

    const { status, priority, owner, flag, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    // Members can only see their own tasks
    if (req.user.role === 'member') {
      filter.owner = req.user._id;
    } else if (owner) {
      filter.owner = owner;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (flag) filter.flag = flag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { progressNote: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('owner', 'name email avatar role jobTitle')
      .populate('assignedBy', 'name email avatar')
      .sort({ dueDate: 1, priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
router.get('/:id', authenticate, canAccessTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('owner', 'name email avatar role jobTitle')
      .populate('assignedBy', 'name email avatar');
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task (Super Admin / Team Lead only)
router.post('/', authenticate, authorize('super_admin', 'team_lead'), async (req, res) => {
  try {
    const { title, details, owner, priority, status, startDate, dueDate, percentComplete, progressNote } = req.body;
    
    // Verify owner exists
    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(400).json({ message: 'Owner user not found' });
    }

    const task = await Task.create({
      title,
      details,
      owner,
      assignedBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'Not Started',
      startDate,
      dueDate,
      percentComplete: percentComplete || 0,
      progressNote,
      lastUpdate: new Date()
    });

    const populated = await Task.findById(task._id)
      .populate('owner', 'name email avatar role jobTitle')
      .populate('assignedBy', 'name email avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', authenticate, canAccessTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const allowedUpdates = req.user.role === 'member' 
      ? ['status', 'percentComplete', 'progressNote', 'lastUpdate']
      : ['title', 'details', 'owner', 'priority', 'status', 'startDate', 'dueDate', 'percentComplete', 'progressNote', 'lastUpdate'];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    updates.lastUpdate = new Date();

    Object.assign(task, updates);
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('owner', 'name email avatar role jobTitle')
      .populate('assignedBy', 'name email avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (Super Admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
