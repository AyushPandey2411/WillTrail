import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import StatsCard from '../components/ui/StatsCard';
import { Users, FileText, Archive, MessageSquare, TrendingUp,
         RefreshCw, Check, X, Eye, Shield, AlertTriangle,
         Settings, ChevronDown, Loader2 } from 'lucide-react';
import { fmtDate, fmtRelative } from '../utils/formatters';

const TABS = ['Overview', 'Users', 'Feedback', 'Analytics'];

// Simple bar chart using CSS widths
function MiniBarChart({ data = [], maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-teal rounded-t-sm transition-all duration-500"
               style={{ height: `${Math.round((d.count / max) * 100)}%`, minHeight: '2px' }}/>
          <span className="text-navy-500 text-xs truncate w-full text-center">{d.date?.slice(-5)}</span>
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS = {
  new:      'badge-amber',
  reviewed: 'badge-teal',
  resolved: 'badge-green',
};

const ROLE_COLORS = {
  admin:     'badge-red',
  moderator: 'badge-amber',
  user:      'badge-teal',
};

export default function AdminDashboard() {
  const [tab,       setTab]       = useState('Overview');
  const [stats,     setStats]     = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [users,     setUsers]     = useState([]);
  const [feedback,  setFeedback]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fbFilter,  setFbFilter]  = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a, u, f] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics?days=7'),
        api.get('/admin/users'),
        api.get('/admin/feedback'),
      ]);
      setStats(s.data);
      setAnalytics(a.data);
      setUsers(u.data.users || []);
      setFeedback(f.data || []);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleUser = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}`, { isActive: !isActive });
      setUsers(u => u.map(x => x._id === id ? {...x, isActive: !x.isActive} : x));
      toast.success(isActive ? 'User deactivated' : 'User activated');
    } catch { toast.error('Update failed'); }
  };

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}`, { role });
      setUsers(u => u.map(x => x._id === id ? {...x, role} : x));
      toast.success('Role updated');
    } catch { toast.error('Update failed'); }
  };

  const updateFeedbackStatus = async (id, status) => {
    try {
      await api.patch(`/admin/feedback/${id}`, { status });
      setFeedback(f => f.map(x => x._id === id ? {...x, status} : x));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const approveTestimonial = async (id) => {
    try {
      await api.patch(`/admin/feedback/${id}`, { isPublic: true, status: 'reviewed' });
      setFeedback(f => f.map(x => x._id === id ? {...x, isPublic: true, status:'reviewed'} : x));
      toast.success('Testimonial approved — now public');
    } catch { toast.error('Failed'); }
  };

  // Build chart data: group analytics by event for registrations
  const regData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const row = analytics.find(a => a.date === dateStr && a.event === 'user.register');
      days.push({ date: dateStr, count: row?.count || 0 });
    }
    return days;
  })();

  const eventSummary = ['user.register','user.login','directive.save','document.upload','qr.generate','pdf.download']
    .map(event => ({
      event,
      total: analytics.filter(a => a.event === event).reduce((s, a) => s + a.count, 0),
    }));

  const filteredFb = fbFilter ? feedback.filter(f => f.type === fbFilter || f.status === fbFilter) : feedback;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-1 flex items-center gap-2">
            <Settings size={28} className="text-amber-light"/> Admin Dashboard
          </h1>
          <p className="text-navy-400">Platform management and analytics</p>
        </div>
        <button onClick={loadAll} disabled={loading}
          className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''}/>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-navy-600 pb-0">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg -mb-px transition-all ${
              tab === t ? 'bg-teal text-white border border-b-0 border-teal' : 'text-navy-400 hover:text-white hover:bg-navy-700'
            }`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={36} className="text-teal animate-spin"/></div>
      ) : (
        <>
          {/* ── Overview ──────────────────────────────────────────── */}
          {tab === 'Overview' && stats && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatsCard icon={Users}       label="Total Users"          value={stats.totalUsers}          color="teal"    trend={stats.newUsers7d > 0 ? Math.round(stats.newUsers7d/stats.totalUsers*100) : 0} trendLabel={`+${stats.newUsers7d} this week`}/>
                <StatsCard icon={Shield}      label="Active Users"         value={stats.activeUsers}         color="emerald" />
                <StatsCard icon={FileText}    label="Completed Directives" value={stats.completedDirectives} color="teal"    />
                <StatsCard icon={Archive}     label="Total Documents"      value={stats.totalDocs}           color="amber"   />
                <StatsCard icon={MessageSquare} label="Pending Feedback"   value={stats.pendingFeedback}     color={stats.pendingFeedback > 0 ? 'crimson' : 'teal'}/>
                <StatsCard icon={TrendingUp}  label="New This Week"        value={stats.newUsers7d}          color="emerald" suffix=" users"/>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-white mb-1">New Registrations — Last 7 Days</h3>
                <p className="text-navy-400 text-xs mb-4">Daily new user sign-ups</p>
                <MiniBarChart data={regData} />
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Event Totals — Last 7 Days</h3>
                <div className="space-y-3">
                  {eventSummary.map(({ event, total }) => {
                    const maxTotal = Math.max(...eventSummary.map(e => e.total), 1);
                    return (
                      <div key={event} className="flex items-center gap-3">
                        <span className="text-navy-400 text-xs font-mono w-36 flex-shrink-0">{event}</span>
                        <div className="flex-1 h-2 bg-navy-600 rounded-full overflow-hidden">
                          <div className="h-full bg-teal rounded-full transition-all duration-500"
                               style={{ width: `${(total/maxTotal)*100}%` }}/>
                        </div>
                        <span className="text-white text-sm font-mono w-8 text-right">{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Users ─────────────────────────────────────────────── */}
          {tab === 'Users' && (
            <div className="animate-fade-in">
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-navy-800 border-b border-navy-600">
                      <tr>
                        {['User','Role','Status','Joined','Login Count','Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-navy-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-navy-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center text-teal text-xs font-bold flex-shrink-0">
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white text-sm">{u.name}</p>
                                <p className="text-navy-400 text-xs">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select value={u.role}
                              onChange={e => changeRole(u._id, e.target.value)}
                              className="bg-navy-800 border border-navy-600 text-navy-300 text-xs rounded-lg px-2 py-1 cursor-pointer">
                              <option value="user">user</option>
                              <option value="moderator">moderator</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-navy-400">{fmtDate(u.createdAt)}</td>
                          <td className="px-4 py-3 text-navy-400 font-mono">{u.loginCount || 0}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleUser(u._id, u.isActive)}
                              className={`text-xs px-2 py-1 rounded-lg transition-all ${u.isActive ? 'text-crimson hover:bg-crimson/10' : 'text-emerald-light hover:bg-emerald/10'}`}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Feedback ──────────────────────────────────────────── */}
          {tab === 'Feedback' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-2 flex-wrap">
                {['','bug','feature','general','testimonial','new','reviewed','resolved'].map(f => (
                  <button key={f} onClick={() => setFbFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${fbFilter === f ? 'bg-teal text-white' : 'bg-navy-700 text-navy-400 hover:text-white'}`}>
                    {f || 'All'}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredFb.map(fb => (
                  <div key={fb._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="badge-teal">{fb.type}</span>
                          <span className={STATUS_COLORS[fb.status] || 'badge-teal'}>{fb.status}</span>
                          {fb.isPublic && <span className="badge-green">Public</span>}
                          {fb.rating && <span className="text-amber-light text-xs">{'★'.repeat(fb.rating)}</span>}
                        </div>
                        {fb.subject && <p className="text-white text-sm font-medium mb-1">{fb.subject}</p>}
                        <p className="text-navy-300 text-sm leading-relaxed">{fb.message}</p>
                        <p className="text-navy-500 text-xs mt-2">
                          {fb.user?.name || fb.displayName || 'Anonymous'} · {fmtRelative(fb.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {fb.status === 'new' && (
                          <button onClick={() => updateFeedbackStatus(fb._id, 'reviewed')}
                            className="text-xs px-2 py-1 rounded-lg text-teal hover:bg-teal/10 transition-all flex items-center gap-1">
                            <Eye size={11}/>Review
                          </button>
                        )}
                        {fb.status !== 'resolved' && (
                          <button onClick={() => updateFeedbackStatus(fb._id, 'resolved')}
                            className="text-xs px-2 py-1 rounded-lg text-emerald-light hover:bg-emerald/10 transition-all flex items-center gap-1">
                            <Check size={11}/>Resolve
                          </button>
                        )}
                        {fb.type === 'testimonial' && !fb.isPublic && (
                          <button onClick={() => approveTestimonial(fb._id)}
                            className="text-xs px-2 py-1 rounded-lg text-amber-light hover:bg-amber/10 transition-all flex items-center gap-1">
                            <Check size={11}/>Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredFb.length === 0 && (
                  <div className="card p-10 text-center">
                    <MessageSquare size={28} className="text-navy-600 mx-auto mb-2"/>
                    <p className="text-navy-400">No feedback found for this filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Analytics ─────────────────────────────────────────── */}
          {tab === 'Analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Daily Events — Last 7 Days</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-600">
                        <th className="text-left py-2 px-3 text-navy-400 font-medium text-xs">Date</th>
                        <th className="text-left py-2 px-3 text-navy-400 font-medium text-xs">Event</th>
                        <th className="text-right py-2 px-3 text-navy-400 font-medium text-xs">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700">
                      {[...analytics].reverse().map((row, i) => (
                        <tr key={i} className="hover:bg-navy-700/20">
                          <td className="py-2 px-3 text-navy-400 font-mono text-xs">{row.date}</td>
                          <td className="py-2 px-3"><span className="badge-teal">{row.event}</span></td>
                          <td className="py-2 px-3 text-right text-white font-mono font-semibold">{row.count}</td>
                        </tr>
                      ))}
                      {analytics.length === 0 && (
                        <tr><td colSpan={3} className="py-8 text-center text-navy-400">No analytics data yet. Run <code className="text-teal text-xs bg-navy-800 px-1 rounded">npm run seed</code> to generate sample data.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
