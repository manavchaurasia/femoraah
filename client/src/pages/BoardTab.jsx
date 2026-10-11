import { useState } from 'react';
import { Kanban, Plus, Search, Filter, Inbox, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BoardTab = ({ onOpenAddTask }) => {
  const [subTab, setSubTab] = useState('board'); // 'board' | 'backlog'
  const [search, setSearch] = useState('');

  const [tasks, setTasks] = useState([
    {
      taskId: 'TSK-001',
      title: 'Reply to customer queries',
      details: 'Daily operational routine SOP',
      owner: 'Zinia',
      assignedBy: 'Kartik',
      priority: 'High',
      status: 'Done',
      startDate: '10-Oct-26',
      dueDate: '11-Oct-26',
      percentComplete: 100,
      lastUpdate: '11-Oct-26',
      progressNote: 'All customer queries replied.',
      daysLeft: 0,
      flag: 'Done'
    },
    {
      taskId: 'TSK-002',
      title: 'Warehouse barcode scanner hardware upgrade',
      details: 'Configure 2 new Bluetooth handheld scanners with packaging terminal.',
      owner: 'Sanket',
      assignedBy: 'Kartik',
      priority: 'Medium',
      status: 'In Progress',
      startDate: '09-Oct-26',
      dueDate: '13-Oct-26',
      percentComplete: 40,
      lastUpdate: '11-Oct-26',
      progressNote: '1 scanner paired successfully, testing label printer.',
      daysLeft: 2,
      flag: 'Due Soon'
    },
    {
      taskId: 'TSK-003',
      title: 'Resolve pending NDR order delivery escalations',
      details: 'Contact courier partners (Delhivery, Bluedart) for pending delivery cases.',
      owner: 'Zinia',
      assignedBy: 'Shruti',
      priority: 'Critical',
      status: 'Blocked',
      startDate: '09-Oct-26',
      dueDate: '10-Oct-26',
      percentComplete: 20,
      lastUpdate: '09-Oct-26',
      progressNote: 'Awaiting Bluedart escalation API response.',
      daysLeft: -1,
      flag: 'Blocked'
    },
    {
      taskId: 'TSK-004',
      title: 'New Summer Collection listing on Amazon & Flipkart',
      details: 'Prepare high-res image sets, SEO descriptions, and SKU barcodes for upload.',
      owner: 'Shruti',
      assignedBy: 'Kartik',
      priority: 'High',
      status: 'In Progress',
      startDate: '09-Oct-26',
      dueDate: '13-Oct-26',
      percentComplete: 65,
      lastUpdate: '11-Oct-26',
      progressNote: 'Amazon catalog ready, Flipkart pending final image review.',
      daysLeft: 2,
      flag: 'Due Soon'
    }
  ]);

  const [backlogItems, setBacklogItems] = useState([
    {
      backlogId: 'BKL-001',
      title: 'Integrate automated WhatsApp shipping notification template',
      details: 'Set up webhook for automatic tracking updates to reduce customer support inbound inquiries.',
      skillsNeeded: 'Customer queries, NDR management',
      priority: 'Medium',
      dueDate: '16-Oct-26',
      requestedBy: 'Kartik',
      dateAdded: '09-Oct-26',
      suggestedOwner: 'Zinia',
      why: 'Skills match + has capacity (1/10 tasks)',
      approved: 'Pending',
      status: 'Pending'
    },
    {
      backlogId: 'BKL-002',
      title: 'Automated packing label printer spooler script',
      details: 'Auto spool PDF shipping labels to thermal printer on order confirmation.',
      skillsNeeded: 'Label processing, warehouse management',
      priority: 'High',
      dueDate: '14-Oct-26',
      requestedBy: 'Sanket',
      dateAdded: '10-Oct-26',
      suggestedOwner: 'Sanket',
      why: 'Skills match warehouse supervisor',
      approved: 'Pending',
      status: 'Pending'
    }
  ]);

  const handleApproveBacklog = (id) => {
    toast.success('Backlog approved! Moved to Task Board with suggested owner.');
    setBacklogItems(prev => prev.map(b => b.backlogId === id ? { ...b, approved: 'Yes', status: 'Assigned' } : b));
  };

  return (
    <div className="app-container">
      {/* Banner */}
      <div className="station-banner" style={{ marginBottom: 20 }}>
        <div className="station-header" style={{ marginBottom: 0 }}>
          <div className="station-title-group">
            <div className="station-icon">
              <Kanban size={20} />
            </div>
            <div>
              <h2 className="station-title">Task Board & Pending Backlog</h2>
              <p className="station-desc">
                Operational tasks with automatic SLA flags (Red = Overdue, Amber = Due Soon, Grey = Blocked, Green = Done).
              </p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onOpenAddTask}>
            <Plus size={15} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`btn ${subTab === 'board' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSubTab('board')}
          >
            <Kanban size={15} />
            <span>Task Board ({tasks.length})</span>
          </button>

          <button 
            className={`btn ${subTab === 'backlog' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSubTab('backlog')}
          >
            <Inbox size={15} />
            <span>Pending Backlog ({backlogItems.length})</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="form-input"
            style={{ width: 220, padding: '6px 12px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Task Board Table */}
      {subTab === 'board' ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>% Complete</th>
                <th>Last Update</th>
                <th>Progress Note / Blocker</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).map(t => (
                <tr key={t.taskId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t.taskId}</td>
                  <td>
                    <strong>{t.title}</strong>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t.details}</div>
                  </td>
                  <td><span className="badge-owner">{t.owner}</span></td>
                  <td>
                    <span className={
                      t.priority === 'Critical' ? 'badge-priority-critical' :
                      t.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'
                    }>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span className={
                      t.status === 'Done' ? 'badge-status-done' :
                      t.status === 'Blocked' ? 'badge-status-blocked' : 'badge-status-active'
                    }>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.dueDate}</td>
                  <td style={{ fontWeight: 700, color: t.percentComplete === 100 ? '#059669' : '#4f46e5' }}>
                    {t.percentComplete}%
                  </td>
                  <td>{t.lastUpdate}</td>
                  <td style={{ fontSize: 12, color: '#475569', maxWidth: 220 }}>
                    {t.progressNote || '-'}
                  </td>
                  <td>
                    <span className={
                      t.flag === 'Done' ? 'badge-status-ok' :
                      t.flag === 'Blocked' ? 'badge-status-blocked' :
                      t.flag === 'Overdue' ? 'badge-priority-critical' : 'badge-priority-high'
                    }>
                      {t.flag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Pending Backlog Table */
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Backlog ID</th>
                <th>Task</th>
                <th>Skills Needed</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Suggested Owner</th>
                <th>Why (Match + Workload)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {backlogItems.map(b => (
                <tr key={b.backlogId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.backlogId}</td>
                  <td>
                    <strong>{b.title}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{b.details}</div>
                  </td>
                  <td><span className="badge-owner">{b.skillsNeeded}</span></td>
                  <td>
                    <span className={b.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'}>
                      {b.priority}
                    </span>
                  </td>
                  <td>{b.dueDate}</td>
                  <td><strong>{b.suggestedOwner}</strong></td>
                  <td style={{ fontSize: 12, color: '#64748b', maxWidth: 220 }}>{b.why}</td>
                  <td>
                    <span className={b.status === 'Assigned' ? 'badge-status-ok' : 'badge-priority-high'}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === 'Pending' ? (
                      <button 
                        className="btn btn-success" 
                        style={{ padding: '4px 10px', fontSize: 11 }}
                        onClick={() => handleApproveBacklog(b.backlogId)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ Assigned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BoardTab;
