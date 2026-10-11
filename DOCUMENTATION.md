# Femoraah — Team Task Command Center
## Comprehensive System, Architecture, RBAC & Deployment Documentation

---

## 1. Executive Summary

This application transforms the Femoraah operations spreadsheet into a modern, real-time, production-ready web application. It eliminates manual spreadsheet maintenance, lost tasks, and status sync bottlenecks while enforcing strict **Role-Based Access Control (RBAC)**.

### Key Objectives Achieved:
- **Super Admin Privilege for Kartik:** Kartik has absolute oversight across all team tasks, approval gates, capacity balances, and role assignments.
- **Role-Based Authorization:** Team members only see and update their own assigned tasks, while Leads and Super Admins manage cross-functional workflows.
- **SLA Flag Automation:** Tasks automatically compute flags (`Overdue`, `Due Soon`, `Blocked`, `Stale`) based on due dates and progress timestamps.
- **Smart Backlog Allocation:** Backlog items match required skills against member expertise profiles and recommend the optimal owner.
- **One-Click Routine Logging:** Routine checklists auto-reschedule their next due date based on cadence (Daily, Weekly, Monthly).
- **Production-Ready & Deployable:** Integrated React 19 frontend + Express 5 backend with JWT and Google OAuth authentication.

---

## 2. Authentication & Authorization (RBAC) Architecture

### 2.1 Role Hierarchy

| Role | Primary User / Group | Description |
| :--- | :--- | :--- |
| **`super_admin`** | **Kartik** (Founder) | Full global authority. Can create/edit/delete any task, override roles, approve backlog items, manage team capacity, and view aggregate executive dashboards. |
| **`team_lead`** | **Shruti** (Listings Lead), **Sanket** (Warehouse Lead) | Team oversight. Can view all team tasks, assign tasks to members, approve backlog items, and view dashboard analytics. |
| **`member`** | **Zinia** (Customer Support), **Dev** (Packing), and new staff | Scoped view. Can view only their own assigned tasks, update their progress %, log their routine tasks, and submit proposals to the backlog. |

### 2.2 Role & Feature Matrix

| Feature | Member | Team Lead | Super Admin (Kartik) |
| :--- | :---: | :---: | :---: |
| **Executive Dashboard & Analytics** | ❌ Restricted | ✅ Allowed | ✅ Full Access |
| **Task Board: View All Tasks** | ❌ (Own tasks only) | ✅ Allowed | ✅ Allowed |
| **Task Board: Create / Assign Tasks** | ❌ Restricted | ✅ Allowed | ✅ Allowed |
| **Task Board: Update Progress / Notes** | ✅ (Own tasks only) | ✅ Any task | ✅ Any task |
| **Task Board: Delete Tasks** | ❌ Restricted | ❌ Restricted | ✅ Allowed |
| **Backlog: Submit New Request** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Backlog: Approve & Assign** | ❌ Restricted | ✅ Allowed | ✅ Allowed |
| **Routine Tasks: Log Today's Done** | ✅ (Own routines) | ✅ Any routine | ✅ Any routine |
| **Routine Tasks: Add / Edit Routine** | ❌ Restricted | ✅ Allowed | ✅ Allowed |
| **Team Management & Role Delegation** | ❌ Restricted | ❌ Restricted | ✅ Exclusive to Kartik |

### 2.3 Authentication Methods

1. **Google OAuth 2.0 (Passport):**
   - Direct SSO via Google Workspace / Gmail.
   - Initial sync checks if the email or display name matches `kartik`, automatically assigning the `super_admin` role.
   - On successful callback, a 7-day signed JWT is issued and passed to the frontend client.

2. **JWT Email Authentication (Fallback / Demo):**
   - Members can authenticate using their registered team email address.
   - Token payload: `{ userId: "<mongo_id>" }` signed with `JWT_SECRET`.
   - Client sends token in `Authorization: Bearer <token>` header on all requests.

---

## 3. Database Schema & Data Models

