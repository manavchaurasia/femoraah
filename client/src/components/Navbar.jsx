import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sliders, 
  Calendar, 
  Plus, 
  LogOut, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  Kanban,
  Repeat, 
  Users, 
  BarChart3, 
  Palmtree,
  CheckCircle2
} from 'lucide-react';

const Navbar = ({ onAddTask }) => {
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const todayDateStr = "Sun, Oct 11, 2026";

  return (
    <header className="app-header">
      {/* Top Branding Row */}
      <div className="header-top">
        <div className="logo-group">
          <div className="logo-badge">
            <Sliders size={20} />
          </div>
          <div>
            <div className="brand-title">
              OpsPulse Workspace
              <span className="live-sync-pill">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Live Sync
              </span>
            </div>
            <div className="brand-subtitle">
              Team Capacity, Operational Dashboard & Daily Check-Offs
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="date-pill">
            <Calendar size={14} />
            <span>{todayDateStr}</span>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={onAddTask}
            style={{ padding: '7px 14px', borderRadius: 8 }}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>

          {/* User profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 6 }}>
            <div 
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                background: '#e0e7ff', 
                color: '#4338ca', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700, 
                fontSize: 13 
              }}
              title={`${user?.name} (${user?.role})`}
            >
              {(user?.name?.charAt(0) || 'K').toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              className="action-icon-btn" 
              title="Logout"
              style={{ color: '#64748b' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="tab-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
          end
        >
          <User size={15} />
          <span>Employee Hub</span>
          <span className="tab-counter">1/19</span>
        </NavLink>

        <NavLink 
          to="/board" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
        >
          <Kanban size={15} />
          <span>Task Board & Backlog</span>
          <span className="tab-counter">19</span>
        </NavLink>

        <NavLink 
          to="/routines" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
        >
          <Repeat size={15} />
          <span>Daily Routines</span>
          <span className="tab-counter">19</span>
        </NavLink>

        <NavLink 
          to="/leaves" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
        >
          <Palmtree size={15} />
          <span>Calendar & Leaves</span>
          <span className="tab-counter">4</span>
        </NavLink>

        <NavLink 
          to="/team" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
        >
          <Users size={15} />
          <span>Team & Capacity</span>
          <span className="tab-counter">7</span>
        </NavLink>

        <NavLink 
          to="/overview" 
          className={({ isActive }) => `tab-pill ${isActive ? 'active' : ''}`}
        >
          <BarChart3 size={15} />
          <span>Manager Overview</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
