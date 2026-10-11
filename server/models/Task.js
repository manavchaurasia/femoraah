const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Blocked', 'Done', 'Cancelled'],
    default: 'Not Started'
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  percentComplete: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdate: {
    type: Date
  },
  progressNote: {
    type: String,
    default: ''
  },
  flag: {
    type: String,
    enum: ['', 'Overdue', 'Due Soon', 'Blocked', 'Done', 'Stale'],
    default: ''
  }
}, {
  timestamps: true
});

// Auto-generate task ID
taskSchema.pre('save', async function(next) {
  if (!this.taskId) {
    const count = await mongoose.model('Task').countDocuments();
    this.taskId = `TSK-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Auto-calculate flag
  const now = new Date();
  if (this.status === 'Done') {
    this.flag = 'Done';
  } else if (this.status === 'Blocked') {
    this.flag = 'Blocked';
  } else if (this.dueDate && this.dueDate < now) {
    this.flag = 'Overdue';
  } else if (this.dueDate) {
    const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (this.dueDate <= threeDays) {
      this.flag = 'Due Soon';
    }
  }
  
  // Check stale (no update in 3+ days)
  if (this.lastUpdate && this.status !== 'Done' && this.status !== 'Cancelled') {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    if (this.lastUpdate < threeDaysAgo && this.flag !== 'Overdue') {
      this.flag = 'Stale';
    }
  }
  
  next();
});

taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ flag: 1 });

module.exports = mongoose.model('Task', taskSchema);