### 3.1 `User` Model
```javascript
{
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['super_admin', 'team_lead', 'member'], default: 'member' },
  expertise: { type: String, default: '' },       // Used for auto-matching in Backlog
  jobTitle: { type: String, default: '' },
  maxOpenTasks: { type: Number, default: 10 },    // Capacity throttle
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}
```

### 3.2 `Task` Model
```javascript
{
  taskId: { type: String, unique: true },        // Auto-generated: TSK-0001
  title: { type: String, required: true },
  details: { type: String, default: '' },
  owner: { type: ObjectId, ref: 'User', required: true },
  assignedBy: { type: ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Blocked', 'Done', 'Cancelled'], default: 'Not Started' },
  startDate: { type: Date },
  dueDate: { type: Date },
  percentComplete: { type: Number, default: 0, min: 0, max: 100 },
  lastUpdate: { type: Date },
  progressNote: { type: String, default: '' },
  flag: { type: String, enum: ['', 'Overdue', 'Due Soon', 'Blocked', 'Done', 'Stale'], default: '' }
}
```

### 3.3 `Backlog` Model
```javascript
{
  backlogId: { type: String, unique: true },     // Auto-generated: BKL-0001
  title: { type: String, required: true },
  details: { type: String, default: '' },
  skillsNeeded: { type: String, default: '' },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: { type: Date },
  requestedBy: { type: ObjectId, ref: 'User' },
  suggestedOwner: { type: ObjectId, ref: 'User' },
  suggestedReason: { type: String, default: '' },
  approved: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Assigned', 'Rejected'], default: 'Pending' }
}
```

### 3.4 `RoutineTask` Model
```javascript
{
  title: { type: String, required: true },
  owner: { type: ObjectId, ref: 'User', required: true },
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Daily' },
  everyNDays: { type: Number, default: 1 },
  lastDone: { type: Date },
  nextDue: { type: Date },
  status: { type: String, enum: ['OK', 'Overdue', 'Not logged yet'], default: 'Not logged yet' },
  notes: { type: String, default: '' },
  isHoliday: { type: Boolean, default: false }
}
```

---

## 4. Automated SLA Flags & Engine Rules

On every task save or update, the system automatically evaluates flags:
1. **`Done`**: If `status === 'Done'`, the flag is marked `Done`.
2. **`Blocked`**: If `status === 'Blocked'`, marked `Blocked` (signals immediate management escalation).
3. **`Overdue`**: If `status !== 'Done'` and `dueDate < new Date()`.
4. **`Due Soon`**: If `status !== 'Done'` and `dueDate` falls within the next 3 days (`now + 72h`).
5. **`Stale`**: If `status !== 'Done'` and `lastUpdate < now - 3 days` (flags neglected work).

---

## 5. REST API Reference

All requests requiring authentication must include the header:
```http
Authorization: Bearer <jwt_token>
```

### Auth & User Endpoints
- `POST /api/auth/login` — Login with registered email.
- `GET /api/auth/me` — Fetch current user profile.
- `GET /api/auth/google` — Trigger Google OAuth login.
- `POST /api/auth/seed` — Seed default team members from spreadsheet data.

### Dashboard & Analytics (Admin / Lead Only)
- `GET /api/dashboard` — Global task tallies, overdue metrics, backlog count, and per-member workload.
- `GET /api/dashboard/team` — List active team members with workload stats.
- `PUT /api/dashboard/users/:id/role` — Update a user's role (Super Admin only).

### Task Operations
- `GET /api/tasks` — Fetch tasks (automatically filtered to current user if role is `member`).
- `POST /api/tasks` — Create new task (Admin / Lead only).
- `GET /api/tasks/:id` — Fetch single task details (access checked).
- `PUT /api/tasks/:id` — Update status, %, progress notes, or assignees.
- `DELETE /api/tasks/:id` — Delete task (Super Admin only).

### Backlog Operations
- `GET /api/backlog` — Fetch all backlog items.
- `POST /api/backlog` — Submit a backlog proposal (evaluates skill-matching algorithm).
- `POST /api/backlog/:id/approve` — Approve item and automatically spawn an active board task.
- `DELETE /api/backlog/:id` — Reject / delete item.

