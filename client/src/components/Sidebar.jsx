import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  LayoutDashboard, 
  Kanban, 
  Inbox, 
  Repeat, 
  Users, 
  BookOpen, 
  LogOut,
  ShieldAlert,
  ShieldCheck,
  User
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (isSuperAdmin()) {
      return (
        <span className="badge badge-role-admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ShieldAlert size={12} /> Super Admin
        </span>
      );
    }
    if (isAdmin()) {
      return (
        <span className="badge badge-role-lead" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ShieldCheck size={12} /> Team Lead
        </span>
      );
    }
    return (
      <span className="badge badge-role-member" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <User size={12} /> Member
      </span>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div className="sidebar-logo-text">Femoraah</div>
            <div className="sidebar-logo-sub">Command Center</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Operations</div>

        {isAdmin() && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>
        )}

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Kanban />
          <span>Task Board</span>
        </NavLink>

        <NavLink 
          to="/backlog" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Inbox />
          <span>Pending Backlog</span>
        </NavLink>

        <NavLink 
          to="/routine" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Repeat />
          <span>Routine Tasks</span>
        </NavLink>

        <div className="nav-section-title">Administration</div>

        {isAdmin() && (
          <NavLink 
            to="/team" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users />
            <span>Team</span>
          </NavLink>
        )}

        <NavLink 
          to="/docs" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <BookOpen />
          <span>How It Works</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} />
            ) : (
              (user?.name?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          <div className="user-details">
            <div className="user-name" title={user?.name}>{user?.name || 'User'}</div>
            <div style={{ marginTop: 2 }}>{getRoleBadge()}</div>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-ghost btn-icon" 
            title="Log Out"
            style={{ padding: 6, color: 'var(--text-muted)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
