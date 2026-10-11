import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Plus, CheckCircle, XCircle, ThumbsUp, ThumbsDown,
  Inbox, User, AlertTriangle
} from 'lucide-react';

const Backlog = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [form, setForm] = useState({
    title: '', details: '', skillsNeeded: '', priority: 'Medium', dueDate: ''
  });

  useEffect(() => {
    fetchBacklog();
    if (isAdmin()) fetchTeam();
  }, []);

  const fetchBacklog = async () => {
    try {
      const res = await api.get('/backlog');
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to load backlog');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await api.get('/dashboard/team');
      setTeamMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/backlog', form);
      toast.success('Added to backlog');
      setShowModal(false);
      setForm({ title: '', details: '', skillsNeeded: '', priority: 'Medium', dueDate: '' });
      fetchBacklog();
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  const handleApprove = async (id, owner) => {
    try {
      await api.put(`/backlog/${id}/approve`, { owner });
      toast.success('Approved & moved to Task Board!');
      fetchBacklog();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/backlog/${id}/reject`);
      toast.success('Backlog item rejected');
      fetchBacklog();
    } catch (err) {
      toast.error('Reject failed');
    }
  };

  const getPriorityBadge = (priority) => {
    const map = { 'Critical': 'badge-critical', 'High': 'badge-high', 'Medium': 'badge-medium', 'Low': 'badge-low' };
    return map[priority] || 'badge-medium';
  };

  const getStatusStyle = (status) => {
    const map = { 'Pending': 'badge-due-soon', 'Assigned': 'badge-done', 'Rejected': 'badge-overdue' };
    return map[status] || '';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Backlog</h1>
          <p className="page-subtitle">Unassigned work waiting for delegation</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add to Backlog
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <Inbox size={64} />
          <h3>Backlog is empty</h3>
          <p>Add new work items that need to be assigned to team members.</p>
        </div>
      ) : (
        <div className="table-container" style={{ background: 'var(--bg-card)' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Skills Needed</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Requested By</th>
                <th>Suggested Owner</th>
                <th>Status</th>
                {isSuperAdmin() && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    {item.backlogId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    {item.details && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {item.details}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {item.skillsNeeded || '—'}
                  </td>
                  <td><span className={`badge ${getPriorityBadge(item.priority)}`}>{item.priority}</span></td>
                  <td style={{ fontSize: 13 }}>
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 13 }}>{item.requestedBy?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>
                    {item.suggestedOwner ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="user-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                            {item.suggestedOwner.name?.charAt(0)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{item.suggestedOwner.name}</span>
                        </div>
                        {item.suggestedReason && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {item.suggestedReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>No match</span>
                    )}
                  </td>
                  <td><span className={`badge ${getStatusStyle(item.status)}`}>{item.status}</span></td>
                  {isSuperAdmin() && (
                    <td>
                      {item.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: 'var(--status-done)' }}
                            onClick={() => handleApprove(item._id, item.suggestedOwner?._id)}
                            title="Approve"
                          >
                            <ThumbsUp size={14} /> Approve
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: 'var(--status-overdue)' }}
                            onClick={() => handleReject(item._id)}
                            title="Reject"
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add to Backlog</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input 
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="What work needs to be done?"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea 
                    className="form-textarea"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Describe the work..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills Needed</label>
                  <input 
                    className="form-input"
                    value={form.skillsNeeded}
                    onChange={(e) => setForm({ ...form, skillsNeeded: e.target.value })}
                    placeholder="e.g. warehouse management, customer queries"
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Comma-separated skills to auto-match with team members
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      <option value="Critical">🔴 Critical</option>
                      <option value="High">🟠 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add to Backlog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backlog;
