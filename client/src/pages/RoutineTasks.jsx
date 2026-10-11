import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  CheckCircle, Circle, RefreshCw, Plus, XCircle,
  Calendar, Clock, Repeat
} from 'lucide-react';

const RoutineTasks = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [form, setForm] = useState({
    title: '', owner: '', frequency: 'Daily', everyNDays: 1, notes: ''
  });

  useEffect(() => {
    fetchRoutineTasks();
    if (isAdmin()) fetchTeam();
  }, []);

  const fetchRoutineTasks = async () => {
    try {
      const res = await api.get('/routine-tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load routine tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await api.get('/dashboard/team');
      setTeamMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLog = async (taskId) => {
    try {
      await api.put(`/routine-tasks/${taskId}/log`, { notes: '' });
      toast.success('Logged as done ✓');
      fetchRoutineTasks();
    } catch (err) {
      toast.error('Failed to log task');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/routine-tasks', form);
      toast.success('Routine task created');
      setShowModal(false);
      setForm({ title: '', owner: '', frequency: 'Daily', everyNDays: 1, notes: '' });
      fetchRoutineTasks();
    } catch (err) {
      toast.error('Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this routine task?')) return;
    try {
      await api.delete(`/routine-tasks/${id}`);
      toast.success('Deleted');
      fetchRoutineTasks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const getFrequencyIcon = (freq) => {
    switch (freq) {
      case 'Daily': return <Clock size={14} style={{ color: 'var(--accent-cyan)' }} />;
      case 'Weekly': return <Calendar size={14} style={{ color: 'var(--accent-violet)' }} />;
      case 'Monthly': return <Repeat size={14} style={{ color: 'var(--accent-amber)' }} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusBadge = (status) => {
    const map = { 'OK': 'badge-done', 'Overdue': 'badge-overdue', 'Not logged yet': 'badge-not-started' };
    return map[status] || 'badge-not-started';
  };

  // Group by owner
  const grouped = {};
  tasks.forEach(t => {
    const ownerName = t.owner?.name || 'Unknown';
    if (!grouped[ownerName]) grouped[ownerName] = [];
    grouped[ownerName].push(t);
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Routine Tasks</h1>
          <p className="page-subtitle">Daily, weekly & monthly recurring work</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin() && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Routine
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <RefreshCw size={64} />
          <h3>No routine tasks yet</h3>
          <p>Add recurring tasks that need to be completed regularly.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([ownerName, ownerTasks]) => (
          <div key={ownerName} className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                  {ownerName.charAt(0)}
                </div>
                {ownerName}
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
                  ({ownerTasks.length} tasks)
                </span>
              </h3>
            </div>
            <div>
              {ownerTasks.map((task) => (
                <div key={task._id} className="routine-item">
                  <div 
                    className={`routine-check ${task.status === 'OK' ? 'done' : ''}`}
                    onClick={() => handleLog(task._id)}
                    title="Mark as done today"
                  >
                    {task.status === 'OK' && <CheckCircle size={16} color="white" />}
                  </div>
                  <div className="routine-info">
                    <div className="routine-title" style={{ 
                      textDecoration: task.isHoliday ? 'line-through' : 'none',
                      opacity: task.isHoliday ? 0.6 : 1
                    }}>
                      {task.title}
                    </div>
                    <div className="routine-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {getFrequencyIcon(task.frequency)} {task.frequency}
                      </span>
                      {task.lastDone && (
                        <span style={{ marginLeft: 12 }}>
                          Last: {new Date(task.lastDone).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {task.nextDue && (
                        <span style={{ marginLeft: 12 }}>
                          Next: {new Date(task.nextDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    {task.notes && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                        {task.notes}
                      </div>
                    )}
                  </div>
                  <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
                  {isSuperAdmin() && (
                    <button 
                      className="btn btn-ghost btn-icon btn-sm" 
                      onClick={() => handleDelete(task._id)}
                      style={{ color: 'var(--status-overdue)' }}
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Routine Task</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Reply to customer queries" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assign To *</label>
                    <select className="form-select" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} required>
                      <option value="">Select member</option>
                      {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select className="form-select" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value, everyNDays: e.target.value === 'Daily' ? 1 : e.target.value === 'Weekly' ? 7 : 30 })}>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." rows={2} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineTasks;
