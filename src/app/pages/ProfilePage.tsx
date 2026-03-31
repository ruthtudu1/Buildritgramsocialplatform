import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Globe, Calendar, BadgeCheck, MoreHorizontal, MessageCircle, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { CURRENT_USER, USERS, RITS, formatNumber } from '../data/mockData';
import { RitCard } from '../components/rit/RitCard';
import { useApp } from '../context/AppContext';

type ProfileTab = 'rits' | 'media' | 'liked';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { followingIds, toggleFollow } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('rits');
  const [coverLoaded, setCoverLoaded] = useState(false);

  const isOwn = username === CURRENT_USER.username;
  const user = isOwn ? CURRENT_USER : USERS.find(u => u.username === username) || USERS[0];
  const isFollowing = followingIds.has(user.id);

  const userRits = RITS.filter(r => r.user.username === username || (isOwn && r.user.id === 'current'));
  const mediaRits = userRits.filter(r => r.image);
  const likedRits = RITS.filter(r => r.isLiked || r.isLoved);

  const tabs: { key: ProfileTab; label: string; count: number }[] = [
    { key: 'rits', label: 'Rits', count: userRits.length },
    { key: 'media', label: 'Media', count: mediaRits.length },
    { key: 'liked', label: 'Liked', count: likedRits.length },
  ];

  const tabContent = activeTab === 'rits' ? userRits : activeTab === 'media' ? mediaRits : likedRits;

  return (
    <div>
      {/* Header bar */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-4 border-b"
        style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:opacity-70 transition-all"
          style={{ color: 'var(--rg-text)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>{user.name}</h1>
            {user.isVerified && <BadgeCheck size={15} style={{ color: '#8B5CF6' }} />}
          </div>
          <p className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>{formatNumber(user.postsCount)} rits</p>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-40 md:h-52 overflow-hidden" style={{ background: 'var(--rg-surface)' }}>
        {!coverLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(135deg, #1e1b2e, #2d1b4e)' }} />
        )}
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
          style={{ opacity: coverLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          onLoad={() => setCoverLoaded(true)}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5))' }} />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4"
              style={{ ringColor: 'var(--rg-bg)', background: 'var(--rg-surface)' }}>
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" style={{ ringColor: 'var(--rg-bg)' }} />
            </div>
            {user.isVerified && (
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: '#8B5CF6', border: '2px solid var(--rg-bg)' }}>
                <BadgeCheck size={13} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-14 md:mt-16">
            {!isOwn && (
              <>
                <button className="p-2 rounded-full border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--rg-border)', color: 'var(--rg-text)' }}>
                  <Bell size={18} />
                </button>
                <button className="p-2 rounded-full border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--rg-border)', color: 'var(--rg-text)' }}
                  onClick={() => navigate('/messages')}>
                  <MessageCircle size={18} />
                </button>
              </>
            )}
            <button
              onClick={() => isOwn ? null : toggleFollow(user.id)}
              className="px-4 py-2 rounded-full text-sm transition-all hover:opacity-90"
              style={isOwn ? {
                border: '1px solid var(--rg-border)',
                color: 'var(--rg-text)',
                background: 'transparent',
                fontWeight: 600,
              } : isFollowing ? {
                border: '1px solid var(--rg-border)',
                color: 'var(--rg-text)',
                background: 'transparent',
                fontWeight: 600,
              } : {
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {isOwn ? 'Edit Profile' : isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="p-2 rounded-full border transition-all hover:opacity-80"
              style={{ borderColor: 'var(--rg-border)', color: 'var(--rg-text)' }}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="flex items-start gap-2 mb-1">
          <h2 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>{user.name}</h2>
          {user.isVerified && <BadgeCheck size={16} style={{ color: '#8B5CF6', marginTop: 3 }} />}
        </div>
        <p className="text-sm" style={{ color: 'var(--rg-text-muted)' }}>@{user.username}</p>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--rg-text)' }}>{user.bio}</p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          {user.location && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--rg-text-muted)' }}>
              <MapPin size={13} /> {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#8B5CF6' }}>
              <Globe size={13} /> {user.website}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--rg-text-muted)' }}>
            <Calendar size={13} /> Joined {user.joinedDate}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-3">
          {[
            { label: 'Rits', value: user.postsCount },
            { label: 'Followers', value: user.followers },
            { label: 'Following', value: user.following },
          ].map(stat => (
            <button key={stat.label} className="flex items-center gap-1 hover:underline transition-all">
              <span className="text-sm" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>
                {formatNumber(stat.value)}
              </span>
              <span className="text-sm" style={{ color: 'var(--rg-text-muted)' }}>{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--rg-border)' }}>
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
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                style={{ background: '#8B5CF6' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'media' ? (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {mediaRits.map(rit => (
            <div key={rit.id} className="aspect-square overflow-hidden relative group">
              <img src={rit.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <span className="text-white text-xs">❤️ {formatNumber(rit.likes)}</span>
                <span className="text-white text-xs">💬 {rit.comments.length}</span>
              </div>
            </div>
          ))}
          {mediaRits.length === 0 && (
            <div className="col-span-3 py-16 text-center" style={{ color: 'var(--rg-text-muted)' }}>
              No media posts yet
            </div>
          )}
        </div>
      ) : (
        <div>
          {tabContent.map(rit => (
            <RitCard key={rit.id} rit={rit} />
          ))}
          {tabContent.length === 0 && (
            <div className="py-16 text-center" style={{ color: 'var(--rg-text-muted)' }}>
              No rits yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}