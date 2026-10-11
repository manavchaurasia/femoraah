const express = require('express');
const Backlog = require('../models/Backlog');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/backlog
// @desc    Get all backlog items
router.get('/', authenticate, async (req, res) => {
  try {
    const { isDbConnected, backlog: mockBacklog } = require('../utils/mockStore');
    if (!isDbConnected()) {
      return res.json(mockBacklog);
    }

    const { status, priority } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const items = await Backlog.find(filter)
      .populate('requestedBy', 'name email')
      .populate('suggestedOwner', 'name email expertise')
      .sort({ priority: -1, dateAdded: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/backlog
// @desc    Add item to backlog (anyone can add)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, details, skillsNeeded, priority, dueDate } = req.body;

    const item = await Backlog.create({
      title,
      details,
      skillsNeeded,
      priority,
      dueDate,
      requestedBy: req.user._id,
      dateAdded: new Date()
    });

    // Auto-suggest owner based on skills matching
    const users = await User.find({ isActive: true });
    let bestMatch = null;
    let bestScore = 0;

    if (skillsNeeded) {
      const neededSkills = skillsNeeded.toLowerCase().split(',').map(s => s.trim());
      
      for (const user of users) {
        const userSkills = user.expertise.toLowerCase();
        let score = 0;
        for (const skill of neededSkills) {
          if (userSkills.includes(skill)) score++;
        }
        
        // Factor in capacity
        const openTaskCount = await Task.countDocuments({ 
          owner: user._id, 
          status: { $nin: ['Done', 'Cancelled'] } 
        });
        
        if (openTaskCount < user.maxOpenTasks && score > bestScore) {
          bestScore = score;
          bestMatch = user;
        }
      }
    }

    if (bestMatch) {
      item.suggestedOwner = bestMatch._id;
      item.suggestedReason = `Skills match + has capacity (${await Task.countDocuments({ owner: bestMatch._id, status: { $nin: ['Done', 'Cancelled'] } })}/${bestMatch.maxOpenTasks} tasks)`;
      await item.save();
    }

    const populated = await Backlog.findById(item._id)
      .populate('requestedBy', 'name email')
      .populate('suggestedOwner', 'name email expertise');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/backlog/:id/approve
// @desc    Approve a backlog item and move to Task Board (Super Admin only)
router.put('/:id/approve', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const item = await Backlog.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Backlog item not found' });

    const ownerId = req.body.owner || item.suggestedOwner;
    if (!ownerId) {
      return res.status(400).json({ message: 'An owner must be specified or suggested' });
    }

    // Create task from backlog
    const task = await Task.create({
      title: item.title,
      details: item.details,
      owner: ownerId,
      assignedBy: req.user._id,
      priority: item.priority,
      dueDate: item.dueDate,
      lastUpdate: new Date()
    });

    // Update backlog status
    item.approved = true;
    item.status = 'Assigned';
    await item.save();

    const populated = await Task.findById(task._id)
      .populate('owner', 'name email avatar role jobTitle')
      .populate('assignedBy', 'name email avatar');

    res.json({ message: 'Backlog item approved and moved to Task Board', task: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/backlog/:id/reject
// @desc    Reject a backlog item (Super Admin only)
router.put('/:id/reject', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const item = await Backlog.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Backlog item not found' });

    item.status = 'Rejected';
    await item.save();

    res.json({ message: 'Backlog item rejected', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/backlog/:id
// @desc    Delete backlog item (Super Admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    await Backlog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Backlog item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
