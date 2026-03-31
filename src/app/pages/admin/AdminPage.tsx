import { USERS, RITS, User } from '../../data/mockData';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Users, FileText, AlertTriangle, TrendingUp, Zap,
  Search, Ban, Trash2, Eye, RefreshCw, Shield,
  CheckCircle2, XCircle, LogOut,
  BarChart2, Activity, BadgeCheck, Home,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

// ─── Mock analytics data ────────────────────────────────────────────────────
const GROWTH_DATA = [
  { date: 'Mar 11', users: 1180, posts: 5200 },
  { date: 'Mar 12', users: 1195, posts: 5340 },
  { date: 'Mar 13', users: 1210, posts: 5480 },
  { date: 'Mar 14', users: 1222, posts: 5590 },
  { date: 'Mar 15', users: 1235, posts: 5700 },
  { date: 'Mar 16', users: 1242, posts: 5780 },
  { date: 'Mar 17', users: 1250, posts: 5840 },
];

const CATEGORY_DATA = [
  { name: 'Tech', count: 1840 },
  { name: 'Travel', count: 1230 },
  { name: 'Music', count: 980 },
  { name: 'Design', count: 760 },
  { name: 'Food', count: 640 },
  { name: 'Sports', count: 390 },
];

const PIE_DATA = [
  { name: 'Text', value: 45, color: '#8B5CF6' },
  { name: 'Image', value: 38, color: '#EC4899' },
  { name: 'Video', value: 17, color: '#10B981' },
];

const REPORTS = [
  { id: 'rp1', type: 'Spam', content: 'Repeated promotional messages', user: 'spambot123', time: '10m ago', status: 'open' },
  { id: 'rp2', type: 'Harassment', content: 'Targeted abusive comments', user: 'troll_user', time: '2h ago', status: 'open' },
  { id: 'rp3', type: 'Misinformation', content: 'False health claims', user: 'fakenews45', time: '5h ago', status: 'resolved' },
  { id: 'rp4', type: 'Copyright', content: 'Unauthorized image use', user: 'pirate_acc', time: '1d ago', status: 'resolved' },
];

type AdminTab = 'overview' | 'users' | 'posts' | 'reports';

const ADMIN_NAV = [
  { key: 'overview' as AdminTab, label: 'Overview', icon: <BarChart2 size={18} /> },
  { key: 'users' as AdminTab, label: 'Users', icon: <Users size={18} /> },
  { key: 'posts' as AdminTab, label: 'Posts', icon: <FileText size={18} /> },
  { key: 'reports' as AdminTab, label: 'Reports', icon: <AlertTriangle size={18} /> },
];

const BLOCKED_KEY = 'rg_admin_blocked';
const DELETED_KEY = 'rg_admin_deleted';

