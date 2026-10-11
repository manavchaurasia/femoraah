import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  CheckSquare, 
  Clock, 
  BarChart2, 
  Plus, 
  Share2, 
  Copy, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Palmtree, 
  Check, 
  UserPlus, 
  Users,
  Send,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const EmployeeHub = ({ onOpenAddTask }) => {
  const { user } = useAuth();
  
  // Member filter state
  const [selectedMember, setSelectedMember] = useState('All');
  const [routineFilter, setRoutineFilter] = useState('All'); // 'All' | 'Pending' | 'Done'

  // Data states
  const [routineTasks, setRoutineTasks] = useState([
    {
      id: 'r1',
      title: 'Reply to customer queries',
      owner: 'Zinia',
      frequency: 'Daily',
      status: 'OK',
      isDone: true,
      lastDone: 'Today ✓',
      due: 'Oct 12, 2026'
    },
    {
      id: 'r2',
      title: 'Order dispatch, label generation, Myntra ticket escalation, packing counts & inventory audits',
      owner: 'Warehouse Dispatch Supervisor',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r3',
      title: 'Follow up on open customer queries',
      owner: 'Shruti',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r4',
      title: 'Process exchanges',
      owner: 'Shruti',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r5',
      title: 'Check listings are live and correct on all platforms',
      owner: 'Shruti',
      frequency: 'Weekly',
      status: 'OK',
      isDone: false,
      lastDone: 'Oct 5, 2026',
      due: 'Oct 12, 2026'
    },
    {
      id: 'r6',
      title: 'Update hold sheet',
      owner: 'Sanket',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r7',
      title: 'Label processing',
      owner: 'Sanket',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r8',
      title: 'Dispatch parcels',
      owner: 'Sanket',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    },
    {
      id: 'r9',
      title: 'Packing count',
      owner: 'Sanket',
      frequency: 'Daily',
      status: 'Overdue',
      isDone: false,
      lastDone: 'Oct 9, 2026',
      due: 'Oct 10, 2026'
    },
    {
      id: 'r10',
      title: 'Pack orders',
      owner: 'Dev',
      frequency: 'Daily',
      status: 'Pending',
      isDone: false,
      lastDone: 'Yesterday',
      due: 'Oct 11, 2026'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 't1',
      taskId: 'TSK-001',
      title: 'Reply to customer queries',
      assignee: 'Zinia',
      details: 'Daily operational routine SOP',
      priority: 'High',
      status: 'Done',
      source: 'From Manager',
      progress: 100
    },
    {
      id: 't2',
      taskId: 'TSK-002',
      title: 'Warehouse barcode scanner hardware upgrade',
      assignee: 'Sanket',
      details: 'Configure 2 new Bluetooth handheld scanners with packaging terminal.',
      priority: 'Medium',
      status: 'To Do',
      source: 'From Manager',
      progress: 40
    },
    {
      id: 't3',
      taskId: 'TSK-003',
      title: 'Resolve pending NDR order delivery escalations',
      assignee: 'Zinia',
      details: 'Contact courier partners (Delhivery, Bluedart) for pending delivery cases.',
      priority: 'Critical',
      status: 'Blocked',
      source: 'From Manager',
      progress: 20
    },
    {
      id: 't4',
      taskId: 'TSK-004',
      title: 'New Summer Collection listing on Amazon & Flipkart',
      assignee: 'Shruti',
      details: 'Prepare high-res image sets, SEO descriptions, and SKU barcodes for upload.',
      priority: 'High',
      status: 'Active',
      source: 'From Manager',
      progress: 65
    }
  ]);

  // Modals
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [delegateForm, setDelegateForm] = useState({
    title: '',
    from: 'Shruti',
    to: 'Zinia',
    details: '',
    priority: 'Medium'
  });
  const [holidayForm, setHolidayForm] = useState({
    member: 'Zinia',
    date: '2026-10-11',
    reason: 'Annual Leave',
    backup: 'Sanket'
  });

  // Toggle routine done
  const handleToggleRoutine = (id) => {
    setRoutineTasks(prev => prev.map(r => {
      if (r.id === id) {
        const nextDone = !r.isDone;
        toast.success(nextDone ? `Checked off: ${r.title}` : `Marked pending: ${r.title}`);
        return {
          ...r,
          isDone: nextDone,
          status: nextDone ? 'OK' : 'Pending',
          lastDone: nextDone ? 'Today ✓' : 'Yesterday'
        };
      }
      return r;
    }));
  };

  // Change task status via pill button
  const handleChangeTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let newProgress = t.progress;
        if (newStatus === 'Done') newProgress = 100;
        else if (newStatus === 'To Do') newProgress = 0;
        else if (newStatus === 'Active' && t.progress === 0) newProgress = 50;

        toast.success(`Updated ${t.taskId} to ${newStatus}`);
        return {
          ...t,
          status: newStatus,
          progress: newProgress
        };
      }
      return t;
    }));
  };

  // Check off all visible routines
  const handleCheckOffAll = () => {
    setRoutineTasks(prev => prev.map(r => ({
      ...r,
      isDone: true,
      status: 'OK',
      lastDone: 'Today ✓'
    })));
    toast.success('All daily routines checked off!');
  };

  // Delegate submission
  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `t${Date.now()}`,
      taskId: `TSK-00${tasks.length + 1}`,
      title: delegateForm.title,
      assignee: delegateForm.to,
      details: `${delegateForm.details || 'Delegated task'} (from ${delegateForm.from})`,
      priority: delegateForm.priority,
      status: 'To Do',
      source: `From ${delegateForm.from}`,
      progress: 0
    };
    setTasks([newTask, ...tasks]);
    toast.success(`Task delegated to ${delegateForm.to}!`);
    setShowDelegateModal(false);
    setDelegateForm({ title: '', from: 'Shruti', to: 'Zinia', details: '', priority: 'Medium' });
  };

  // Holiday submission
  const handleHolidaySubmit = (e) => {
    e.preventDefault();
    toast.success(`Holiday logged for ${holidayForm.member}! Backup: ${holidayForm.backup}`);
    setShowHolidayModal(false);
  };

  // Filter routines by selected member & routineFilter
  const filteredRoutines = routineTasks.filter(r => {
    if (selectedMember !== 'All') {
      if (selectedMember === 'Zinia' && r.owner !== 'Zinia') return false;
      if (selectedMember === 'Shruti' && r.owner !== 'Shruti') return false;
      if (selectedMember === 'Sanket' && r.owner !== 'Sanket') return false;
      if (selectedMember === 'Dev' && r.owner !== 'Dev') return false;
      if (selectedMember === 'Warehouse Dispatch Supervisor' && r.owner !== 'Warehouse Dispatch Supervisor') return false;
    }
    if (routineFilter === 'Pending') return !r.isDone;
    if (routineFilter === 'Done') return r.isDone;
    return true;
  });

  // Filter tasks by selected member
  const filteredTasks = tasks.filter(t => {
    if (selectedMember !== 'All') {
      if (selectedMember === 'Zinia' && t.assignee !== 'Zinia') return false;
      if (selectedMember === 'Shruti' && t.assignee !== 'Shruti') return false;
      if (selectedMember === 'Sanket' && t.assignee !== 'Sanket') return false;
      if (selectedMember === 'Dev' && t.assignee !== 'Dev') return false;
    }
    return true;
  });

  const memberTabs = [
    { id: 'All', label: 'All Team', avatar: '👥', count: '1/19', isLeave: false },
    { id: 'Zinia', label: 'Zinia', avatar: 'Z', count: '1/1', isLeave: true },
    { id: 'Warehouse Dispatch Supervisor', label: 'Warehouse Dispatch Supervisor', avatar: 'W', count: '0/2', isLeave: false },
    { id: 'Shruti', label: 'Shruti', avatar: 'S', count: '0/4', isLeave: false },
    { id: 'Sanket', label: 'Sanket', avatar: 'S', count: '0/10', isLeave: false },
    { id: 'Dev', label: 'Dev', avatar: 'D', count: '0/2', isLeave: true },
    { id: 'ALL', label: 'ALL', avatar: 'A', count: '0/0', isLeave: false }
  ];

  return (
    <div className="app-container">
      {/* ================= Top Banner: Employee Station, Delegation & Backlog ================= */}
      <div className="station-banner">
        <div className="station-header">
          <div className="station-title-group">
            <div className="station-icon">
              <Users size={20} />
            </div>
            <div>
              <h2 className="station-title">Employee Station, Delegation & Backlog</h2>
              <p className="station-desc">
                Assign and delegate tasks between members (e.g. Shruti to Zinia), check off daily routines, or mark holidays.
              </p>
            </div>
          </div>

          <div className="station-actions">
            <button 
              className="btn btn-warning-outline" 
              onClick={() => setShowHolidayModal(true)}
            >
              <Palmtree size={15} />
              <span>Mark Holiday</span>
            </button>

            <button 
              className="btn btn-success" 
              onClick={handleCheckOffAll}
            >
              <Check size={15} />
              <span>Check Off Routines</span>
            </button>

            <button 
              className="btn btn-primary" 
              onClick={() => setShowDelegateModal(true)}
            >
              <Plus size={15} />
              <span>Assign / Delegate</span>
            </button>
          </div>
        </div>

        {/* Member Filter Pills Row */}
        <div className="member-scroll-wrapper">
          <div className="member-pills-row">
            {memberTabs.map(m => {
              const isActive = selectedMember === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMember(m.id)}
                  className={`member-pill ${isActive ? 'active' : ''} ${m.isLeave && !isActive ? 'leave-active' : ''}`}
                >
                  <span className="member-avatar-char">{m.avatar}</span>
                  <span>{m.label}</span>
                  {m.isLeave && (
                    <span className="tag-leave">🏖️ Leave</span>
                  )}
                  <span className="pill-count">{m.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2-Column Grid ================= */}
      <div className="dashboard-grid">
        {/* ================= LEFT COLUMN: Everyday Routine Tasks ================= */}
        <div className="section-column">
          <div className="section-top">
            <div className="section-title-wrap">
              <div className="section-icon-box">
                <CheckSquare size={18} />
              </div>
              <div>
                <h3 className="section-title">Everyday Routine Tasks</h3>
                <p className="section-subtitle">Recurring SOP tasks to complete and check off daily.</p>
              </div>
            </div>

            <div className="filter-pills-group">
              <div className="shift-reset-pill">
                <Clock size={12} />
                <span>Auto 7:00 AM Shift Reset Active</span>
              </div>

              <button 
                className={`filter-badge-btn ${routineFilter === 'All' ? 'active' : ''}`}
                onClick={() => setRoutineFilter('All')}
              >
                All (19)
              </button>
              <button 
                className={`filter-badge-btn ${routineFilter === 'Pending' ? 'active' : ''}`}
                onClick={() => setRoutineFilter('Pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-badge-btn ${routineFilter === 'Done' ? 'active' : ''}`}
                onClick={() => setRoutineFilter('Done')}
              >
                Done
              </button>
            </div>
          </div>

          {/* Routine Task Cards List */}
          <div className="routine-list">
            {filteredRoutines.map(r => (
              <div key={r.id} className={`routine-card ${r.isDone ? 'is-done' : ''}`}>
                <div className="routine-top-row">
                  <div className="routine-tags-left">
                    <span className="badge-owner">{r.owner}</span>
                    <span className="badge-frequency">{r.frequency}</span>
                    <span className={r.status === 'Overdue' ? 'badge-status-overdue' : 'badge-status-ok'}>
                      {r.status === 'OK' ? '✓ OK' : r.status === 'Overdue' ? '⚠ Overdue' : r.status}
                    </span>
                  </div>

                  <div className="routine-card-actions">
                    <button className="action-icon-btn" title="Share / Delegate">
                      <Share2 size={14} />
                    </button>
                    <button className="action-icon-btn" title="Copy SOP">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="routine-main-content">
                  <div 
                    className={`routine-checkbox ${r.isDone ? 'checked' : ''}`}
                    onClick={() => handleToggleRoutine(r.id)}
                    title={r.isDone ? 'Mark as pending' : 'Check off as completed'}
                  >
                    {r.isDone && <Check size={13} strokeWidth={3} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className={`routine-title-text ${r.isDone ? 'completed' : ''}`}>
                      {r.title}
                    </div>
                  </div>
                </div>

                <div className="routine-meta-row">
                  Last: <strong style={{ color: r.isDone ? '#059669' : 'inherit' }}>{r.lastDone}</strong> &nbsp;•&nbsp; Due: <span>{r.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Assigned Tasks & Backlog ================= */}
        <div className="section-column">
          <div className="section-top">
            <div className="section-title-wrap">
              <div className="section-icon-box">
                <BarChart2 size={18} />
              </div>
              <div>
                <h3 className="section-title">Assigned Tasks & Backlog</h3>
                <p className="section-subtitle">All team active tasks</p>
              </div>
            </div>

            <button 
              className="btn btn-outline"
              onClick={onOpenAddTask}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>

          {/* Task Cards List */}
          <div className="tasks-list">
            {filteredTasks.map(t => (
              <div key={t.id} className="task-card">
                {/* Header tags */}
                <div className="task-card-header">
                  <div className="task-badges-left">
                    <span className={
                      t.priority === 'Critical' ? 'badge-priority-critical' :
                      t.priority === 'High' ? 'badge-priority-high' :
                      t.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
                    }>
                      {t.priority}
                    </span>

                    <span className={
                      t.status === 'Done' ? 'badge-status-done' :
                      t.status === 'Active' ? 'badge-status-active' :
                      t.status === 'Blocked' ? 'badge-status-blocked' : 'badge-owner'
                    }>
                      {t.status === 'Done' ? '✓ Done' : t.status}
                    </span>

                    <span className="badge-from-manager">
                      <Share2 size={11} /> {t.source}
                    </span>
                  </div>

                  <span className="task-id-badge">{t.taskId}</span>
                </div>

                {/* Title & Assignee */}
                <div className="task-card-title-row">
                  <h4 className="task-card-title">{t.title}</h4>
                  <span className="task-assignee-text">Assignee: <strong>{t.assignee}</strong></span>
                </div>

                <p className="task-card-desc">{t.details}</p>

                {/* Progress bar */}
                <div className="task-progress-box">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${t.progress}%`,
                        background: t.status === 'Blocked' ? '#94a3b8' : t.progress === 100 ? '#10b981' : '#6366f1'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status Switcher Footer */}
                <div className="task-card-footer">
                  <div className="status-switcher-group">
                    {['To Do', 'Active', 'Blocked', 'Done'].map(st => (
                      <button
                        key={st}
                        onClick={() => handleChangeTaskStatus(t.id, st)}
                        className={`status-btn-pill ${t.status === st ? 'selected' : ''}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button className="action-icon-btn" title="Share / Delegate">
                      <Share2 size={14} />
                    </button>
                    <button className="action-icon-btn" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button className="action-icon-btn" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL: Assign / Delegate ================= */}
      {showDelegateModal && (
        <div className="modal-overlay" onClick={() => setShowDelegateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign & Delegate Task</h3>
              <button className="action-icon-btn" onClick={() => setShowDelegateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleDelegateSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. Check order hold status on NDR sheet"
                  value={delegateForm.title}
                  onChange={e => setDelegateForm({...delegateForm, title: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Delegated From</label>
                  <select 
                    className="form-select"
                    value={delegateForm.from}
                    onChange={e => setDelegateForm({...delegateForm, from: e.target.value})}
                  >
                    <option value="Kartik">Kartik (Founder)</option>
                    <option value="Shruti">Shruti (Listings Lead)</option>
                    <option value="Sanket">Sanket (Warehouse Lead)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select 
                    className="form-select"
                    value={delegateForm.to}
                    onChange={e => setDelegateForm({...delegateForm, to: e.target.value})}
                  >
                    <option value="Zinia">Zinia (Customer Support)</option>
                    <option value="Dev">Dev (Packing)</option>
                    <option value="Shruti">Shruti (Listings Lead)</option>
                    <option value="Sanket">Sanket (Warehouse Lead)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select 
                  className="form-select"
                  value={delegateForm.priority}
                  onChange={e => setDelegateForm({...delegateForm, priority: e.target.value})}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions / Details</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Add specifics, customer order IDs, or notes..."
                  value={delegateForm.details}
                  onChange={e => setDelegateForm({...delegateForm, details: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowDelegateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Delegation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Mark Holiday ================= */}
      {showHolidayModal && (
        <div className="modal-overlay" onClick={() => setShowHolidayModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Mark Employee Holiday / Leave</h3>
              <button className="action-icon-btn" onClick={() => setShowHolidayModal(false)}>✕</button>
            </div>
            <form onSubmit={handleHolidaySubmit}>
              <div className="form-group">
                <label className="form-label">Team Member</label>
                <select 
                  className="form-select"
                  value={holidayForm.member}
                  onChange={e => setHolidayForm({...holidayForm, member: e.target.value})}
                >
                  <option value="Zinia">Zinia</option>
                  <option value="Dev">Dev</option>
                  <option value="Shruti">Shruti</option>
                  <option value="Sanket">Sanket</option>
                  <option value="ALL">ALL (Company Holiday / Diwali)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={holidayForm.date}
                  onChange={e => setHolidayForm({...holidayForm, date: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Leave Type / Reason</label>
                <select 
                  className="form-select"
                  value={holidayForm.reason}
                  onChange={e => setHolidayForm({...holidayForm, reason: e.target.value})}
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Public Holiday Swap">Public Holiday Swap</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Backup / Delegate Member</label>
                <select 
                  className="form-select"
                  value={holidayForm.backup}
                  onChange={e => setHolidayForm({...holidayForm, backup: e.target.value})}
                >
                  <option value="Sanket">Sanket</option>
                  <option value="Shruti">Shruti</option>
                  <option value="Zinia">Zinia</option>
                  <option value="Kartik">Kartik</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowHolidayModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Log Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeHub;
