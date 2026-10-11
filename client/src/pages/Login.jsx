import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const code = accessCode.trim();
    if (!code) {
      return toast.error('Please enter your Member ID');
    }

    setIsLoading(true);
    try {
      const user = await login(code);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error('Invalid Member ID. Please check with Admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container fade-in">
        <div className="login-card" style={{ maxWidth: 400, padding: '36px 32px' }}>
          <div className="login-logo" style={{ marginBottom: 28 }}>
            <div className="login-logo-icon">
              <Zap size={32} />
            </div>
            <h1 className="login-title">Femoraah</h1>
            <p className="login-subtitle">Command Center & Task Tracker</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} color="var(--primary)" />
                Member Access ID
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  className="form-input" 
                  placeholder="Enter your 2-digit ID"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  style={{
                    fontSize: 18,
                    letterSpacing: '2px',
                    textAlign: 'center',
                    padding: '12px 16px',
                    fontWeight: 600
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                Private system for authorized Femoraah team members
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center',
                padding: '12px',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 'var(--radius-md)'
              }}
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? 'Verifying...' : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Enter Workspace <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="var(--success)" />
              Role-Based Access Control Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
