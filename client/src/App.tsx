import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Games from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import Account from './pages/Account';
import Leaderboard from './pages/Leaderboard';
import GameRouter from './pages/GameRouter';

function Protected({ children }: { children: ReactNode }) { const { user, loading } = useAuth(); return loading ? <div className="shell empty-screen">Loading account…</div> : user ? <>{children}</> : <Navigate to="/login" replace/>; }
export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route element={<Layout/>}>
    <Route index element={<Navigate to="/dashboard" replace/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/games" element={<Games/>}/>
    <Route path="/play/:slug" element={<GameRouter/>}/>
    <Route path="/leaderboard" element={<Leaderboard/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/account" element={<Protected><Account/></Protected>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Route></Routes></BrowserRouter></AuthProvider>;
}
