require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const RoutineTask = require('./models/RoutineTask');
const Backlog = require('./models/Backlog');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected.');

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Task.deleteMany({}),
      RoutineTask.deleteMany({}),
      Backlog.deleteMany({})
    ]);

    console.log('🌱 Seeding Team Members...');
    const users = await User.insertMany([
      {
        name: 'Manav',
        email: 'maanavc2006@gmail.com',
        role: 'super_admin',
        jobTitle: 'Founder & Admin',
        expertise: 'Full Operations & System Admin',
        maxOpenTasks: 20
      },
      {
        name: 'Kartik',
        email: 'kartik@femoraah.com',
        role: 'super_admin',
        jobTitle: 'Founder',
        expertise: 'Approvals, escalations, anything not covered above',
        maxOpenTasks: 15
      },
      {
        name: 'Shruti',
        email: 'shruti@femoraah.com',
        role: 'team_lead',
        jobTitle: 'Listings & Team Lead',
        expertise: 'Listing on all platforms, handling the team, exchanges, query follow-ups, ad hoc work',
        maxOpenTasks: 10
      },
      {
        name: 'Sanket',
        email: 'sanket@femoraah.com',
        role: 'team_lead',
        jobTitle: 'Warehouse Lead',
        expertise: 'Warehouse management, monthly inventory count, packing count, label processing, daily hold sheet, dispatch, Myntra ticket raising',
        maxOpenTasks: 10
      },
      {
        name: 'Zinia',
        email: 'zinia@femoraah.com',
        role: 'member',
        jobTitle: 'Customer Support',
        expertise: 'Customer queries, hold status, NDR management, order confirmation calls',
        maxOpenTasks: 10
      },
      {
        name: 'Dev',
        email: 'dev@femoraah.com',
        role: 'member',
        jobTitle: 'Packing (reports to Sanket)',
        expertise: 'Packing, plus tasks assigned by Sanket',
        maxOpenTasks: 10
      }
    ]);

    const userMap = {};
    users.forEach(u => {
      userMap[u.name.toLowerCase()] = u._id;
    });

    console.log('🌱 Seeding Routine Tasks...');
    await RoutineTask.insertMany([
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
      { title: 'Raise tickets on Myntra for missing/damaged returns', owner: userMap['sanket'], frequency: 'Weekly', everyNDays: 7 },
      { title: 'Monthly inventory count', owner: userMap['sanket'], frequency: 'Monthly', everyNDays: 30 },
      { title: 'Review open tasks and flags on the Task Board', owner: userMap['kartik'], frequency: 'Daily', everyNDays: 1 },
      { title: 'Review Backlog: assign ready tasks to owners', owner: userMap['kartik'], frequency: 'Weekly', everyNDays: 7 },
      { title: 'Review team workload from the Dashboard', owner: userMap['kartik'], frequency: 'Weekly', everyNDays: 7 }
    ]);

    console.log('🌱 Seeding Sample Active Tasks...');
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const pastDue = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    await Task.insertMany([
      {
        taskId: 'TSK-0001',
        title: 'New Summer Collection listing on Amazon & Flipkart',
        details: 'Prepare high-res image sets, SEO descriptions, and SKU barcodes for upload.',
        owner: userMap['shruti'],
        assignedBy: userMap['kartik'],
        priority: 'High',
        status: 'In Progress',
        startDate: twoDaysAgo,
        dueDate: inTwoDays,
        percentComplete: 65,
        lastUpdate: now,
        progressNote: 'Amazon catalog pending final brand approval, Flipkart ready.'
      },
      {
        taskId: 'TSK-0002',
        title: 'Q3 Physical Inventory Audit & Discrepancy Reconciliation',
        details: 'Audit rack A-F and tally with warehouse management software logs.',
        owner: userMap['sanket'],
        assignedBy: userMap['kartik'],
        priority: 'Critical',
        status: 'In Progress',
        startDate: twoDaysAgo,
        dueDate: inFiveDays,
        percentComplete: 40,
        lastUpdate: now,
        progressNote: 'Rack A & B completed. Dev assisting with count.'
      },
      {
        taskId: 'TSK-0003',
        title: 'Resolve pending NDR order delivery escalations',
        details: 'Contact courier partners (Delhivery, Bluedart) for pending delivery cases.',
        owner: userMap['zinia'],
        assignedBy: userMap['shruti'],
        priority: 'High',
        status: 'Blocked',
        startDate: twoDaysAgo,
        dueDate: pastDue,
        percentComplete: 20,
        lastUpdate: twoDaysAgo,
        progressNote: 'Awaiting courier API response on returned packages.'
      }
    ]);

    console.log('🌱 Seeding Backlog items...');
    await Backlog.insertMany([
      {
        backlogId: 'BKL-0001',
        title: 'Integrate automated WhatsApp shipping notification template',
        details: 'Set up webhook for automatic tracking updates to reduce customer support inbound inquiries.',
        skillsNeeded: 'customer queries, NDR management',
        priority: 'Medium',
        dueDate: inFiveDays,
        requestedBy: userMap['kartik'],
        suggestedOwner: userMap['zinia'],
        suggestedReason: 'Matches expertise in Customer Support & customer queries.',
        approved: false,
        status: 'Pending'
      },
      {
        backlogId: 'BKL-0002',
        title: 'Warehouse barcode scanner hardware upgrade',
        details: 'Configure 2 new Bluetooth handheld scanners with packaging terminal.',
        skillsNeeded: 'warehouse management, label processing',
        priority: 'High',
        dueDate: inTwoDays,
        requestedBy: userMap['sanket'],
        suggestedOwner: userMap['sanket'],
        suggestedReason: 'Matches warehouse lead skills and label processing.',
        approved: false,
        status: 'Pending'
      }
    ]);

    console.log('🎉 Seed complete! All collections populated.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
