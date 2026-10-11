import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token)
        .then(() => {
          toast.success('Logged in successfully!');
          navigate('/');
        })
        .catch(() => {
          toast.error('Authentication failed');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="login-page">
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div className="login-logo-icon" style={{ width: 64, height: 64, margin: '0 auto 16px', fontSize: 28 }}>⚡</div>
        <p>Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
