const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['super_admin', 'team_lead', 'member'],
    default: 'member'
  },
  expertise: {
    type: String,
    default: ''
  },
  jobTitle: {
    type: String,
    default: ''
  },
  maxOpenTasks: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for open tasks count
userSchema.virtual('openTasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
  count: true,
  match: { status: { $nin: ['Done', 'Cancelled'] } }
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
