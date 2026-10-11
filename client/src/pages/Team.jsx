import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, Edit2, XCircle, Shield, UserCheck, User,
  Plus, Save
} from 'lucide-react';

const Team = () => {
  const { user, isSuperAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMember, setEditMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', role: 'member', jobTitle: '', expertise: '', maxOpenTasks: 10
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/dashboard/team');
      setMembers(res.data);
    } catch (err) {
      toast.error('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/dashboard/team/${id}`, form);
      toast.success('Member updated');
      setEditMember(null);
      fetchTeam();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      toast.success('Team member added');
      setShowAddModal(false);
      setForm({ name: '', email: '', role: 'member', jobTitle: '', expertise: '', maxOpenTasks: 10 });
      fetchTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const openEditModal = (member) => {
    setEditMember(member);
    setForm({
      name: member.name,
      email: member.email,
      role: member.role,
      jobTitle: member.jobTitle || '',
      expertise: member.expertise || '',
      maxOpenTasks: member.maxOpenTasks || 10
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return <Shield size={16} style={{ color: 'var(--accent-primary-light)' }} />;
      case 'team_lead': return <UserCheck size={16} style={{ color: 'var(--accent-violet)' }} />;
      default: return <User size={16} style={{ color: 'var(--accent-cyan)' }} />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return 'badge-role-admin';
      case 'team_lead': return 'badge-role-lead';
      default: return 'badge-role-member';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'team_lead': return 'Team Lead';
      default: return 'Member';
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage your team members and their roles</p>
        </div>
        {isSuperAdmin() && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Member
          </button>
        )}
      </div>

      <div className="team-grid">
        {members.map((member) => (
          <div key={member._id} className="team-card slide-up">
            <div className="team-card-header">
              <div className="team-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.jobTitle || getRoleLabel(member.role)}</div>
              </div>
              {isSuperAdmin() && (
                <button 
                  className="btn btn-ghost btn-icon btn-sm" 
                  style={{ marginLeft: 'auto' }}
                  onClick={() => openEditModal(member)}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <span className={`badge ${getRoleBadge(member.role)}`}>
                {getRoleIcon(member.role)} {getRoleLabel(member.role)}
              </span>
            </div>

            {member.expertise && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
                {member.expertise}
              </div>
            )}

            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              📧 {member.email}
            </div>

            <div className="team-stats">
              <div className="team-stat">
                <div className="team-stat-value">{member.maxOpenTasks}</div>
                <div className="team-stat-label">Max Tasks</div>
              </div>
              <div className="team-stat">
                <div className="team-stat-value" style={{ color: member.isActive ? 'var(--status-done)' : 'var(--status-overdue)' }}>
                  {member.isActive ? '✓' : '✗'}
                </div>
                <div className="team-stat-label">Active</div>
              </div>
              <div className="team-stat">
                <div className="team-stat-value" style={{ fontSize: 12 }}>
                  {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                </div>
                <div className="team-stat-label">Last Login</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editMember && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditMember(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Edit {editMember.name}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditMember(null)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="super_admin">Super Admin</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Open Tasks</label>
                  <input type="number" className="form-input" value={form.maxOpenTasks} onChange={(e) => setForm({ ...form, maxOpenTasks: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Expertise / Skills</label>
                <textarea className="form-textarea" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditMember(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleUpdate(editMember._id)}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Team Member</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      <option value="member">Member</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input className="form-input" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expertise</label>
                  <textarea className="form-textarea" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
