import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email) => {
    const res = await api.post('/auth/login', { email });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    return api.get('/auth/me').then(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      return res.data;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isSuperAdmin = () => user?.role === 'super_admin';
  const isTeamLead = () => user?.role === 'team_lead';
  const isAdmin = () => user?.role === 'super_admin' || user?.role === 'team_lead';

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, loginWithToken, logout, 
      isSuperAdmin, isTeamLead, isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
