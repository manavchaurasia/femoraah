import { useState } from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Ban, 
  CalendarClock, 
  Clock, 
  Inbox, 
  Repeat, 
  CheckCircle2 
} from 'lucide-react';

const OverviewTab = () => {
  const stats = [
    { label: 'Open tasks', val: 4, color: '#4f46e5', icon: BarChart3 },
    { label: 'Overdue', val: 1, color: '#dc2626', icon: AlertTriangle },
    { label: 'Blocked', val: 1, color: '#64748b', icon: Ban },
    { label: 'Due in next 7 days', val: 2, color: '#d97706', icon: CalendarClock },
    { label: 'No update in 3+ days', val: 0, color: '#94a3b8', icon: Clock },
    { label: 'Unassigned backlog', val: 2, color: '#2563eb', icon: Inbox },
    { label: 'Routine tasks overdue', val: 1, color: '#dc2626', icon: Repeat }
  ];

  const perPerson = [
    { name: 'Zinia', open: 1, overdue: 0, blocked: 1, due7: 1, stale: 0, capacity: 'Yes' },
    { name: 'Shruti', open: 1, overdue: 0, blocked: 0, due7: 1, stale: 0, capacity: 'Yes' },
    { name: 'Sanket', open: 2, overdue: 1, blocked: 0, due7: 0, stale: 0, capacity: 'Yes' },
    { name: 'Dev', open: 0, overdue: 0, blocked: 0, due7: 0, stale: 0, capacity: 'Yes' },
    { name: 'Kartik', open: 0, overdue: 0, blocked: 0, due7: 0, stale: 0, capacity: 'Yes' }
  ];

  return (
    <div className="app-container">
      <div className="station-banner" style={{ marginBottom: 20 }}>
        <div className="station-header" style={{ marginBottom: 0 }}>
          <div className="station-title-group">
            <div className="station-icon">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="station-title">Manager Overview (Updates Automatically)</h2>
              <p className="station-desc">
                High-level operational pulse, deadline risks, and per-person workload distribution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div 
              key={s.label}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '16px 18px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                <Icon size={16} color={s.color} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
                {s.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per Person Table */}
      <div className="table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 14 }}>
          Per Person Status & Capacity
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: 'center' }}>Open Tasks</th>
              <th style={{ textAlign: 'center' }}>Overdue</th>
              <th style={{ textAlign: 'center' }}>Blocked</th>
              <th style={{ textAlign: 'center' }}>Due in Next 7 Days</th>
              <th style={{ textAlign: 'center' }}>No Update 3+ Days</th>
              <th>Has Capacity?</th>
            </tr>
          </thead>
          <tbody>
            {perPerson.map(p => (
              <tr key={p.name}>
                <td><strong>{p.name}</strong></td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.open}</td>
                <td style={{ textAlign: 'center' }}>
                  {p.overdue > 0 ? (
                    <span className="badge-priority-critical">{p.overdue}</span>
                  ) : <span style={{ color: '#94a3b8' }}>0</span>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {p.blocked > 0 ? (
                    <span className="badge-status-blocked">{p.blocked}</span>
                  ) : <span style={{ color: '#94a3b8' }}>0</span>}
                </td>
                <td style={{ textAlign: 'center' }}>{p.due7}</td>
                <td style={{ textAlign: 'center' }}>{p.stale}</td>
                <td>
                  <span className="badge-status-ok" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} /> {p.capacity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewTab;