function StatCard({ label, value, change, color, icon }: {
  label: string; value: string; change?: string; color: string; icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {change && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl" style={{ fontWeight: 700, color: '#f0f0f8' }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#8888a0' }}>{label}</p>
    </motion.div>
  );
}

export function AdminPage() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [blockedIds, setBlockedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]')); }
    catch { return new Set(); }
  });
  const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')); }
    catch { return new Set(); }
  });
  const [toast, setToast] = useState<string | null>(null);
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>(
    Object.fromEntries(REPORTS.map(r => [r.id, r.status]))
  );

  // All users including current_user mock
  const allUsers: User[] = [
    { id: 'current', name: 'Alex Morgan', username: 'alexmorgan', avatar: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', coverPhoto: '', bio: 'Designer & Creator', location: 'San Francisco, CA', website: 'alexmorgan.dev', followers: 12847, following: 1203, postsCount: 384, isVerified: true, isFollowing: false, joinedDate: 'January 2022' },
    ...USERS,
    { id: 'admin-1', name: 'Admin User', username: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200', coverPhoto: '', bio: 'Ritgram Administrator', location: 'San Francisco, CA', website: 'ritgram.com', followers: 50000, following: 120, postsCount: 0, isVerified: true, isFollowing: false, joinedDate: 'January 2022' },
  ];

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isLoading, isAdmin, navigate]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const toggleBlock = (userId: string) => {
    setBlockedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      localStorage.setItem(BLOCKED_KEY, JSON.stringify([...next]));
      return next;
    });
    showToast(blockedIds.has(userId) ? 'User unblocked.' : 'User blocked successfully.');
  };

  const deletePost = (postId: string) => {
    setDeletedPostIds(prev => {
      const next = new Set(prev);
      next.add(postId);
      localStorage.setItem(DELETED_KEY, JSON.stringify([...next]));
      return next;
    });
    showToast('Post deleted successfully.');
  };

  const resolveReport = (id: string) => {
    setReportStatuses(p => ({ ...p, [id]: 'resolved' }));
    showToast('Report marked as resolved.');
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const activePosts = RITS.filter(r => !deletedPostIds.has(r.id));
  const filteredPosts = activePosts.filter(r =>
    r.content.toLowerCase().includes(postSearch.toLowerCase()) ||
    r.user.name.toLowerCase().includes(postSearch.toLowerCase())
  );

  const openReports = Object.values(reportStatuses).filter(s => s === 'open').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#09090f' }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#09090f' }}>
        <div className="text-center">
          <Shield size={40} style={{ color: '#8888a0' }} className="mx-auto mb-3" />
          <p style={{ color: '#8888a0' }}>Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#09090f', color: '#f0f0f8' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r flex flex-col"
        style={{ background: '#0e0e16', borderColor: 'rgba(255,255,255,0.08)' }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-sm" style={{ fontWeight: 700, color: '#f0f0f8' }}>Ritgram</p>
            <p className="text-xs" style={{ color: '#8888a0' }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={activeTab === item.key
                ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#fff', fontWeight: 600 }
                : { color: '#8888a0' }}
            >
              {item.icon}
              {item.label}
              {item.key === 'reports' && openReports > 0 && (
                <span className="ml-auto text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#EC4899', color: '#fff' }}>
                  {openReports}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: '#8888a0' }}
          >
            <Home size={18} /> Back to App
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Admin user chip */}
        <div className="m-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-center gap-2">
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-xs truncate" style={{ fontWeight: 600, color: '#f0f0f8' }}>{user?.name}</p>
              <p className="text-xs" style={{ color: '#8B5CF6' }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-xl"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(12px)' }}
            >
              <CheckCircle2 size={15} /> {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <h1 className="text-xl" style={{ fontWeight: 700, color: '#f0f0f8' }}>
              {ADMIN_NAV.find(n => n.key === activeTab)?.label}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#8888a0' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => showToast('Data refreshed!')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Users" value="1,250" change="+8 today" color="#8B5CF6" icon={<Users size={20} />} />
                <StatCard label="Total Posts" value="5,840" change="+34 today" color="#EC4899" icon={<FileText size={20} />} />
                <StatCard label="Open Reports" value={String(openReports)} color="#F59E0B" icon={<AlertTriangle size={20} />} />
                <StatCard label="Engagement Rate" value="89%" change="+2.4%" color="#10B981" icon={<TrendingUp size={20} />} />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Growth chart */}
                <div className="xl:col-span-2 p-5 rounded-2xl" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm" style={{ fontWeight: 600, color: '#f0f0f8' }}>User & Post Growth (7 days)</h3>
                    <Activity size={16} style={{ color: '#8888a0' }} />
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={GROWTH_DATA}>
                      <defs>
                        <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="postGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                        labelStyle={{ color: '#f0f0f8', fontWeight: 600 }}
                        itemStyle={{ color: '#8888a0' }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#8B5CF6" fill="url(#userGrad)" strokeWidth={2} name="Users" />
                      <Area type="monotone" dataKey="posts" stroke="#EC4899" fill="url(#postGrad)" strokeWidth={2} name="Posts" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="p-5 rounded-2xl" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-sm mb-4" style={{ fontWeight: 600, color: '#f0f0f8' }}>Post Types</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                        {PIE_DATA.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
                        itemStyle={{ color: '#f0f0f8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {PIE_DATA.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs" style={{ color: '#8888a0' }}>{d.name} {d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category bar chart */}
              <div className="p-5 rounded-2xl" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-sm mb-5" style={{ fontWeight: 600, color: '#f0f0f8' }}>Posts by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={CATEGORY_DATA} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
                      itemStyle={{ color: '#f0f0f8' }}
                      cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                    />
                    <Bar dataKey="count" name="Posts" radius={[6, 6, 0, 0]}>
                      {CATEGORY_DATA.map((_, i) => (
                        <Cell key={i} fill={`hsl(${260 + i * 20}, 70%, ${55 + i * 3}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent reports snippet */}
              <div className="p-5 rounded-2xl" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm" style={{ fontWeight: 600, color: '#f0f0f8' }}>Recent Reports</h3>
                  <button onClick={() => setActiveTab('reports')} className="text-xs hover:underline" style={{ color: '#8B5CF6' }}>
                    View all
                  </button>
                </div>
                {REPORTS.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-3 py-2.5 border-b last:border-0"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: reportStatuses[r.id] === 'open' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)' }}>
                      <AlertTriangle size={14} style={{ color: reportStatuses[r.id] === 'open' ? '#F59E0B' : '#10B981' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: '#f0f0f8' }}>{r.type}</p>
                      <p className="text-xs truncate" style={{ color: '#8888a0' }}>{r.content}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: reportStatuses[r.id] === 'open' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                        color: reportStatuses[r.id] === 'open' ? '#F59E0B' : '#10B981',
                      }}>
                      {reportStatuses[r.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                  <input
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
                <span className="text-sm" style={{ color: '#8888a0' }}>{filteredUsers.length} users</span>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Table header */}
                <div className="grid grid-cols-12 px-5 py-3 text-xs border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#8888a0', fontWeight: 600 }}>
                  <span className="col-span-4">User</span>
                  <span className="col-span-2 hidden sm:block">Role</span>
                  <span className="col-span-2 hidden md:block">Followers</span>
                  <span className="col-span-2 hidden lg:block">Joined</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>

                {filteredUsers.map((u, idx) => {
                  const isBlocked = blockedIds.has(u.id);
                  const isAdminUser = u.id === 'admin-1';
                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="grid grid-cols-12 px-5 py-3.5 border-b items-center transition-all hover:bg-white/[0.02]"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      {/* User info */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                          {isBlocked && (
                            <div className="absolute inset-0 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(239,68,68,0.7)' }}>
                              <Ban size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm truncate" style={{ fontWeight: 600, color: isBlocked ? '#8888a0' : '#f0f0f8' }}>
                              {u.name}
                            </p>
                            {u.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6', flexShrink: 0 }} />}
                          </div>
                          <p className="text-xs truncate" style={{ color: '#8888a0' }}>@{u.username}</p>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="col-span-2 hidden sm:block">
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={isAdminUser
                            ? { background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }
                            : { background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                          {isAdminUser ? 'Admin' : 'User'}
                        </span>
                      </div>

                      {/* Followers */}
                      <div className="col-span-2 hidden md:block">
                        <p className="text-sm" style={{ color: '#f0f0f8' }}>
                          {u.followers >= 1000 ? `${(u.followers / 1000).toFixed(1)}K` : u.followers}
                        </p>
                      </div>

                      {/* Joined */}
                      <div className="col-span-2 hidden lg:block">
                        <p className="text-xs" style={{ color: '#8888a0' }}>{u.joinedDate}</p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/profile/${u.username}`)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                          style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}
                          title="View profile"
                        >
                          <Eye size={13} />
                        </button>
                        {!isAdminUser && (
                          <button
                            onClick={() => toggleBlock(u.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                            style={{ background: isBlocked ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: isBlocked ? '#10B981' : '#F59E0B' }}
                            title={isBlocked ? 'Unblock' : 'Block'}
                          >
                            {isBlocked ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <div className="py-16 text-center" style={{ color: '#8888a0' }}>
                    No users found matching "{userSearch}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── POSTS ── */}
          {activeTab === 'posts' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                  <input
                    value={postSearch}
                    onChange={e => setPostSearch(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
                <span className="text-sm" style={{ color: '#8888a0' }}>{filteredPosts.length} posts</span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {filteredPosts.map((rit, idx) => (
                    <motion.div
                      key={rit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95 }}
                      transition={{ delay: idx * 0.04 }}
                      className="p-4 rounded-2xl"
                      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="flex items-start gap-3">
                        <img src={rit.user.avatar} alt={rit.user.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm" style={{ fontWeight: 600, color: '#f0f0f8' }}>{rit.user.name}</p>
                              {rit.user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                              <span className="text-xs" style={{ color: '#8888a0' }}>· {rit.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: rit.type === 'image' ? 'rgba(236,72,153,0.12)' : rit.type === 'video' ? 'rgba(16,185,129,0.12)' : 'rgba(139,92,246,0.12)', color: rit.type === 'image' ? '#EC4899' : rit.type === 'video' ? '#10B981' : '#8B5CF6' }}>
                                {rit.type}
                              </span>
                              <button
                                onClick={() => deletePost(rit.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                                style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}
                                title="Delete post"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: '#8888a0' }}>
                            {rit.content}
                          </p>
                          {rit.image && (
                            <img src={rit.image} alt="" className="mt-2 rounded-xl object-cover h-24 w-32" />
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            {[
                              { label: `❤️ ${rit.likes + rit.loves + rit.insightfuls}` },
                              { label: `💬 ${rit.comments.length}` },
                              { label: `🔁 ${rit.reRits}` },
                            ].map(s => (
                              <span key={s.label} className="text-xs" style={{ color: '#8888a0' }}>{s.label}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredPosts.length === 0 && (
                  <div className="py-16 text-center" style={{ color: '#8888a0' }}>
                    {deletedPostIds.size > 0
                      ? `All posts deleted. ${deletedPostIds.size} post(s) removed.`
                      : 'No posts found.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Open Reports', value: String(openReports), color: '#F59E0B' },
                  { label: 'Resolved Today', value: String(REPORTS.length - openReports), color: '#10B981' },
                  { label: 'Total This Week', value: String(REPORTS.length), color: '#8B5CF6' },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-2xl text-center"
                    style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-2xl" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#8888a0' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {REPORTS.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="p-5 rounded-2xl"
                    style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: reportStatuses[r.id] === 'open' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)' }}>
                          <AlertTriangle size={18} style={{ color: reportStatuses[r.id] === 'open' ? '#F59E0B' : '#10B981' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm" style={{ fontWeight: 600, color: '#f0f0f8' }}>{r.type}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: reportStatuses[r.id] === 'open' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                                color: reportStatuses[r.id] === 'open' ? '#F59E0B' : '#10B981',
                              }}>
                              {reportStatuses[r.id]}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#8888a0' }}>{r.content}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs" style={{ color: '#8888a0' }}>Reported user: <span style={{ color: '#a78bfa' }}>@{r.user}</span></span>
                            <span className="text-xs" style={{ color: '#8888a0' }}>·</span>
                            <span className="text-xs" style={{ color: '#8888a0' }}>{r.time}</span>
                          </div>
                        </div>
                      </div>
                      {reportStatuses[r.id] === 'open' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => resolveReport(r.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all hover:opacity-80"
                            style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            <CheckCircle2 size={12} /> Resolve
                          </button>
                          <button
                            onClick={() => { resolveReport(r.id); showToast(`@${r.user} has been banned.`); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all hover:opacity-80"
                            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            <XCircle size={12} /> Ban User
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}