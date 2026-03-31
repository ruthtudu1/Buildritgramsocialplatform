import { useNavigate } from 'react-router';
import { Zap } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
        <Zap size={36} className="text-white" fill="white" />
      </div>
      <div>
        <h1 className="text-6xl mb-3" style={{ fontWeight: 800, color: 'var(--rg-text)' }}>404</h1>
        <h2 className="text-xl mb-2" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Page not found</h2>
        <p className="text-sm" style={{ color: 'var(--rg-text-muted)' }}>
          This rit doesn't exist or may have been removed.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 rounded-full text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', fontWeight: 600 }}
      >
        Back to Rit-Feed
      </button>
    </div>
  );
}
