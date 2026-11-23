import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false); const [error, setError] = useState(''); const [pending, setPending] = useState(false);
  if (user) return <Navigate to="/dashboard" replace/>;
  const submit = async (e: FormEvent) => { e.preventDefault(); setError(''); setPending(true); try { if (registering) await register(name, email, password); else await login(email, password); navigate('/dashboard', { replace: true }); } catch (ex) { setError(ex instanceof Error ? ex.message : 'Could not sign in'); } finally { setPending(false); } };
  return <section className="auth-page shell"><div className="auth-aside"><div className="auth-aside-content"><div className="hero-kicker"><span className="pulse-dot"/> THE HAPPY PLACE FOR YOUR BRAIN</div><h2>A little play.<br/><em>A lot of potential.</em></h2><p>Save your high scores, keep your favorites close, and become a familiar face on the leaderboard.</p><div className="auth-brain"><BrainCircuit size={190} strokeWidth={1}/><span>✧</span></div></div></div>
    <div className="auth-form-wrap"><div className="auth-form"><span className="auth-welcome"><Sparkles size={17}/> WELCOME TO BRAINWAVE</span><h1>{registering ? 'Create an account' : 'Good to see you!'}</h1><p>{registering ? 'Join the fun and start collecting victories.' : 'Your next brain break is a sign-in away.'}</p>
    <form onSubmit={submit}>{registering && <label className="field-label">Your name<input value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={60} placeholder="Alex Smith" autoComplete="name" required/></label>}
    <label className="field-label">Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></label>
    <label className="field-label">Password<div className="password-field"><input type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} minLength={registering ? 10 : undefined} placeholder={registering ? 'At least 10 characters' : 'Enter your password'} autoComplete={registering ? 'new-password' : 'current-password'} required/><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div></label>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button button-primary auth-submit" disabled={pending} type="submit">{pending ? 'Working…' : registering ? 'Create my account' : 'Sign in'} <ArrowRight size={18}/></button></form>
    <p className="auth-switch">{registering ? 'Already a member?' : 'New around here?'} <button type="button" onClick={() => { setRegistering(!registering); setError(''); }}>{registering ? 'Sign in' : 'Create an account'}</button></p><div className="auth-back"><Link to="/games">Or continue playing as a guest <ArrowRight size={15}/></Link></div></div></div>
  </section>;
}
