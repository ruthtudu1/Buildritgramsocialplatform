import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, User, Lock, Bell, Shield, Trash2,
  Camera, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff,
  Globe, MapPin, Link as LinkIcon, LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'privacy';

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'profile', label: 'Profile', icon: <User size={17} /> },
  { key: 'account', label: 'Account & Security', icon: <Lock size={17} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={17} /> },
  { key: 'privacy', label: 'Privacy', icon: <Shield size={17} /> },
];

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm"
      style={{
        background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        color: type === 'success' ? '#10B981' : '#f87171',
        border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </motion.div>
  );
}

export function SettingsPage() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    avatar: user?.avatar || '',
    coverPhoto: user?.coverPhoto || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirmPw: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    likes: true, comments: true, follows: true, mentions: true,
    messages: true, rerits: true, email: false, push: true,
  });

  // Privacy prefs
  const [privacy, setPrivacy] = useState({
    privateAccount: false, showActivity: true, allowDMs: true,
    showFollowers: true, indexable: true,
  });

  const avatarRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = async () => {
    if (!profile.name.trim()) { showToast('Name cannot be empty.', 'error'); return; }
    setProfileLoading(true);
    await new Promise(r => setTimeout(r, 600));
    updateProfile(profile);
    setProfileLoading(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwForm.current) { showToast('Enter your current password.', 'error'); return; }
    if (pwForm.newPw.length < 6) { showToast('New password must be at least 6 characters.', 'error'); return; }
    if (pwForm.newPw !== pwForm.confirmPw) { showToast('New passwords do not match.', 'error'); return; }
    setPwLoading(true);
    const result = await changePassword(pwForm.current, pwForm.newPw);
    setPwLoading(false);
    if (result.success) {
      setPwForm({ current: '', newPw: '', confirmPw: '' });
      showToast('Password changed successfully!', 'success');
    } else {
      showToast(result.error || 'Failed to change password.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const inputStyle = {
    background: 'var(--rg-surface)',
    color: 'var(--rg-text)',
    border: '1px solid var(--rg-border)',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = '#8B5CF6');
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--rg-border)');

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-4 border-b"
        style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:opacity-70 transition-all"
          style={{ color: 'var(--rg-text)' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Settings</h1>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar tabs */}
        <div className="md:w-52 flex-shrink-0 border-b md:border-b-0 md:border-r p-3"
          style={{ borderColor: 'var(--rg-border)' }}>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
                style={activeTab === tab.key
                  ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#fff', fontWeight: 600 }
                  : { color: 'var(--rg-text-muted)' }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 max-w-2xl">

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Edit Profile</h2>

              {/* Avatar & Cover */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                {/* Cover */}
                <div className="relative h-28 group cursor-pointer" onClick={() => {
                  const url = prompt('Enter cover photo URL:', profile.coverPhoto);
                  if (url !== null) setProfile(p => ({ ...p, coverPhoto: url }));
                }}>
                  <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                {/* Avatar */}
                <div className="px-4 pb-4">
                  <div className="relative -mt-10 w-20 h-20 group cursor-pointer" onClick={() => {
                    const url = prompt('Enter avatar URL:', profile.avatar);
                    if (url !== null) setProfile(p => ({ ...p, avatar: url }));
                  }}>
                    <img src={profile.avatar} alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover ring-4"
                      style={{ ringColor: 'var(--rg-bg)' }} />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <Camera size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--rg-text-muted)' }}>Click avatar or cover to update URL</p>
                </div>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" />
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Display Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
                      <input
                        value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--rg-text-muted)' }}>@</span>
                      <input
                        value={profile.username}
                        onChange={e => setProfile(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                        className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell the world about yourself..."
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                    style={inputStyle}
                    onFocus={focusStyle as any} onBlur={blurStyle as any}
                  />
                  <p className="text-xs mt-1 text-right" style={{ color: 'var(--rg-text-muted)' }}>
                    {profile.bio.length}/200
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Location</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
                      <input
                        value={profile.location}
                        onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                        placeholder="City, Country"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Website</label>
                    <div className="relative">
                      <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
                      <input
                        value={profile.website}
                        onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                        placeholder="yourwebsite.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                disabled={profileLoading}
                className="px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', fontWeight: 600 }}
              >
                {profileLoading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Save Changes'}
              </button>
            </motion.div>
          )}

          {/* ── ACCOUNT & SECURITY ── */}
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Account & Security</h2>

              {/* Email info */}
              <div className="p-4 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>Account Email</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm" style={{ color: 'var(--rg-text)' }}>{user?.email}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                    Verified
                  </span>
                </div>
              </div>

              {/* Change Password */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                <h3 className="text-sm mb-4" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  {(['current', 'newPw', 'confirmPw'] as const).map((field) => {
                    const labels = { current: 'Current Password', newPw: 'New Password', confirmPw: 'Confirm New Password' };
                    return (
                      <div key={field}>
                        <label className="block text-xs mb-1.5" style={{ color: 'var(--rg-text-muted)', fontWeight: 500 }}>{labels[field]}</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
                          <input
                            type={showPw[field === 'current' ? 'current' : field === 'newPw' ? 'new' : 'confirm'] ? 'text' : 'password'}
                            value={pwForm[field]}
                            onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle}
                            onFocus={focusStyle} onBlur={blurStyle}
                          />
                          <button type="button"
                            onClick={() => setShowPw(p => ({ ...p, [field === 'current' ? 'current' : field === 'newPw' ? 'new' : 'confirm']: !p[field === 'current' ? 'current' : field === 'newPw' ? 'new' : 'confirm'] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                            style={{ color: 'var(--rg-text-muted)' }}>
                            {showPw[field === 'current' ? 'current' : field === 'newPw' ? 'new' : 'confirm'] ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="px-5 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', fontWeight: 600 }}
                  >
                    {pwLoading ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Sessions */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Active Sessions</h3>
                {[
                  { device: 'Chrome on macOS', location: 'San Francisco, CA', current: true, time: 'Now' },
                  { device: 'Safari on iPhone 15', location: 'San Francisco, CA', current: false, time: '2h ago' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0"
                    style={{ borderColor: 'var(--rg-border)' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm" style={{ color: 'var(--rg-text)' }}>{s.device}</p>
                        {s.current && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text-muted)' }}>{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: '#f87171' }}>Danger Zone</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-80 w-fit"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <LogOut size={15} /> Sign Out of Account
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-80 w-fit"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                    onClick={() => showToast('Account deletion requires contacting support.', 'error')}
                  >
                    <Trash2 size={15} /> Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h2 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Notification Preferences</h2>

              {[
                { section: 'In-App Notifications', items: [
                  { key: 'likes', label: 'Likes & Reactions', desc: 'When someone reacts to your rit' },
                  { key: 'comments', label: 'Comments', desc: 'When someone comments on your rit' },
                  { key: 'follows', label: 'New Followers', desc: 'When someone follows you' },
                  { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                  { key: 'messages', label: 'Direct Messages', desc: 'New message notifications' },
                  { key: 'rerits', label: 'Re-Rits', desc: 'When someone re-rits your post' },
                ]},
                { section: 'Delivery Methods', items: [
                  { key: 'email', label: 'Email Notifications', desc: 'Get notified via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                ]},
              ].map(({ section, items }) => (
                <div key={section} className="p-5 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                  <h3 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{section}</h3>
                  <div className="space-y-1">
                    {items.map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-2.5 border-b last:border-0"
                        style={{ borderColor: 'var(--rg-border)' }}>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--rg-text)' }}>{label}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text-muted)' }}>{desc}</p>
                        </div>
                        <div
                          className="relative w-11 h-6 rounded-full cursor-pointer transition-all flex-shrink-0"
                          style={{ background: notifs[key as keyof typeof notifs] ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'var(--rg-border)' }}
                          onClick={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof notifs] }))}
                        >
                          <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                            style={{ left: notifs[key as keyof typeof notifs] ? 'calc(100% - 20px)' : '4px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => showToast('Notification preferences saved!', 'success')}
                className="px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', fontWeight: 600 }}
              >
                Save Preferences
              </button>
            </motion.div>
          )}

          {/* ── PRIVACY ── */}
          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <h2 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Privacy Settings</h2>

              <div className="p-5 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                {[
                  { key: 'privateAccount', label: 'Private Account', desc: 'Only approved followers can see your rits' },
                  { key: 'showActivity', label: 'Show Activity Status', desc: 'Let others see when you were last active' },
                  { key: 'allowDMs', label: 'Allow Direct Messages', desc: 'Let anyone send you Rit-Chat messages' },
                  { key: 'showFollowers', label: 'Show Followers List', desc: 'Make your followers list visible' },
                  { key: 'indexable', label: 'Searchable Profile', desc: 'Allow your profile to appear in search results' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: 'var(--rg-border)' }}>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--rg-text)' }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text-muted)' }}>{desc}</p>
                    </div>
                    <div
                      className="relative w-11 h-6 rounded-full cursor-pointer transition-all flex-shrink-0"
                      style={{ background: privacy[key as keyof typeof privacy] ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'var(--rg-border)' }}
                      onClick={() => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof privacy] }))}
                    >
                      <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                        style={{ left: privacy[key as keyof typeof privacy] ? 'calc(100% - 20px)' : '4px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Blocked users */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                <h3 className="text-sm mb-2" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Blocked Users</h3>
                <p className="text-sm" style={{ color: 'var(--rg-text-muted)' }}>You haven't blocked anyone yet.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => showToast('Privacy settings saved!', 'success')}
                  className="px-6 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', fontWeight: 600 }}
                >
                  Save Settings
                </button>
                <button
                  onClick={() => showToast('Privacy data request submitted. You will receive an email shortly.', 'success')}
                  className="px-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
                  style={{ background: 'var(--rg-surface)', color: 'var(--rg-text)', border: '1px solid var(--rg-border)' }}
                >
                  Download My Data
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
