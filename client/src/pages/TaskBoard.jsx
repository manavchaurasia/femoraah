import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Plus, Search, Filter, Edit2, Trash2, 
  CheckCircle, AlertTriangle, Clock, XCircle, Circle,
  ChevronDown, ClipboardList
} from 'lucide-react';

const TaskBoard = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', owner: '', search: '' });
  
  const [form, setForm] = useState({
    title: '', details: '', owner: '', priority: 'Medium',
    status: 'Not Started', startDate: '', dueDate: '', 
    percentComplete: 0, progressNote: ''
  });

  useEffect(() => {
    fetchTasks();
    if (isAdmin()) fetchTeam();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.owner) params.owner = filters.owner;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
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

  const openCreateModal = () => {
    setEditTask(null);
    setForm({
      title: '', details: '', owner: teamMembers[0]?._id || '', priority: 'Medium',
      status: 'Not Started', startDate: '', dueDate: '', 
      percentComplete: 0, progressNote: ''
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      details: task.details || '',
      owner: task.owner?._id || '',
      priority: task.priority,
      status: task.status,
      startDate: task.startDate ? task.startDate.split('T')[0] : '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      percentComplete: task.percentComplete,
      progressNote: task.progressNote || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const quickUpdateStatus = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { 
        status: newStatus, 
        percentComplete: newStatus === 'Done' ? 100 : task.percentComplete,
        lastUpdate: new Date().toISOString()
      });
      toast.success(`Status → ${newStatus}`);
      fetchTasks();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle size={16} style={{ color: 'var(--status-done)' }} />;
      case 'In Progress': return <Clock size={16} style={{ color: 'var(--status-progress)' }} />;
      case 'Blocked': return <XCircle size={16} style={{ color: 'var(--status-blocked)' }} />;
      case 'Not Started': return <Circle size={16} style={{ color: 'var(--status-not-started)' }} />;
      default: return <Circle size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Done': 'badge-done', 'In Progress': 'badge-progress', 
      'Blocked': 'badge-blocked', 'Not Started': 'badge-not-started',
      'Cancelled': 'badge-blocked'
    };
    return map[status] || 'badge-not-started';
  };

  const getPriorityBadge = (priority) => {
    const map = {
      'Critical': 'badge-critical', 'High': 'badge-high',
      'Medium': 'badge-medium', 'Low': 'badge-low'
    };
    return map[priority] || 'badge-medium';
  };

  const getFlagBadge = (flag) => {
    const map = {
      'Overdue': 'badge-overdue', 'Due Soon': 'badge-due-soon',
      'Blocked': 'badge-blocked', 'Done': 'badge-done', 'Stale': 'badge-due-soon'
    };
    return map[flag] || '';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Board</h1>
          <p className="page-subtitle">
            {isAdmin() ? 'All team tasks' : `Your tasks, ${user?.name}`}
          </p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search />
          <input 
            className="search-input" 
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select 
          className="form-select" 
          style={{ width: 'auto', minWidth: 140 }}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Done">Done</option>
        </select>
        <select 
          className="form-select" 
          style={{ width: 'auto', minWidth: 140 }}
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {isAdmin() && (
          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: 140 }}
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
          >
            <option value="">All Members</option>
            {teamMembers.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Task Table */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={64} style={{ opacity: 0.3 }} />
          <h3>No tasks found</h3>
          <p>
            {isAdmin() ? 'Create a new task to get started.' : 'No tasks assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Progress</th>
                <th>Flag</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} style={{
                  borderLeft: task.flag === 'Overdue' ? '3px solid var(--status-overdue)' 
                    : task.flag === 'Done' ? '3px solid var(--status-done)' 
                    : task.flag === 'Blocked' ? '3px solid var(--status-blocked)'
                    : task.flag === 'Due Soon' ? '3px solid var(--status-due-soon)'
                    : 'none'
                }}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{task.title}</div>
                      {task.details && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.details}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.taskId}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {task.owner?.name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontSize: 13 }}>{task.owner?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getStatusIcon(task.status)}
                      <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
                    </div>
                  </td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${Math.min(task.percentComplete, 100)}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.percentComplete}%</span>
                    </div>
                  </td>
                  <td>
                    {task.flag && <span className={`badge ${getFlagBadge(task.flag)}`}>{task.flag}</span>}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {formatDate(task.lastUpdate)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(task)} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      {task.status !== 'Done' && (
                        <button 
                          className="btn btn-ghost btn-icon btn-sm" 
                          onClick={() => quickUpdateStatus(task, 'Done')}
                          title="Mark Done"
                          style={{ color: 'var(--status-done)' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {isSuperAdmin() && (
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(task._id)} title="Delete" style={{ color: 'var(--status-overdue)' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editTask ? 'Edit Task' : 'Create New Task'}</h3>
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
                    placeholder="What needs to be done?"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea 
                    className="form-textarea" 
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Additional details or context..."
                  />
                </div>
                <div className="form-row">
                  {isAdmin() && (
                    <div className="form-group">
                      <label className="form-label">Assign To *</label>
                      <select 
                        className="form-select"
                        value={form.owner}
                        onChange={(e) => setForm({ ...form, owner: e.target.value })}
                        required
                      >
                        <option value="">Select member</option>
                        {teamMembers.map(m => (
                          <option key={m._id} value={m._id}>{m.name} ({m.jobTitle})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option value="Critical">🔴 Critical</option>
                      <option value="High">🟠 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">% Complete</label>
                    <input 
                      type="number" 
                      className="form-input"
                      min="0" max="100"
                      value={form.percentComplete}
                      onChange={(e) => setForm({ ...form, percentComplete: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Progress Note</label>
                  <textarea 
                    className="form-textarea" 
                    value={form.progressNote}
                    onChange={(e) => setForm({ ...form, progressNote: e.target.value })}
                    placeholder="What's the current status?"
                    rows={2}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .table-container { background: var(--bg-card); }
      `}</style>
    </div>
  );
};

export default TaskBoard;
