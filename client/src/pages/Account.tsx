import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Flame, Heart, LockKeyhole, Medal, Trophy, UserRound } from 'lucide-react';
import { api, type Stats } from '../lib/api';
import { useAuth } from '../context/AuthContext';
export default function Account() {
  const { user, refresh } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { api<Stats>('/me/stats').then(setStats).catch(() => undefined); }, []);
  const saveName = async (e: FormEvent) => { e.preventDefault(); setMessage(''); setError(''); try { await api('/account', 'PATCH', { name }); await refresh(); setMessage('Name updated successfully.'); } catch (e) { setError(e instanceof Error ? e.message : 'Update failed'); } };
  const savePassword = async (e: FormEvent) => { e.preventDefault(); setMessage(''); setError(''); try { const response = await api<{ message: string }>('/account/password', 'POST', { currentPassword, newPassword }); setCurrentPassword(''); setNewPassword(''); setMessage(response.message); } catch (e) { setError(e instanceof Error ? e.message : 'Update failed'); } };
  return <section className="shell standard-page"><div className="page-heading"><span className="eyebrow"><UserRound size={16}/> YOUR CORNER</span><h1>Hey there, <em>{user?.name.split(' ')[0]}.</em></h1><p>Every brain has a story. Here's a glimpse of yours.</p></div>
    <div className="account-overview"><div className="account-identity"><div className="account-avatar">{user?.name.charAt(0).toUpperCase()}</div><div><h2>{user?.name}</h2><span>{user?.email}</span></div></div><div className="account-metrics"><span><Medal size={21}/> <strong>{stats?.gamesPlayed || 0}</strong> games</span><span><Trophy size={21}/> <strong>{stats?.bestScore || 0}</strong> best</span><span><Heart size={21}/> <strong>{stats?.favorites || 0}</strong> favorites</span></div></div>
    <div className="account-grid"><div className="panel"><h3><UserRound size={21}/> Profile settings</h3><p>Make this space yours.</p><form onSubmit={saveName}><label className="field-label">Display name<input value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={60} required/></label><button className="button button-primary" type="submit">Save changes</button></form></div>
    <div className="panel"><h3><LockKeyhole size={21}/> Security</h3><p>Keep your account safe.</p><form onSubmit={savePassword}><label className="field-label">Current password<input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} autoComplete="current-password" required/></label><label className="field-label">New password<input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" minLength={10} required/></label><button className="button button-outline" type="submit">Update password</button></form></div></div>
    {message && <div className="form-success" role="status"><CheckCircle2 size={18}/> {message}</div>}{error && <div className="form-error" role="alert">{error}</div>}
    <div className="panel history-panel"><div className="history-head"><div><h3><Flame size={22}/> Your recent plays</h3><p>A little history of your big victories.</p></div><Link to="/games" className="text-link">Play more games →</Link></div>
    {stats?.recent.length ? <div className="history-list">{stats.recent.map(record => <div className="history-row" key={record.id}><span className="history-icon"><CalendarDays size={18}/></span><div><strong>{record.game}</strong><small>{new Date(record.createdAt).toLocaleDateString()} · {record.outcome}</small></div><b>{record.score.toLocaleString()} pts</b></div>)}</div> : <div className="history-empty">No saved plays yet. Your first high score is waiting!</div>}</div>
  </section>;
}