### Routine Task Operations
- `GET /api/routine-tasks` — Fetch routine tasks (scoped to owner for members).
- `POST /api/routine-tasks` — Create new recurring routine.
- `PUT /api/routine-tasks/:id/log` — Mark completed for today (auto-increments `nextDue`).
- `PUT /api/routine-tasks/:id` — Edit routine cadence.
- `DELETE /api/routine-tasks/:id` — Delete routine.

---

## 6. Local Setup & Quick Start

### Step 1: Install Dependencies
```bash
# Root & backend dependencies
npm install

# Client dependencies
cd client
npm install
cd ..
```

### Step 2: Environment Setup
Ensure your `.env` file in the root directory contains:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-tracker
JWT_SECRET=flowvision_super_secret_jwt_key_2026_secure
SESSION_SECRET=flowvision_super_secret_session_key_2026
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Seed Database
Populate the database with Kartik as Super Admin, all team members, routine checklists, and sample tasks:
```bash
npm run seed
```

### Step 4: Run Application
In terminal 1 (Backend API):
```bash
npm run server
```

In terminal 2 (Vite Frontend):
```bash
npm run client
```

Navigate to `http://localhost:5173` in your browser.

---

## 7. Production Deployment Manual

The server is built with unified single-service architecture: in production (`NODE_ENV=production`), Express automatically serves the pre-built React static files from `client/dist`.

### Option A: Deploy to Render.com (Recommended)
1. Push this repository to GitHub.
2. Create a new **Web Service** on Render.
3. Configure the following build & start commands:
   - **Build Command:**
     ```bash
     npm install && cd client && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     node server/index.js
     ```
4. Add Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Random 64-char string>`
   - `SESSION_SECRET`: `<Random 64-char string>`
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://your-service-name.onrender.com`
5. Click **Deploy**.
6. Trigger the database seed once via the Render shell or endpoint:
   ```bash
   node server/seed.js
   ```

### Option B: Deploy with Docker
Create a `Dockerfile` in the root:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY client/package*.json client/
RUN cd client && npm install
COPY . .
RUN cd client && npm run build

EXPOSE 5000
CMD ["node", "server/index.js"]
```

Build and run:
```bash
docker build -t flowvision-task-tracker .
docker run -p 5000:5000 --env-file .env flowvision-task-tracker
```

### Option C: Google OAuth Setup (Optional)
To enable one-click Google Sign-In in production:
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Project and configure the **OAuth Consent Screen**.
3. Create Credentials -> **OAuth 2.0 Client IDs** (Web application).
4. Add Authorized redirect URIs:
   - `https://your-domain.com/api/auth/google/callback`
5. Paste `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into your `.env` or deployment dashboard.

---

## 8. Team Handover & Operating Guide

### For Kartik (Super Admin):
1. **Login:** Go to `/login` and select **Kartik (Admin)** or log in with your Google email.
2. **Review Dashboard (`/dashboard`):** Monitor overdue counts, blocked bottlenecks, and each team member's active load.
3. **Approve Backlog (`/backlog`):** View submitted tasks with AI skill recommendations; click **Approve** to assign to team members.
4. **Manage Team (`/team`):** Change roles (promote to Lead, adjust max capacity, deactivate former staff).

### For Team Leads (Shruti, Sanket):
1. **Assign Tasks (`/tasks`):** Create new tasks for your domain (Listings or Warehouse), set priorities, deadlines, and owners.
2. **Review Routines (`/routine`):** Inspect daily packing, listing checks, and dispatch checklist completion.

### For Members (Zinia, Dev):
1. **My Tasks (`/tasks`):** Open your personal board, drag or update status, adjust % progress, and log progress notes.
2. **Log Routines (`/routine`):** Click **Log Done** on recurring responsibilities every day.
3. **Submit Backlog (`/backlog`):** Submit ideas or feature requests for review by Kartik.
