const express = require('express');
const RoutineTask = require('../models/RoutineTask');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/routine-tasks
// @desc    Get routine tasks (filtered by role)
router.get('/', authenticate, async (req, res) => {
  try {
    const { isDbConnected, routineTasks: mockRoutine } = require('../utils/mockStore');
    if (!isDbConnected()) {
      let filtered = [...mockRoutine];
      if (req.user.role === 'member') {
        filtered = filtered.filter(r => r.owner?._id === req.user._id || r.owner?.email === req.user.email);
      }
      return res.json(filtered);
    }

    const filter = {};

    // Members can only see their own routine tasks
    if (req.user.role === 'member') {
      filter.owner = req.user._id;
    } else if (req.query.owner) {
      filter.owner = req.query.owner;
    }

    const tasks = await RoutineTask.find(filter)
      .populate('owner', 'name email avatar jobTitle')
      .sort({ frequency: 1, title: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/routine-tasks
// @desc    Create a routine task (Super Admin / Team Lead)
router.post('/', authenticate, authorize('super_admin', 'team_lead'), async (req, res) => {
  try {
    const { title, owner, frequency, everyNDays, notes } = req.body;

    const task = await RoutineTask.create({
      title,
      owner,
      frequency: frequency || 'Daily',
      everyNDays: everyNDays || 1,
      notes
    });

    const populated = await RoutineTask.findById(task._id)
      .populate('owner', 'name email avatar jobTitle');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/routine-tasks/:id/log
// @desc    Log a routine task as done (mark today as last done)
router.put('/:id/log', authenticate, async (req, res) => {
  try {
    const task = await RoutineTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Routine task not found' });

    // Members can only log their own tasks
    if (req.user.role === 'member' && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only log your own routine tasks' });
    }

    task.lastDone = new Date();
    task.notes = req.body.notes || task.notes;
    await task.save();

    const populated = await RoutineTask.findById(task._id)
      .populate('owner', 'name email avatar jobTitle');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/routine-tasks/:id
// @desc    Update a routine task (Super Admin / Team Lead)
router.put('/:id', authenticate, authorize('super_admin', 'team_lead'), async (req, res) => {
  try {
    const task = await RoutineTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Routine task not found' });

    const { title, owner, frequency, everyNDays, notes, isHoliday } = req.body;
    
    if (title !== undefined) task.title = title;
    if (owner !== undefined) task.owner = owner;
    if (frequency !== undefined) task.frequency = frequency;
    if (everyNDays !== undefined) task.everyNDays = everyNDays;
    if (notes !== undefined) task.notes = notes;
    if (isHoliday !== undefined) task.isHoliday = isHoliday;

    await task.save();

    const populated = await RoutineTask.findById(task._id)
      .populate('owner', 'name email avatar jobTitle');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/routine-tasks/:id
// @desc    Delete a routine task (Super Admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    await RoutineTask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Routine task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/routine-tasks/seed
// @desc    Seed routine tasks from the spreadsheet data
router.post('/seed', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const existingCount = await RoutineTask.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ message: 'Routine tasks already exist. Seed skipped.' });
    }

    const users = await User.find();
    const userMap = {};
    users.forEach(u => { userMap[u.name.toLowerCase()] = u._id; });

    const routineTasks = [
      { title: 'Reply to customer queries', owner: userMap['zinia'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Update hold status on orders', owner: userMap['zinia'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Follow up on open customer queries', owner: userMap['shruti'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Process exchanges', owner: userMap['shruti'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Check listings are live and correct on all platforms', owner: userMap['shruti'], frequency: 'Weekly', everyNDays: 7 },
      { title: 'Team check-in: review Task Board with the team', owner: userMap['shruti'], frequency: 'Weekly', everyNDays: 7 },
      { title: 'Update hold sheet', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Label processing', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Dispatch parcels', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Packing count', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Raise Myntra tickets for open issues', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Monthly inventory count', owner: userMap['sanket'], frequency: 'Monthly', everyNDays: 30 },
      { title: 'Assign Dev\'s tasks for the day', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Pack orders', owner: userMap['dev'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Order Count', owner: userMap['sanket'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Reporting to Kartik for Packing re-order', owner: userMap['sanket'], frequency: 'Weekly', everyNDays: 7 }
    ];

    await RoutineTask.insertMany(routineTasks);
    res.json({ message: 'Routine tasks seeded successfully', count: routineTasks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
