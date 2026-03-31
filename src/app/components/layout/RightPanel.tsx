import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Search } from 'lucide-react';
import { TRENDING_HASHTAGS, SUGGESTED_USERS, formatNumber } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export function RightPanel() {
  const [searchVal, setSearchVal] = useState('');
  const { followingIds, toggleFollow, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal);
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <aside className="w-80 flex-shrink-0 space-y-4 sticky top-0 h-screen overflow-y-auto py-5 pr-1"
      style={{ scrollbarWidth: 'none' }}>

      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--rg-text-muted)' }} />
          <input
            type="text"
            placeholder="Search Ritgram..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--rg-surface)',
              color: 'var(--rg-text)',
              border: '1px solid var(--rg-border)',
            }}
          />
        </div>
      </form>

      {/* Trending */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--rg-surface)' }}>
        <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: 'var(--rg-border)' }}>
          <TrendingUp size={16} style={{ color: '#8B5CF6' }} />
          <span className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Trending Rits</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--rg-border)' }}>
          {TRENDING_HASHTAGS.slice(0, 6).map((item, i) => (
            <button
              key={item.tag}
              onClick={() => navigate(`/search?q=%23${item.tag}`)}
              className="w-full px-4 py-3 flex items-center justify-between hover:opacity-80 transition-all text-left"
            >
              <div>
                <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>#{i + 1} · Trending</p>
                <p className="text-sm mt-0.5" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>#{item.tag}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text-muted)' }}>{item.posts}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                🔥
              </span>
            </button>
          ))}
        </div>
        <button className="w-full px-4 py-3 text-sm transition-all hover:opacity-80"
          style={{ color: '#8B5CF6', fontWeight: 500 }}
          onClick={() => navigate('/explore')}>
          Show more trends →
        </button>
      </div>

      {/* Suggested Users */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--rg-surface)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--rg-border)' }}>
          <span className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Who to Follow</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--rg-border)' }}>
          {SUGGESTED_USERS.map(user => {
            const isFollowing = followingIds.has(user.id);
            return (
              <div key={user.id} className="px-4 py-3 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
                  onClick={() => navigate(`/profile/${user.username}`)}
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                  <div className="flex items-center gap-1">
                    <p className="text-sm truncate" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{user.name}</p>
                    {user.isVerified && (
                      <span className="text-xs" style={{ color: '#8B5CF6' }}>✓</span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--rg-text-muted)' }}>@{user.username}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text-muted)' }}>
                    {formatNumber(user.followers)} followers
                  </p>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                  style={isFollowing ? {
                    background: 'transparent',
                    border: '1px solid var(--rg-border)',
                    color: 'var(--rg-text-muted)',
                  } : {
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
        <button className="w-full px-4 py-3 text-sm transition-all hover:opacity-80"
          style={{ color: '#8B5CF6', fontWeight: 500 }}
          onClick={() => navigate('/explore')}>
          Discover more →
        </button>
      </div>

      {/* Footer */}
      <div className="px-2 pb-4">
        <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>
          © 2026 Ritgram · Privacy · Terms · Cookies
        </p>
      </div>
    </aside>
  );
}
