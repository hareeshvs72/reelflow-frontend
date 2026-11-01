import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/services.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authService.getMe();
      const token = res.data?.token || res.token || res.data?.data?.token;
      if (token) {
        localStorage.setItem('reelflow_token', token);
      }
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const token = res.data?.token || res.token || res.data?.data?.token;
    if (token) {
      localStorage.setItem('reelflow_token', token);
    }
    setUser(res.data.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const token = res.data?.token || res.token || res.data?.data?.token;
    if (token) {
      localStorage.setItem('reelflow_token', token);
    }
    setUser(res.data.data.user);
    return res.data;
  };

  const logout = async () => {
    localStorage.removeItem('reelflow_token');
    await authService.logout().catch(() => null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
