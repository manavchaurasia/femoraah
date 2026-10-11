const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Backlog = require('../models/Backlog');
const RoutineTask = require('../models/RoutineTask');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard stats (Super Admin / Team Lead only)
router.get('/', authenticate, authorize('super_admin', 'team_lead'), async (req, res) => {
  try {
    const { isDbConnected, users: mockUsers, tasks: mockTasks, backlog: mockBacklog, routineTasks: mockRoutine } = require('../utils/mockStore');
    if (!isDbConnected()) {
      return res.json({
        summary: {
          openTasks: mockTasks.length,
          overdueTasks: mockTasks.filter(t => t.flag === 'Overdue').length,
          blockedTasks: mockTasks.filter(t => t.status === 'Blocked').length,
          dueThisWeek: mockTasks.filter(t => t.flag === 'Due Soon').length,
          staleUpdates: 0,
          unassignedBacklog: mockBacklog.filter(b => b.status === 'Pending').length,
          routineOverdue: mockRoutine.filter(r => r.status === 'Overdue').length
        },
        perPerson: mockUsers.map(u => ({
          user: u,
          openTasks: mockTasks.filter(t => t.owner?._id === u._id).length,
          overdue: 0,
          blocked: mockTasks.filter(t => t.owner?._id === u._id && t.status === 'Blocked').length,
          dueThisWeek: 1,
          staleUpdates: 0,
          hasCapacity: true
        }))
      });
    }

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Overall stats
    const openTasks = await Task.countDocuments({ status: { $nin: ['Done', 'Cancelled'] } });
    const overdueTasks = await Task.countDocuments({ 
      dueDate: { $lt: now }, 
      status: { $nin: ['Done', 'Cancelled'] } 
    });
    const blockedTasks = await Task.countDocuments({ status: 'Blocked' });
    const dueThisWeek = await Task.countDocuments({ 
      dueDate: { $gte: now, $lte: sevenDaysLater },
      status: { $nin: ['Done', 'Cancelled'] }
    });
    const staleUpdates = await Task.countDocuments({ 
      lastUpdate: { $lt: threeDaysAgo },
      status: { $nin: ['Done', 'Cancelled'] }
    });
    const unassignedBacklog = await Backlog.countDocuments({ status: 'Pending' });
    
    // Routine tasks overdue
    const routineOverdue = await RoutineTask.countDocuments({ status: 'Overdue' });

    // Per-person stats
    const users = await User.find({ isActive: true }).select('name email role jobTitle maxOpenTasks avatar');
    const perPerson = [];

    for (const user of users) {
      const userOpen = await Task.countDocuments({ 
        owner: user._id, 
        status: { $nin: ['Done', 'Cancelled'] } 
      });
      const userOverdue = await Task.countDocuments({ 
        owner: user._id, 
        dueDate: { $lt: now }, 
        status: { $nin: ['Done', 'Cancelled'] } 
      });
      const userBlocked = await Task.countDocuments({ 
        owner: user._id, 
        status: 'Blocked' 
      });
      const userDueWeek = await Task.countDocuments({ 
        owner: user._id, 
        dueDate: { $gte: now, $lte: sevenDaysLater },
        status: { $nin: ['Done', 'Cancelled'] }
      });
      const userStale = await Task.countDocuments({ 
        owner: user._id, 
        lastUpdate: { $lt: threeDaysAgo },
        status: { $nin: ['Done', 'Cancelled'] }
      });

      perPerson.push({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          jobTitle: user.jobTitle,
          avatar: user.avatar,
          maxOpenTasks: user.maxOpenTasks
        },
        openTasks: userOpen,
        overdue: userOverdue,
        blocked: userBlocked,
        dueThisWeek: userDueWeek,
        staleUpdates: userStale,
        hasCapacity: userOpen < user.maxOpenTasks
      });
    }

    res.json({
      summary: {
        openTasks,
        overdueTasks,
        blockedTasks,
        dueThisWeek,
        staleUpdates,
        unassignedBacklog,
        routineOverdue
      },
      perPerson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/dashboard/team
// @desc    Get team members (Super Admin / Team Lead)
router.get('/team', authenticate, authorize('super_admin', 'team_lead'), async (req, res) => {
  try {
    const { isDbConnected, users: mockUsers } = require('../utils/mockStore');
    if (!isDbConnected()) {
      return res.json(mockUsers);
    }

    const users = await User.find({ isActive: true })
      .select('-__v')
      .sort({ role: 1, name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/dashboard/team/:id
// @desc    Update team member (Super Admin only)
router.put('/team/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, role, expertise, jobTitle, maxOpenTasks, isActive, email } = req.body;
    
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (expertise !== undefined) user.expertise = expertise;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (maxOpenTasks !== undefined) user.maxOpenTasks = maxOpenTasks;
    if (isActive !== undefined) user.isActive = isActive;
    if (email !== undefined) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
