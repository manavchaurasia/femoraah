import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Authenticating session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <ShieldAlert size={56} style={{ color: 'var(--status-overdue)' }} />
        <h3 style={{ marginTop: 16 }}>Access Restricted</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
          This section requires {allowedRoles.map(r => r.replace('_', ' ')).join(' or ')} privileges.
          Your current role is <span className="badge badge-role-member">{user.role}</span>.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
