const mongoose = require('mongoose');

const backlogSchema = new mongoose.Schema({
  backlogId: {
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
  skillsNeeded: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  suggestedOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  suggestedReason: {
    type: String,
    default: ''
  },
  approved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

backlogSchema.pre('save', async function(next) {
  if (!this.backlogId) {
    const count = await mongoose.model('Backlog').countDocuments();
    this.backlogId = `BKL-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Backlog', backlogSchema);
