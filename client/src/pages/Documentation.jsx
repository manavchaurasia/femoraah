import { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Kanban, 
  Server, 
  Key, 
  Rocket, 
  FileText, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Snippet copied to clipboard!');
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">System & Deployment Documentation</h1>
          <p className="page-subtitle">
            Complete architecture, role-based access control, workflow guides, and production deployment manual
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs" style={{ marginBottom: 28, overflowX: 'auto', display: 'flex', gap: 8 }}>
        {[
          { id: 'overview', label: '1. Overview & Architecture', icon: Layers },
          { id: 'auth', label: '2. Auth & RBAC Matrix', icon: ShieldCheck },
          { id: 'workflow', label: '3. Core Workflows', icon: Kanban },
          { id: 'api', label: '4. REST API Reference', icon: Database },
          { id: 'deployment', label: '5. Production Deployment', icon: Rocket }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: 20 }}>Project Architecture & Overview</h2>
            <span className="badge badge-done">Production Grade</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15, lineHeight: 1.7 }}>
            <strong>Femoraah Command Center</strong> is a full-stack, enterprise-grade task management system designed to eliminate spreadsheet bottlenecks. It maps 1-to-1 with the Femoraah Google Sheet structure while adding automated SLA flags, workload capacity balancing, Google OAuth, and strict Role-Based Access Control (RBAC).
          </p>

          <div className="stats-grid" style={{ marginBottom: 28 }}>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
              <div className="stat-label">Frontend Stack</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>React 19 + Vite 6</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>SPA with modern glassmorphism & Lucide icons</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
              <div className="stat-label">Backend Stack</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Node.js + Express 5</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>RESTful APIs with JWT & Passport Google OAuth</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-emerald)' }}>
              <div className="stat-label">Database</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>MongoDB + Mongoose</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Schemas for Users, Tasks, Backlog, & Routine</div>
            </div>
          </div>

          <h3 style={{ fontSize: 16, marginBottom: 12, marginTop: 24 }}>System Highlights:</h3>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>Kartik as Super Admin:</strong> Has administrative privileges across all modules, user role delegation, backlog assignment, and global team capacity monitoring.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Role-Secured Endpoints:</strong> Members can only view and update their own assigned tasks, preventing unauthorized modifications.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Automated SLA Flag Engine:</strong> Tasks automatically compute flags (<em>Overdue</em>, <em>Due Soon</em>, <em>Blocked</em>, <em>Stale</em>) based on timestamps and progress status.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Smart Backlog Matching:</strong> Automatically compares task skill requirements against team member expertise profiles to recommend the best owner.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>One-Click Routine Tasks:</strong> Team members check off recurring tasks with a single click, automatically computing the next due date based on cadence.</li>
          </ul>
        </div>
      )}

      {/* TAB 2: AUTH & RBAC MATRIX */}
      {activeTab === 'auth' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: 20 }}>Authentication & Authorization (RBAC) Matrix</h2>
            <span className="badge badge-role-admin">Super Admin: Kartik</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            The system implements strict Role-Based Access Control (RBAC) across three defined organizational roles:
          </p>

          <div className="table-container" style={{ marginBottom: 28 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Capability / Feature</th>
                  <th>Member (Team)</th>
                  <th>Team Lead</th>
                  <th>Super Admin (Kartik)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>View Dashboard Analytics</strong></td>
                  <td><span className="badge badge-flag-blocked">Restricted</span></td>
                  <td><span className="badge badge-done">Full Team View</span></td>
                  <td><span className="badge badge-done">All Org Access</span></td>
                </tr>
                <tr>
                  <td><strong>View Active Tasks</strong></td>
                  <td><span className="badge badge-role-member">Own Tasks Only</span></td>
                  <td><span className="badge badge-done">All Tasks</span></td>
                  <td><span className="badge badge-done">All Tasks</span></td>
                </tr>
                <tr>
                  <td><strong>Create / Edit Tasks</strong></td>
                  <td><span className="badge badge-role-member">Update Own Status/%</span></td>
                  <td><span className="badge badge-done">Create & Assign Any</span></td>
                  <td><span className="badge badge-done">Create, Edit, Delete Any</span></td>
                </tr>
                <tr>
                  <td><strong>Submit to Backlog</strong></td>
                  <td><span className="badge badge-done">Allowed</span></td>
                  <td><span className="badge badge-done">Allowed</span></td>
                  <td><span className="badge badge-done">Allowed</span></td>
                </tr>
                <tr>
                  <td><strong>Approve & Assign Backlog</strong></td>
                  <td><span className="badge badge-flag-blocked">Restricted</span></td>
                  <td><span className="badge badge-done">Allowed</span></td>
                  <td><span className="badge badge-done">Allowed</span></td>
                </tr>
                <tr>
                  <td><strong>Routine Tasks Checklist</strong></td>
                  <td><span className="badge badge-role-member">Log Own Routines</span></td>
                  <td><span className="badge badge-done">Manage All Routines</span></td>
                  <td><span className="badge badge-done">Manage All Routines</span></td>
                </tr>
                <tr>
                  <td><strong>Manage Team & Change Roles</strong></td>
                  <td><span className="badge badge-flag-blocked">Restricted</span></td>
                  <td><span className="badge badge-flag-blocked">Restricted</span></td>
                  <td><span className="badge badge-role-admin">Exclusive (Kartik)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Authentication Architecture</h3>
          <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
              • <strong>Dual Auth Flow:</strong> Supports one-click Google OAuth 2.0 (with automated email domain matching) and JWT email-based authentication with 7-day session validity.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
              • <strong>Kartik Auto-SuperAdmin:</strong> Any login with email or displayName matching <code>kartik</code> automatically inherits the <code>super_admin</code> role upon initial sync.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              • <strong>JWT Middleware Verification:</strong> Express middleware verifies the <code>Authorization: Bearer &lt;token&gt;</code> header on every request, verifying the user's active status and role in real time.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: WORKFLOWS */}
      {activeTab === 'workflow' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: 20 }}>Core Workflows & Automation Rules</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div style={{ background: 'var(--bg-secondary)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 16, color: 'var(--accent-primary-light)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Kanban size={18} /> 1. Task Lifecycle & SLA Flags
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Each task has automatic SLA calculation on every save:
              </p>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 18, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong style={{ color: 'var(--status-overdue)' }}>Overdue:</strong> Due date is past and status is not 'Done'.</li>
                <li><strong style={{ color: 'var(--status-due-soon)' }}>Due Soon:</strong> Due date is within the next 3 days.</li>
                <li><strong style={{ color: 'var(--status-blocked)' }}>Blocked:</strong> Member flagged an external impediment.</li>
                <li><strong style={{ color: 'var(--priority-high)' }}>Stale:</strong> No updates or progress notes logged in over 3 days.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 16, color: 'var(--accent-cyan)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Inbox size={18} /> 2. Smart Backlog Delegation
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                When any team member submits an unassigned item with required skills:
              </p>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 18, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>The engine scans all members' <code>expertise</code> tags.</li>
                <li>It evaluates member current workload against their <code>maxOpenTasks</code> limit.</li>
                <li>It recommends the ideal owner with matched skill justification.</li>
                <li>Super Admin (Kartik) or Leads can approve with 1 click to convert it into an active board task.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 16, color: 'var(--accent-emerald)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Repeat size={18} /> 3. Routine Checklists
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                For daily, weekly, or recurring maintenance tasks:
              </p>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 18, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Grouped cleanly per owner with frequency indicator badges.</li>
                <li>Clicking <strong>Log Done</strong> updates today's completion.</li>
                <li>Next due date is automatically rescheduled (+1 day, +7 days).</li>
                <li>Status turns red (<em>Overdue</em>) if cadence has elapsed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: API REFERENCE */}
      {activeTab === 'api' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: 20 }}>REST API Endpoint Reference</h2>
            <span className="badge badge-done">Base URL: /api</span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Access Requirement</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge badge-done">POST</span></td>
                  <td><code>/api/auth/login</code></td>
                  <td>Public</td>
                  <td>Authenticate user via email, returns JWT & user object</td>
                </tr>
                <tr>
                  <td><span className="badge badge-progress">GET</span></td>
                  <td><code>/api/auth/me</code></td>
                  <td>Bearer Token</td>
                  <td>Fetch current profile & permissions</td>
                </tr>
                <tr>
                  <td><span className="badge badge-done">POST</span></td>
                  <td><code>/api/auth/seed</code></td>
                  <td>Public (Dev)</td>
                  <td>Populate spreadsheet initial team (Kartik as admin, Shruti, Sanket, etc.)</td>
                </tr>
                <tr>
                  <td><span className="badge badge-progress">GET</span></td>
                  <td><code>/api/dashboard</code></td>
                  <td>Super Admin / Team Lead</td>
                  <td>Managerial metrics, overdue tallies, per-member task counts</td>
                </tr>
                <tr>
                  <td><span className="badge badge-progress">GET</span></td>
                  <td><code>/api/tasks</code></td>
                  <td>Authenticated</td>
                  <td>Fetch tasks (automatically scoped to user if member)</td>
                </tr>
                <tr>
                  <td><span className="badge badge-done">POST</span></td>
                  <td><code>/api/tasks</code></td>
                  <td>Super Admin / Team Lead</td>
                  <td>Create new task with auto-generated TSK-XXXX ID</td>
                </tr>
                <tr>
                  <td><span className="badge badge-due-soon">PUT</span></td>
                  <td><code>/api/tasks/:id</code></td>
                  <td>Owner or Admin/Lead</td>
                  <td>Update status, % completion, progress notes, or reassignment</td>
                </tr>
                <tr>
                  <td><span className="badge badge-progress">GET</span></td>
                  <td><code>/api/backlog</code></td>
                  <td>Authenticated</td>
                  <td>Fetch backlog items with skill recommendations</td>
                </tr>
                <tr>
                  <td><span className="badge badge-done">POST</span></td>
                  <td><code>/api/backlog/:id/approve</code></td>
                  <td>Super Admin / Team Lead</td>
                  <td>Approve and convert backlog item into active task</td>
                </tr>
                <tr>
                  <td><span className="badge badge-due-soon">PUT</span></td>
                  <td><code>/api/routine-tasks/:id/log</code></td>
                  <td>Owner or Admin/Lead</td>
                  <td>Log routine task completed today, calculate next cadence</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PRODUCTION DEPLOYMENT */}
      {activeTab === 'deployment' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: 20 }}>Production Deployment Guide</h2>
            <span className="badge badge-role-admin">Ready for Team Handover</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            Follow these verified steps to deploy the application and deliver it to your team:
          </p>

          {/* STEP 1 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-role-lead">Step 1</span> Configure Production Environment Variables (.env)
            </h3>
            <div style={{ position: 'relative', background: '#090a0f', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontFamily: 'monospace', fontSize: 13 }}>
              <button 
                onClick={() => copyCode(`MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/femoraah?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_femoraah_2026
SESSION_SECRET=super_secret_session_key_femoraah_2026
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret`)}
                className="btn btn-ghost btn-sm" 
                style={{ position: 'absolute', top: 12, right: 12 }}
              >
                <Copy size={14} /> Copy
              </button>
              <pre style={{ margin: 0, color: '#a78bfa', overflowX: 'auto' }}>
{`MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/femoraah?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_femoraah_2026
SESSION_SECRET=super_secret_session_key_femoraah_2026
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret`}
              </pre>
            </div>
          </div>

          {/* STEP 2 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-role-lead">Step 2</span> Build Client for Production Static Serving
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Express is pre-configured to automatically serve <code>client/dist</code> static assets in production!
            </p>
            <div style={{ position: 'relative', background: '#090a0f', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontFamily: 'monospace', fontSize: 13 }}>
              <button 
                onClick={() => copyCode(`cd client && npm run build`)}
                className="btn btn-ghost btn-sm" 
                style={{ position: 'absolute', top: 12, right: 12 }}
              >
                <Copy size={14} /> Copy
              </button>
              <pre style={{ margin: 0, color: '#34d399' }}>
{`cd client
npm run build`}
              </pre>
            </div>
          </div>

          {/* STEP 3 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-role-lead">Step 3</span> Deploy to Render / Railway / DigitalOcean / VPS
            </h3>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: 14, color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: 8 }}><strong>Build Command:</strong> <code>npm install && cd client && npm install && npm run build</code></p>
              <p style={{ marginBottom: 8 }}><strong>Start Command:</strong> <code>node server/index.js</code></p>
              <p><strong>Database:</strong> Use free tier MongoDB Atlas (M0 Cluster) or self-hosted MongoDB.</p>
            </div>
          </div>

          {/* STEP 4 */}
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-role-admin">Step 4</span> Team Onboarding & Access
            </h3>
            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: 14, color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: 8 }}>
                1. Navigate to <code>/login</code> and click <strong>Kartik (Admin)</strong> or log in with Kartik's email/Google account.
              </p>
              <p style={{ marginBottom: 8 }}>
                2. Navigate to <strong>Team Members</strong> in the sidebar to invite team members and set their initial capacity & expertise skills.
              </p>
              <p>
                3. Members can now log in using their email, view their assigned tasks, log routine completions, and submit ideas to the backlog!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;
