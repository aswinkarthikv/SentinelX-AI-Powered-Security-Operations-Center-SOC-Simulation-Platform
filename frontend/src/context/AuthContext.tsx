import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sentinelx_access_token');
    if (token) {
      api.getCurrentUser()
        .then(res => setUser(res.user))
        .catch(() => {
          localStorage.removeItem('sentinelx_access_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      // Default demo login session if not authenticated
      setUser({
        id: 1,
        username: 'analyst_karthik',
        email: 'karthik@sentinelx.soc',
        role: 'SOC Analyst',
        department: 'Cyber Defense Operations',
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const res = await api.login(credentials);
    localStorage.setItem('sentinelx_access_token', res.access_token);
    setUser(res.user);
  };

  const register = async (data: Partial<User> & { password: string }) => {
    const res = await api.register(data);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('sentinelx_access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
