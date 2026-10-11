import { useState } from 'react';
import { Repeat, Plus, Check, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const RoutinesTab = () => {
  const [routines, setRoutines] = useState([
    { id: 1, title: 'Reply to customer queries', owner: 'Zinia', freq: 'Daily', days: 1, last: '11-Oct-26', next: '12-Oct-26', status: 'OK', notes: '' },
    { id: 2, title: 'Order dispatch, label generation, Myntra ticket escalation, packing counts & inventory audits', owner: 'Warehouse Dispatch Supervisor', freq: 'Daily', days: 1, last: '11-Jan-00', next: '', status: 'Pending', notes: '' },
    { id: 3, title: 'Follow up on open customer queries', owner: 'Shruti', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 4, title: 'Process exchanges', owner: 'Shruti', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 5, title: 'Check listings are live and correct on all platforms', owner: 'Shruti', freq: 'Weekly', days: 7, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 6, title: 'Team check-in: review Task Board with the team', owner: 'Shruti', freq: 'Weekly', days: 7, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 7, title: 'Update hold sheet', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 8, title: 'Label processing', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 9, title: 'Dispatch parcels', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 10, title: 'Packing count', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 11, title: 'Raise Myntra tickets for open issues', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 12, title: 'Monthly inventory count', owner: 'Sanket', freq: 'Monthly', days: 30, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 13, title: "Assign Dev's tasks for the day", owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 14, title: 'Pack orders', owner: 'Dev', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 15, title: 'Order Count', owner: 'Sanket', freq: 'Daily', days: 1, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 16, title: 'Reporting to Kartik for Packing re-order', owner: 'Sanket', freq: 'Weekly', days: 7, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 17, title: 'Review open tasks and flags on the Task Board', owner: 'Kartik', freq: 'Daily', days: 1, last: '11-Oct-26', next: '12-Oct-26', status: 'OK', notes: '' },
    { id: 18, title: 'Review Backlog: assign ready tasks to owners', owner: 'Kartik', freq: 'Weekly', days: 7, last: '', next: '', status: 'Not logged yet', notes: '' },
    { id: 19, title: 'Review team workload from the Dashboard', owner: 'Kartik', freq: 'Weekly', days: 7, last: '', next: '', status: 'Not logged yet', notes: '' }
  ]);

  const handleLogDone = (id) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, last: 'Today', status: 'OK' } : r));
    toast.success('Routine logged as completed today ✓');
  };

  return (
    <div className="app-container">
      <div className="station-banner" style={{ marginBottom: 20 }}>
        <div className="station-header" style={{ marginBottom: 0 }}>
          <div className="station-title-group">
            <div className="station-icon">
              <Repeat size={20} />
            </div>
            <div>
              <h2 className="station-title">Daily Routines Master Checklist</h2>
              <p className="station-desc">
                Recurring daily, weekly, and monthly standard operating procedures (SOPs).
              </p>
            </div>
          </div>
          <button className="btn btn-success" onClick={() => toast.success('All daily routines marked done!')}>
            <Check size={15} />
            <span>Check Off All Due Today</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Routine Task</th>
              <th>Owner</th>
              <th>Frequency</th>
              <th style={{ textAlign: 'center' }}>Cadence (Days)</th>
              <th>Last Done</th>
              <th>Next Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {routines.map(r => (
              <tr key={r.id}>
                <td>
                  <strong>{r.title}</strong>
                  {r.notes && <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.notes}</div>}
                </td>
                <td><span className="badge-owner">{r.owner}</span></td>
                <td><span className="badge-frequency">{r.freq}</span></td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.days || 1}</td>
                <td>{r.last || '-'}</td>
                <td>{r.next || '-'}</td>
                <td>
                  <span className={r.status === 'OK' ? 'badge-status-ok' : r.status === 'Overdue' ? 'badge-priority-critical' : 'badge-owner'}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '3px 8px', fontSize: 11 }}
                    onClick={() => handleLogDone(r.id)}
                  >
                    ✓ Log Done
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutinesTab;
