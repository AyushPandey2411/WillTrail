import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => JSON.parse(localStorage.getItem('wt_user') || 'null'));
  const [token,   setToken]   = useState(() => localStorage.getItem('wt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('wt_user', JSON.stringify(data.user));
      } catch { logout(); }
      finally { setLoading(false); }
    };
    verify();
  }, []); // eslint-disable-line

  const login = useCallback((userData, jwt) => {
    setUser(userData); setToken(jwt);
    localStorage.setItem('wt_user', JSON.stringify(userData));
    localStorage.setItem('wt_token', jwt);
  }, []);

  const logout = useCallback(() => {
    setUser(null); setToken(null);
    localStorage.removeItem('wt_user');
    localStorage.removeItem('wt_token');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isModerator = ['admin','moderator'].includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user, isAdmin, isModerator }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
