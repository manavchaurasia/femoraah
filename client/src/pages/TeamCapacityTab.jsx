import { useState } from 'react';
import { Users, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TeamCapacityTab = () => {
  const [members, setMembers] = useState([
    {
      name: 'Kartik',
      role: 'Founder (Super Admin)',
      expertise: 'Approvals, escalations, anything not covered above',
      email: 'kartik@femoraah.com',
      maxOpen: 15,
      open: 1,
      overdue: 0,
      blocked: 0,
      hasCapacity: 'Yes'
    },
    {
      name: 'Shruti',
      role: 'Listings & Team Lead',
      expertise: 'Listing on all platforms, handling the team, exchanges, query follow-ups, ad hoc work',
      email: 'shruti@femoraah.com',
      maxOpen: 10,
      open: 1,
      overdue: 0,
      blocked: 0,
      hasCapacity: 'Yes'
    },
    {
      name: 'Sanket',
      role: 'Warehouse Lead',
      expertise: 'Warehouse management, monthly inventory count, packing count, label processing, daily hold sheet, dispatch, Myntra ticket raising. Assigns Dev\'s work.',
      email: 'sanket@femoraah.com',
      maxOpen: 10,
      open: 2,
      overdue: 1,
      blocked: 0,
      hasCapacity: 'Yes'
    },
    {
      name: 'Zinia',
      role: 'Customer Support',
      expertise: 'Customer queries, hold status, NDR management, order confirmation calls',
      email: 'zinia@femoraah.com',
      maxOpen: 10,
      open: 1,
      overdue: 0,
      blocked: 1,
      hasCapacity: 'Yes'
    },
    {
      name: 'Dev',
      role: 'Packing (reports to Sanket)',
      expertise: 'Packing, plus tasks assigned by Sanket',
      email: 'dev@femoraah.com',
      maxOpen: 10,
      open: 0,
      overdue: 0,
      blocked: 0,
      hasCapacity: 'Yes'
    }
  ]);

  return (
    <div className="app-container">
      <div className="station-banner" style={{ marginBottom: 20 }}>
        <div className="station-header" style={{ marginBottom: 0 }}>
          <div className="station-title-group">
            <div className="station-icon">
              <Users size={20} />
            </div>
            <div>
              <h2 className="station-title">Team & Capacity Command</h2>
              <p className="station-desc">
                Real-time member workload balance, skill profiles, and open task capacity limits.
              </p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => toast.success('Add team member modal')}>
            <Plus size={15} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Expertise / Skills</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Max Open</th>
              <th style={{ textAlign: 'center' }}>Open Tasks</th>
              <th style={{ textAlign: 'center' }}>Overdue</th>
              <th style={{ textAlign: 'center' }}>Blocked</th>
              <th>Has Capacity?</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.email}>
                <td>
                  <strong style={{ color: '#0f172a' }}>{m.name}</strong>
                </td>
                <td>
                  <span className="badge-owner">{m.role}</span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 320 }}>
                  {m.expertise}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{m.email}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{m.maxOpen}</td>
                <td style={{ textAlign: 'center', fontWeight: 600, color: '#4f46e5' }}>{m.open}</td>
                <td style={{ textAlign: 'center' }}>
                  {m.overdue > 0 ? (
                    <span className="badge-priority-critical">{m.overdue}</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>0</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {m.blocked > 0 ? (
                    <span className="badge-status-blocked">{m.blocked}</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>0</span>
                  )}
                </td>
                <td>
                  <span className="badge-status-ok" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} /> {m.hasCapacity}
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

export default TeamCapacityTab;
