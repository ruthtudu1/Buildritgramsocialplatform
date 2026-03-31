import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Hash, Users, Image, BadgeCheck, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { TRENDING_HASHTAGS, USERS, RITS, formatNumber } from '../data/mockData';
import { useApp } from '../context/AppContext';

type ExploreTab = 'trending' | 'people' | 'media' | 'hashtags';

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState<ExploreTab>('trending');
  const [searchVal, setSearchVal] = useState('');
  const { followingIds, toggleFollow, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const imageRits = RITS.filter(r => r.image);

  const tabs: { key: ExploreTab; label: string; icon: React.ReactNode }[] = [
    { key: 'trending', label: 'Trending', icon: <TrendingUp size={15} /> },
    { key: 'people', label: 'People', icon: <Users size={15} /> },
    { key: 'media', label: 'Media', icon: <Image size={15} /> },
    { key: 'hashtags', label: 'Hashtags', icon: <Hash size={15} /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal);
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b" style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-base mb-3" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Explore</h1>
          <form onSubmit={handleSearch} className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
            <input
              type="text"
              placeholder="Search rits, people, hashtags..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--rg-surface)', color: 'var(--rg-text)', border: '1px solid var(--rg-border)' }}
            />
          </form>
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-3 flex items-center justify-center gap-1.5 text-xs relative transition-all"
              style={{
                color: activeTab === tab.key ? '#8B5CF6' : 'var(--rg-text-muted)',
                fontWeight: activeTab === tab.key ? 600 : 400,
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="explore-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: '#8B5CF6' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tab */}
      {activeTab === 'trending' && (
        <div className="p-4 space-y-3">
          {/* Hero Banner */}
          <div className="rounded-2xl overflow-hidden relative h-36"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED, #EC4899)' }}>
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <p className="text-xs text-purple-200">🔥 Trending Now</p>
              <h2 className="text-white mt-1" style={{ fontWeight: 700 }}>What's Happening</h2>
              <p className="text-xs text-purple-200 mt-1">Discover the most viral rits today</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-white text-7xl">🌊</div>
          </div>

          {/* Trending rits */}
          {RITS.slice(0, 4).map((rit, i) => (
            <motion.div
              key={rit.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 cursor-pointer hover:opacity-80 transition-all"
              style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                  #{i + 1} Trending
                </span>
                <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>
                  {formatNumber(rit.likes + rit.loves)} reactions
                </span>
              </div>
              <div className="flex gap-3">
                <img src={rit.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{rit.user.name}</span>
                    {rit.user.isVerified && <BadgeCheck size={11} style={{ color: '#8B5CF6' }} />}
                  </div>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--rg-text)' }}>
                    {rit.content.slice(0, 100)}...
                  </p>
                </div>
                {rit.image && (
                  <img src={rit.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ml-auto" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* People Tab */}
      {activeTab === 'people' && (
        <div className="p-4 space-y-3">
          <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>Suggested for you</p>
          {USERS.map((user, i) => {
            const isFollowing = followingIds.has(user.id);
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}
              >
                {/* Cover */}
                <div className="h-20 overflow-hidden relative">
                  <img src={user.coverPhoto} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))' }} />
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-end justify-between -mt-7">
                    <img src={user.avatar} alt={user.name}
                      className="w-14 h-14 rounded-full object-cover ring-2"
                      style={{ borderColor: 'var(--rg-surface)', ringColor: 'var(--rg-bg)' }}
                      onClick={() => navigate(`/profile/${user.username}`)} />
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className="mb-1 text-xs px-4 py-1.5 rounded-full transition-all"
                      style={isFollowing ? {
                        border: '1px solid var(--rg-border)',
                        color: 'var(--rg-text)',
                      } : {
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ fontWeight: 700, color: 'var(--rg-text)' }}
                        onClick={() => navigate(`/profile/${user.username}`)}>
                        {user.name}
                      </span>
                      {user.isVerified && <BadgeCheck size={14} style={{ color: '#8B5CF6' }} />}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>@{user.username}</p>
                    <p className="text-xs mt-1.5 line-clamp-2" style={{ color: 'var(--rg-text)' }}>{user.bio}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>
                        <strong style={{ color: 'var(--rg-text)' }}>{formatNumber(user.followers)}</strong> followers
                      </span>
                      <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>
                        <strong style={{ color: 'var(--rg-text)' }}>{formatNumber(user.postsCount)}</strong> rits
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div>
          <div className="grid grid-cols-3 gap-0.5">
            {imageRits.map((rit, i) => (
              <motion.div
                key={rit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="aspect-square overflow-hidden relative group cursor-pointer"
              >
                <img src={rit.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"
                  style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <span className="text-white text-xs">❤️ {formatNumber(rit.likes)}</span>
                  <span className="text-white text-xs">💬 {rit.comments.length}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Hashtags Tab */}
      {activeTab === 'hashtags' && (
        <div className="p-4 space-y-2">
          {TRENDING_HASHTAGS.map((item, i) => (
            <motion.button
              key={item.tag}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(`/search?q=%23${item.tag}`)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:opacity-80 transition-all text-left"
              style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))' }}>
                #
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>#{item.tag}</p>
                <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>{item.posts}</p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                #{i + 1}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
