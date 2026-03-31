import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Zap, Mail, Lock, User, AtSign, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPw: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10B981', '#8B5CF6'][pwStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.username.trim() || !/^[a-z0-9_]{3,20}$/.test(form.username)) {
      setError('Username must be 3–20 characters (letters, numbers, underscores only).'); return;
    }
    if (!form.email.trim()) { setError('Please enter a valid email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPw) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service.'); return; }

    setLoading(true);
    const result = await signup({
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#09090f' }}>
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-2xl" style={{ fontWeight: 800, color: '#f0f0f8' }}>
            Rit<span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gram</span>
          </span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-2xl mb-1" style={{ fontWeight: 700, color: '#f0f0f8' }}>Create your account</h2>
          <p className="text-sm mb-6" style={{ color: '#8888a0' }}>Join the Ritgram community today</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={15} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Username</label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  placeholder="yourhandle"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              {form.username && (
                <p className="text-xs mt-1" style={{ color: '#8888a0' }}>
                  ritgram.com/profile/<span style={{ color: '#8B5CF6' }}>{form.username}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-all"
                  style={{ color: '#8888a0' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= pwStrength ? strengthColor : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPw}
                  onChange={set('confirmPw')}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#1a1a25', color: '#f0f0f8',
                    border: `1px solid ${form.confirmPw && form.confirmPw !== form.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                  onBlur={e => e.currentTarget.style.borderColor = form.confirmPw && form.confirmPw !== form.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-all"
                  style={{ color: '#8888a0' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {form.confirmPw && form.confirmPw === form.password && (
                  <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2" style={{ color: '#10B981' }} />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <div
                className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: agreed ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'transparent', border: `1px solid ${agreed ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}` }}
                onClick={() => setAgreed(v => !v)}
              >
                {agreed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: '#8888a0' }}>
                I agree to Ritgram's{' '}
                <span className="hover:underline cursor-pointer" style={{ color: '#8B5CF6' }}>Terms of Service</span>
                {' '}and{' '}
                <span className="hover:underline cursor-pointer" style={{ color: '#8B5CF6' }}>Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', fontWeight: 600 }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: '#8888a0' }}>
            Already have an account?{' '}
            <Link to="/login" className="hover:underline" style={{ color: '#8B5CF6', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
