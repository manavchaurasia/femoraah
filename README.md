# Femoraah — Team Task Command Center

Production-ready team task tracking and command center web application mapped directly from the Femoraah operations spreadsheet with enterprise authentication, Role-Based Access Control (RBAC), SLA flag engine, and Google OAuth.

---

## ⚡ Key Highlights

- 👑 **Super Admin: Kartik** (Founder) — Full global administrative control, approvals, role delegation.
- 🛡️ **Role-Based Access Control (RBAC)** — Super Admin (`kartik`), Team Leads (`shruti`, `sanket`), and Members (`zinia`, `dev`).
- 🔒 **Data Scoping** — Regular members can view & update only their own assigned tasks.
- ⏱️ **Automated SLA Engine** — Auto-computes `Overdue`, `Due Soon`, `Blocked`, and `Stale` (no update in 3+ days) flags.
- 🎯 **Smart Backlog Allocation** — Auto-matches task skill requirements with member expertise profiles.
- 🔁 **Routine Recurring Checklists** — One-click daily/weekly task completion with auto-rescheduling.
- 🚀 **Production-Ready & Unified** — Single-server deployment ready (Express serves built Vite bundle).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Root & backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your MongoDB connection string is set in `.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-tracker
JWT_SECRET=your-secure-jwt-key
SESSION_SECRET=your-secure-session-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database
Initializes the database with Kartik as Super Admin, all team members, routine tasks, and sample active tasks:
```bash
npm run seed
```

### 4. Run Locally
```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Open `http://localhost:5173` in your browser.

---

## 📖 In-App Documentation
Full documentation is also available directly inside the application at:
`http://localhost:5173/docs`

Or read the comprehensive offline markdown document: [DOCUMENTATION.md](file:///c:/Users/TUF15/Desktop/task%20tracker/DOCUMENTATION.md)

---

## 🚢 Deployment to Production (Render / Cloud / VPS)

### Build Command:
```bash
npm install && cd client && npm install && npm run build
```

### Start Command:
```bash
node server/index.js
```

In production mode (`NODE_ENV=production`), Express automatically serves the frontend bundle from `client/dist`.
