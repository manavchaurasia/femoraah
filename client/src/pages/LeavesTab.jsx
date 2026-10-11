import { useState } from 'react';
import { Palmtree, Calendar, Plus, RefreshCw, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LeavesTab = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      member: 'Zinia',
      role: 'Customer Support',
      type: 'Annual Leave',
      date: '11-Oct-26',
      backup: 'Sanket',
      status: 'Active Today',
      notes: 'Backup/Delegate: Sanket'
    },
    {
      id: 2,
      member: 'Dev',
      role: 'Packing',
      type: 'Annual Leave',
      date: '11-Oct-26',
      backup: 'Zinia',
      status: 'Active Today',
      notes: 'Backup/Delegate: Zinia'
    },
    {
      id: 3,
      member: 'Shruti',
      role: 'Listings & Team Lead',
      type: 'Public Holiday Swap',
      date: '20-Oct-26',
      backup: 'Self / Shift Swap',
      status: 'Upcoming',
      notes: 'Original: 2026-10-25 → Swapped to: 2026-10-20. Worked on public holiday; swapped leave taken on alternate shift date.'
    },
    {
      id: 4,
      member: 'ALL (Company)',
      role: 'All Team Members',
      type: 'Diwali Public Holiday',
      date: '30-Oct-26',
      backup: 'Full Ops Pause',
      status: 'Public Holiday',
      notes: 'Company observed public holiday (eligible for swap)'
    }
  ]);

  return (
    <div className="app-container">
      <div className="station-banner" style={{ marginBottom: 20 }}>
        <div className="station-header" style={{ marginBottom: 0 }}>
          <div className="station-title-group">
            <div className="station-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
              <Palmtree size={20} />
            </div>
            <div>
              <h2 className="station-title">Calendar & Leaves Hub</h2>
              <p className="station-desc">
                Public holidays, employee annual leaves, and operational coverage delegation.
              </p>
            </div>
          </div>
          <button className="btn btn-warning-outline" onClick={() => toast.success('Open leave request modal')}>
            <Plus size={15} />
            <span>Request Leave / Swap</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Leave / Holiday Type</th>
              <th>Date</th>
              <th>Coverage Backup</th>
              <th>Status</th>
              <th>Notes / Swap Details</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id}>
                <td><strong>{l.member}</strong></td>
                <td>{l.role}</td>
                <td>
                  <span className="tag-leave" style={{ fontSize: 11 }}>
                    {l.type}
                  </span>
                </td>
                <td><strong>{l.date}</strong></td>
                <td>
                  <span className="badge-owner">
                    {l.backup}
                  </span>
                </td>
                <td>
                  <span className={l.status === 'Active Today' ? 'badge-priority-high' : 'badge-status-ok'}>
                    {l.status}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 300 }}>{l.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeavesTab;
