import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Search, X, BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { USERS, RITS, TRENDING_HASHTAGS, formatNumber } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { RitCard } from '../components/rit/RitCard';

type SearchTab = 'top' | 'rits' | 'people' | 'media';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<SearchTab>('top');
  const { setSearchQuery, followingIds, toggleFollow } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const q = query.toLowerCase();
  const filteredRits = q
    ? RITS.filter(r =>
        r.content.toLowerCase().includes(q) ||
        r.hashtags.some(h => h.toLowerCase().includes(q.replace('#', ''))) ||
        r.user.name.toLowerCase().includes(q)
      )
    : RITS;

  const filteredUsers = q
    ? USERS.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
      )
    : USERS;

  const filteredHashtags = q
    ? TRENDING_HASHTAGS.filter(h => h.tag.toLowerCase().includes(q.replace('#', '')))
    : TRENDING_HASHTAGS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const tabs: { key: SearchTab; label: string }[] = [
    { key: 'top', label: 'Top' },
    { key: 'rits', label: 'Rits' },
    { key: 'people', label: 'People' },
    { key: 'media', label: 'Media' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b" style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:opacity-70"
            style={{ color: 'var(--rg-text)' }}>
            <ArrowLeft size={20} />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
            <input
              type="text"
              placeholder="Search Ritgram..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--rg-surface)', color: 'var(--rg-text)', border: '1px solid var(--rg-border)' }}
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                style={{ color: 'var(--rg-text-muted)' }}>
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 text-sm relative transition-all"
              style={{
                color: activeTab === tab.key ? '#8B5CF6' : 'var(--rg-text-muted)',
                fontWeight: activeTab === tab.key ? 600 : 400,
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="search-tab" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: '#8B5CF6' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {!query && (
        <div className="p-4 space-y-4">
          <p className="text-xs" style={{ fontWeight: 600, color: 'var(--rg-text-muted)' }}>TRENDING TOPICS</p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_HASHTAGS.map(h => (
              <button
                key={h.tag}
                onClick={() => { setQuery(`#${h.tag}`); setSearchQuery(`#${h.tag}`); }}
                className="text-sm px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
              >
                #{h.tag}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs mb-3" style={{ fontWeight: 600, color: 'var(--rg-text-muted)' }}>RECENT SEARCHES</p>
            {['#WebDev', '@jordankim', 'photography tips', '#AI'].map(item => (
              <button key={item} onClick={() => setQuery(item.replace('@', ''))}
                className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-80 transition-all">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--rg-surface)' }}>
                  <Search size={14} style={{ color: 'var(--rg-text-muted)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--rg-text)' }}>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div>
          {/* Top Tab */}
          {activeTab === 'top' && (
            <div>
              {filteredUsers.slice(0, 2).map(user => {
                const isFollowing = followingIds.has(user.id);
                return (
                  <div key={user.id} className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'var(--rg-border)' }}>
                    <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover cursor-pointer"
                      onClick={() => navigate(`/profile/${user.username}`)} />
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                      <div className="flex items-center gap-1">
                        <span className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{user.name}</span>
                        {user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>@{user.username} · {formatNumber(user.followers)} followers</p>
                    </div>
                    <button onClick={() => toggleFollow(user.id)}
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={isFollowing ? { border: '1px solid var(--rg-border)', color: 'var(--rg-text)' }
                        : { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', fontWeight: 600 }}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
              {filteredRits.slice(0, 3).map(rit => <RitCard key={rit.id} rit={rit} compact />)}
            </div>
          )}

          {/* Rits Tab */}
          {activeTab === 'rits' && (
            <div>
              {filteredRits.length > 0
                ? filteredRits.map(rit => <RitCard key={rit.id} rit={rit} />)
                : <div className="py-16 text-center" style={{ color: 'var(--rg-text-muted)' }}>No rits found for "{query}"</div>
              }
            </div>
          )}

          {/* People Tab */}
          {activeTab === 'people' && (
            <div className="divide-y" style={{ borderColor: 'var(--rg-border)' }}>
              {filteredUsers.length > 0 ? filteredUsers.map(user => {
                const isFollowing = followingIds.has(user.id);
                return (
                  <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-4 py-4 flex items-start gap-3">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover cursor-pointer"
                      onClick={() => navigate(`/profile/${user.username}`)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm cursor-pointer hover:underline" style={{ fontWeight: 600, color: 'var(--rg-text)' }}
                              onClick={() => navigate(`/profile/${user.username}`)}>{user.name}</span>
                            {user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>@{user.username}</p>
                        </div>
                        <button onClick={() => toggleFollow(user.id)}
                          className="text-xs px-4 py-1.5 rounded-full"
                          style={isFollowing ? { border: '1px solid var(--rg-border)', color: 'var(--rg-text)' }
                            : { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', fontWeight: 600 }}>
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                      <p className="text-xs mt-1.5 line-clamp-2" style={{ color: 'var(--rg-text)' }}>{user.bio}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--rg-text-muted)' }}>
                        {formatNumber(user.followers)} followers
                      </p>
                    </div>
                  </motion.div>
                );
              }) : <div className="py-16 text-center" style={{ color: 'var(--rg-text-muted)' }}>No users found</div>}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="grid grid-cols-3 gap-0.5">
              {filteredRits.filter(r => r.image).map((rit, i) => (
                <motion.div key={rit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="aspect-square overflow-hidden relative group cursor-pointer">
                  <img src={rit.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <span className="text-white text-xs">❤️ {formatNumber(rit.likes)}</span>
                  </div>
                </motion.div>
              ))}
              {filteredRits.filter(r => r.image).length === 0 && (
                <div className="col-span-3 py-16 text-center" style={{ color: 'var(--rg-text-muted)' }}>No media found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
