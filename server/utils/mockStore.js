// In-memory resilient store when MongoDB is not connected
const mongoose = require('mongoose');

const users = [
  {
    _id: '670000000000000000000001',
    name: 'Kartik',
    email: 'kartik@femoraah.com',
    role: 'super_admin',
    jobTitle: 'Founder',
    expertise: 'Approvals, escalations, anything not covered above',
    maxOpenTasks: 15,
    isActive: true,
    avatar: ''
  },
  {
    _id: '670000000000000000000002',
    name: 'Shruti',
    email: 'shruti@femoraah.com',
    role: 'team_lead',
    jobTitle: 'Listings & Team Lead',
    expertise: 'Listing on all platforms, handling the team, exchanges, query follow-ups, ad hoc work',
    maxOpenTasks: 10,
    isActive: true,
    avatar: ''
  },
  {
    _id: '670000000000000000000003',
    name: 'Sanket',
    email: 'sanket@femoraah.com',
    role: 'team_lead',
    jobTitle: 'Warehouse Lead',
    expertise: 'Warehouse management, monthly inventory count, packing count, label processing, daily hold sheet, dispatch, Myntra ticket raising',
    maxOpenTasks: 10,
    isActive: true,
    avatar: ''
  },
  {
    _id: '670000000000000000000004',
    name: 'Zinia',
    email: 'zinia@femoraah.com',
    role: 'member',
    jobTitle: 'Customer Support',
    expertise: 'Customer queries, hold status, NDR management, order confirmation calls',
    maxOpenTasks: 10,
    isActive: true,
    avatar: ''
  },
  {
    _id: '670000000000000000000005',
    name: 'Dev',
    email: 'dev@femoraah.com',
    role: 'member',
    jobTitle: 'Packing (reports to Sanket)',
    expertise: 'Packing, plus tasks assigned by Sanket',
    maxOpenTasks: 10,
    isActive: true,
    avatar: ''
  }
];

const now = new Date();
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

let tasks = [
  {
    _id: '670000000000000000000011',
    taskId: 'TSK-0001',
    title: 'New Summer Collection listing on Amazon & Flipkart',
    details: 'Prepare high-res image sets, SEO descriptions, and SKU barcodes for upload.',
    owner: users[1], // Shruti
    assignedBy: users[0],
    priority: 'High',
    status: 'In Progress',
    startDate: twoDaysAgo,
    dueDate: inTwoDays,
    percentComplete: 65,
    lastUpdate: now,
    progressNote: 'Amazon catalog pending final brand approval, Flipkart ready.',
    flag: 'Due Soon'
  },
  {
    _id: '670000000000000000000012',
    taskId: 'TSK-0002',
    title: 'Q3 Physical Inventory Audit & Discrepancy Reconciliation',
    details: 'Audit rack A-F and tally with warehouse management software logs.',
    owner: users[2], // Sanket
    assignedBy: users[0],
    priority: 'Critical',
    status: 'In Progress',
    startDate: twoDaysAgo,
    dueDate: inFiveDays,
    percentComplete: 40,
    lastUpdate: now,
    progressNote: 'Rack A & B completed. Dev assisting with count.',
    flag: 'Due Soon'
  },
  {
    _id: '670000000000000000000013',
    taskId: 'TSK-0003',
    title: 'Resolve pending NDR order delivery escalations',
    details: 'Contact courier partners (Delhivery, Bluedart) for pending delivery cases.',
    owner: users[3], // Zinia
    assignedBy: users[1],
    priority: 'High',
    status: 'Blocked',
    startDate: twoDaysAgo,
    dueDate: yesterday,
    percentComplete: 20,
    lastUpdate: twoDaysAgo,
    progressNote: 'Awaiting courier API response on returned packages.',
    flag: 'Blocked'
  }
];

let backlog = [
  {
    _id: '670000000000000000000021',
    backlogId: 'BKL-0001',
    title: 'Integrate automated WhatsApp shipping notification template',
    details: 'Set up webhook for automatic tracking updates to reduce customer support inbound inquiries.',
    skillsNeeded: 'customer queries, NDR management',
    priority: 'Medium',
    dueDate: inFiveDays,
    requestedBy: users[0],
    suggestedOwner: users[3],
    suggestedReason: 'Matches customer queries and NDR management skills',
    approved: false,
    status: 'Pending',
    dateAdded: twoDaysAgo
  },
  {
    _id: '670000000000000000000022',
    backlogId: 'BKL-0002',
    title: 'Warehouse barcode scanner hardware upgrade',
    details: 'Configure 2 new Bluetooth handheld scanners with packaging terminal.',
    skillsNeeded: 'warehouse management, label processing',
    priority: 'High',
    dueDate: inTwoDays,
    requestedBy: users[2],
    suggestedOwner: users[2],
    suggestedReason: 'Matches warehouse lead skills and label processing',
    approved: false,
    status: 'Pending',
    dateAdded: twoDaysAgo
  }
];

let routineTasks = [
  { _id: '670000000000000000000031', title: 'Reply to customer queries', owner: users[3], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000032', title: 'Update hold status on orders', owner: users[3], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000033', title: 'Follow up on open customer queries', owner: users[1], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000034', title: 'Process exchanges', owner: users[1], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000035', title: 'Check listings are live and correct on all platforms', owner: users[1], frequency: 'Weekly', everyNDays: 7, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' },
  { _id: '670000000000000000000036', title: 'Team check-in: review Task Board with the team', owner: users[1], frequency: 'Weekly', everyNDays: 7, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' },
  { _id: '670000000000000000000037', title: 'Update hold sheet', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000038', title: 'Label processing', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000039', title: 'Dispatch parcels', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000040', title: 'Packing count', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: yesterday, nextDue: now, status: 'Overdue' },
  { _id: '670000000000000000000041', title: 'Raise Myntra tickets for open issues', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000042', title: 'Monthly inventory count', owner: users[2], frequency: 'Monthly', everyNDays: 30, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' },
  { _id: '670000000000000000000043', title: "Assign Dev's tasks for the day", owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000044', title: 'Pack orders', owner: users[4], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000045', title: 'Order Count', owner: users[2], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000046', title: 'Reporting to Kartik for Packing re-order', owner: users[2], frequency: 'Weekly', everyNDays: 7, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' },
  { _id: '670000000000000000000047', title: 'Review open tasks and flags on the Task Board', owner: users[0], frequency: 'Daily', everyNDays: 1, lastDone: now, nextDue: inTwoDays, status: 'OK' },
  { _id: '670000000000000000000048', title: 'Review Backlog: assign ready tasks to owners', owner: users[0], frequency: 'Weekly', everyNDays: 7, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' },
  { _id: '670000000000000000000049', title: 'Review team workload from the Dashboard', owner: users[0], frequency: 'Weekly', everyNDays: 7, lastDone: twoDaysAgo, nextDue: inFiveDays, status: 'OK' }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  isDbConnected,
  users,
  tasks,
  backlog,
  routineTasks
};
