import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type User } from '../lib/api';

type AuthContextValue = {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => { const response = await api<{ user: User | null }>('/auth/me'); setUser(response.user); };
  useEffect(() => { refresh().catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const login = async (email: string, password: string) => { const result = await api<{ user: User }>('/auth/login', 'POST', { email, password }); setUser(result.user); };
  const register = async (name: string, email: string, password: string) => { const result = await api<{ user: User }>('/auth/register', 'POST', { name, email, password }); setUser(result.user); };
  const logout = async () => { await api('/auth/logout', 'POST'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, refresh, login, register, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const auth = useContext(AuthContext); if (!auth) throw new Error('useAuth must be inside AuthProvider'); return auth; }
