import { Platform, GameDetails } from './pages/Platform';
import type { ReactNode } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DEMO_MODE } from './lib/api';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Games from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import Account from './pages/Account';
import Leaderboard from './pages/Leaderboard';
import GameRouter from './pages/GameRouter';

function Protected({ children }: { children: ReactNode }) { const { user, loading } = useAuth(); return loading ? <div className="shell empty-screen">Loading account…</div> : user ? <>{children}</> : <Navigate to="/login" replace/>; }
export default function App() {
  const Router = DEMO_MODE ? HashRouter : BrowserRouter;
  return <AuthProvider><Router><Routes><Route element={<Layout/>}>
    <Route index element={<Dashboard/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/games" element={<Games/>}/><Route path="/games/:slug" element={<GameDetails/>}/>{["daily","challenges","analytics","history","achievements","training","settings","favorites","about","arena","shop","notifications","friends","seasons","changelog"].map(page=><Route key={page} path={`/${page}`} element={<Platform page={page}/>}/>)}<Route path="/register" element={<LoginPage/>}/>
    <Route path="/play/:slug" element={<GameRouter/>}/>
    <Route path="/leaderboard" element={<Leaderboard/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/account" element={<Protected><Account/></Protected>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Route></Routes></Router></AuthProvider>;
}
