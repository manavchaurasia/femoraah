const mongoose = require('mongoose');

const routineTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  everyNDays: {
    type: Number,
    default: 1
  },
  lastDone: {
    type: Date
  },
  nextDue: {
    type: Date
  },
  status: {
    type: String,
    enum: ['OK', 'Overdue', 'Not logged yet'],
    default: 'Not logged yet'
  },
  notes: {
    type: String,
    default: ''
  },
  isHoliday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate next due and status
routineTaskSchema.pre('save', function(next) {
  if (this.lastDone && this.everyNDays) {
    const nextDue = new Date(this.lastDone);
    nextDue.setDate(nextDue.getDate() + this.everyNDays);
    this.nextDue = nextDue;
    
    const now = new Date();
    this.status = now > nextDue ? 'Overdue' : 'OK';
  }
  next();
});

module.exports = mongoose.model('RoutineTask', routineTaskSchema);
