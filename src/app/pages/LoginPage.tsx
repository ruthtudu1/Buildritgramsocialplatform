import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'admin@ritgram.com', password: 'admin123', color: '#EC4899' },
  { label: 'Alex Morgan', email: 'alex@ritgram.com', password: 'alex123', color: '#8B5CF6' },
  { label: 'Demo User', email: 'demo@ritgram.com', password: 'demo123', color: '#10B981' },
];

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.success) navigate('/');
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#09090f' }}>
      {/* Left – Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="text-2xl tracking-tight" style={{ fontWeight: 800, color: '#f0f0f8' }}>
            Rit<span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gram</span>
          </span>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-5xl leading-tight" style={{ fontWeight: 800, color: '#f0f0f8', lineHeight: 1.15 }}>
              Share what<br />
              <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                moves you.
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed" style={{ color: '#8888a0' }}>
              Join millions creating, connecting, and discovering on Ritgram — the platform built for authentic expression.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {['Rit-Feed', 'Rit-Reacts', 'Rit-Chat DMs', 'Re-Rit', 'Explore', 'Stories'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-sm"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative flex items-center gap-8"
        >
          {[['1.25M+', 'Users'], ['5.8M+', 'Rits'], ['12B+', 'Reactions']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-2xl" style={{ fontWeight: 700, color: '#f0f0f8' }}>{val}</p>
              <p className="text-sm" style={{ color: '#8888a0' }}>{lbl}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right – Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl" style={{ fontWeight: 800, color: '#f0f0f8' }}>
              Rit<span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gram</span>
            </span>
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-2xl mb-1" style={{ fontWeight: 700, color: '#f0f0f8' }}>Welcome back</h2>
            <p className="text-sm mb-6" style={{ color: '#8888a0' }}>Sign in to continue to Ritgram</p>

            {/* Demo credentials */}
            <div className="mb-5 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-xs mb-2" style={{ color: '#8888a0' }}>Quick sign-in (demo accounts):</p>
              <div className="flex gap-2 flex-wrap">
                {DEMO_CREDENTIALS.map(cred => (
                  <button
                    key={cred.email}
                    onClick={() => fillDemo(cred)}
                    className="text-xs px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: `${cred.color}20`, color: cred.color, border: `1px solid ${cred.color}40` }}
                  >
                    {cred.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#1a1a25',
                      color: '#f0f0f8',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#8888a0', fontWeight: 500 }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8888a0' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: '#1a1a25',
                      color: '#f0f0f8',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#8B5CF6'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-all hover:opacity-70"
                    style={{ color: '#8888a0' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button type="button" className="text-xs hover:underline" style={{ color: '#8B5CF6' }}>
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', fontWeight: 600 }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: '#8888a0' }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full py-3 rounded-xl text-sm transition-all hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60"
              style={{ background: '#1a1a25', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500 }}
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Sign up link */}
            <p className="mt-5 text-center text-sm" style={{ color: '#8888a0' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="hover:underline" style={{ color: '#8B5CF6', fontWeight: 600 }}>
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
