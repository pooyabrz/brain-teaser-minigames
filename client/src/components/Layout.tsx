import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BrainCircuit, Gamepad2, Trophy, LayoutDashboard, UserRound, ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const nav = [ { to: '/dashboard', text: 'Discover', Icon: LayoutDashboard }, { to: '/games', text: 'All games', Icon: Gamepad2 }, { to: '/leaderboard', text: 'Leaderboard', Icon: Trophy } ];
export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const signOut = async () => { await logout(); navigate('/dashboard'); };
  return <div className="site">
    <header className="topbar"><div className="shell nav-inner">
      <Link to="/dashboard" className="brand" aria-label="Brainwave home"><span className="brand-mark"><BrainCircuit size={24}/></span><span>brain<span className="brand-accent">wave</span><sup>✦</sup></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(({ to, text }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{text}</NavLink>)}</nav>
      <div className="nav-actions">{user ? <><Link className="avatar-link" to="/account" title="Your account"><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><span className="avatar-text">{user.name.split(' ')[0]}</span></Link><button className="icon-button desktop-only" title="Sign out" aria-label="Sign out" onClick={signOut}><LogOut size={18}/></button></> : <Link className="button button-sm button-primary desktop-only" to="/login">Sign in <ArrowUpRight size={16}/></Link>}
        <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
      </div>
    </div>{open && <nav className="mobile-menu" aria-label="Mobile navigation">{[...nav, { to: user ? '/account' : '/login', text: user ? 'My profile' : 'Sign in', Icon: UserRound }].map(({ to, text, Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)}><Icon size={18}/>{text}</NavLink>)}{user && <button onClick={() => { setOpen(false); void signOut(); }}><LogOut size={18}/> Sign out</button>}</nav>}</header>
    <main id="main"><Outlet/></main>
    <footer className="footer shell"><div><span className="footer-brain"><BrainCircuit size={20}/></span> Made for curious minds.</div><span>Small games. Big brain energy. © {new Date().getFullYear()} Brainwave</span></footer>
  </div>;
}
