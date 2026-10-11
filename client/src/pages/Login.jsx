import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');
    
    setIsLoading(true);
    try {
      await login(email);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google OAuth is not configured yet on cloud. Please enter your email or click a Quick Login button below to sign in instantly!', {
      icon: 'ℹ️',
      duration: 5000
    });
  };

  // Quick login buttons for demo
  const quickLogin = async (email) => {
    setIsLoading(true);
    try {
      await login(email);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container fade-in">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Zap size={32} />
            </div>
            <h1 className="login-title">Femoraah</h1>
            <p className="login-subtitle">Command Center</p>
          </div>

          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="login-divider">or sign in with email</div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="maanavc2006@gmail.com or kartik@femoraah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center' }}>
              Quick Login (Team Check-in)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { name: 'Manav', email: 'maanavc2006@gmail.com', role: 'Admin' },
                { name: 'Kartik', email: 'kartik@femoraah.com', role: 'Admin' },
                { name: 'Shruti', email: 'shruti@femoraah.com', role: 'Lead' },
                { name: 'Sanket', email: 'sanket@femoraah.com', role: 'Lead' },
                { name: 'Zinia', email: 'zinia@femoraah.com', role: 'Member' },
                { name: 'Dev', email: 'dev@femoraah.com', role: 'Member' },
              ].map(u => (
                <button
                  key={u.email}
                  className="btn btn-ghost btn-sm"
                  onClick={() => quickLogin(u.email)}
                  disabled={isLoading}
                  style={{ flex: 1, minWidth: 'fit-content' }}
                >
                  {u.name}
                  <span className={`badge badge-role-${u.role === 'Admin' ? 'admin' : u.role === 'Lead' ? 'lead' : 'member'}`} style={{ fontSize: 10 }}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
