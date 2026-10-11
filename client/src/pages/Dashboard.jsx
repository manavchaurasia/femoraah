import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  ClipboardList, AlertTriangle, Ban, CalendarClock, 
  Clock, Inbox, RefreshCw, TrendingUp, Users 
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state">
        <AlertTriangle size={48} />
        <h3>Could not load dashboard</h3>
        <p>Make sure you have admin or team lead permissions.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Open Tasks', value: data.summary.openTasks, icon: ClipboardList, color: '#6366f1' },
    { label: 'Overdue', value: data.summary.overdueTasks, icon: AlertTriangle, color: '#fb7185' },
    { label: 'Blocked', value: data.summary.blockedTasks, icon: Ban, color: '#94a3b8' },
    { label: 'Due This Week', value: data.summary.dueThisWeek, icon: CalendarClock, color: '#fbbf24' },
    { label: 'Stale (3+ days)', value: data.summary.staleUpdates, icon: Clock, color: '#f97316' },
    { label: 'Unassigned Backlog', value: data.summary.unassignedBacklog, icon: Inbox, color: '#22d3ee' },
    { label: 'Routine Overdue', value: data.summary.routineOverdue, icon: RefreshCw, color: '#a78bfa' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manager overview — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDashboard}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div className="stat-card slide-up" key={stat.label} style={{ '--stat-color': stat.color, animationDelay: `${i * 50}ms` }}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.value > 0 ? stat.color : 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Per Person Stats */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} /> Team Workload
          </h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Open</th>
                <th>Overdue</th>
                <th>Blocked</th>
                <th>Due This Week</th>
                <th>Stale</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {data.perPerson.map((person) => (
                <tr key={person.user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                        {person.user.avatar ? (
                          <img src={person.user.avatar} alt={person.user.name} />
                        ) : (
                          person.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{person.user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{person.user.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-role-${person.user.role === 'super_admin' ? 'admin' : person.user.role === 'team_lead' ? 'lead' : 'member'}`}>
                      {person.user.role === 'super_admin' ? 'Admin' : person.user.role === 'team_lead' ? 'Lead' : 'Member'}
                    </span>
                  </td>
                  <td><strong>{person.openTasks}</strong></td>
                  <td style={{ color: person.overdue > 0 ? 'var(--status-overdue)' : 'inherit' }}>
                    <strong>{person.overdue}</strong>
                  </td>
                  <td style={{ color: person.blocked > 0 ? 'var(--status-blocked)' : 'inherit' }}>
                    <strong>{person.blocked}</strong>
                  </td>
                  <td style={{ color: person.dueThisWeek > 0 ? 'var(--status-due-soon)' : 'inherit' }}>
                    <strong>{person.dueThisWeek}</strong>
                  </td>
                  <td style={{ color: person.staleUpdates > 0 ? '#f97316' : 'inherit' }}>
                    <strong>{person.staleUpdates}</strong>
                  </td>
                  <td>
                    <span className={`badge ${person.hasCapacity ? 'badge-done' : 'badge-overdue'}`}>
                      {person.hasCapacity ? 'Yes' : 'Full'} ({person.openTasks}/{person.user.maxOpenTasks})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
