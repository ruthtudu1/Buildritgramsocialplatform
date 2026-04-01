import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, MessageCircle, UserPlus, Repeat2, AtSign, BadgeCheck, CheckCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

const NotifIcon = ({ type }: { type: string }) => {
  const icons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    like: { icon: <Heart size={14} fill="#EC4899" />, color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
    comment: { icon: <MessageCircle size={14} />, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
    follow: { icon: <UserPlus size={14} />, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    rerit: { icon: <Repeat2 size={14} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    mention: { icon: <AtSign size={14} />, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  };
  const config = icons[type] || icons.like;
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: config.bg, color: config.color }}>
      {config.icon}
    </div>
  );
};

export function NotificationsPage() {
  const { notifications, markNotificationsRead, unreadNotifications } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => markNotificationsRead(), 2000);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b"
        style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:opacity-70 lg:hidden"
            style={{ color: 'var(--rg-text)' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Notifications</h1>
            {unreadNotifications > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ background: '#EC4899', fontWeight: 700 }}>
                {unreadNotifications} new
              </span>
            )}
          </div>
        </div>
        <button onClick={() => markNotificationsRead()} className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
          style={{ color: '#8B5CF6', background: 'rgba(139,92,246,0.1)' }}>
          <CheckCheck size={14} className="inline mr-1" />
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-3 border-b overflow-x-auto" style={{ borderColor: 'var(--rg-border)', scrollbarWidth: 'none' }}>
        {['All', 'Likes', 'Comments', 'Follows', 'Mentions'].map(filter => (
          <button key={filter} className="text-xs px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
            style={filter === 'All' ? {
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              color: 'white',
              fontWeight: 600,
            } : {
              background: 'var(--rg-surface)',
              color: 'var(--rg-text-muted)',
              border: '1px solid var(--rg-border)',
            }}>
            {filter}
          </button>
        ))}
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--rg-border)' }}>
        {/* New Notifications */}
        {unread.length > 0 && (
          <>
            <div className="px-4 py-2">
              <span className="text-xs" style={{ fontWeight: 600, color: 'var(--rg-text-muted)' }}>NEW</span>
            </div>
            {unread.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-3.5 flex items-start gap-3 hover:opacity-80 transition-all cursor-pointer"
                style={{ background: 'rgba(139,92,246,0.04)' }}
              >
                <div className="relative flex-shrink-0">
                  <img src={notif.user.avatar} alt={notif.user.name}
                    className="w-11 h-11 rounded-full object-cover"
                    onClick={() => navigate(`/profile/${notif.user.username}`)} />
                  <div className="absolute -bottom-1 -right-1">
                    <NotifIcon type={notif.type} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm cursor-pointer hover:underline" style={{ fontWeight: 600, color: 'var(--rg-text)' }}
                      onClick={() => navigate(`/profile/${notif.user.username}`)}>
                      {notif.user.name}
                    </span>
                    {notif.user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                    <span className="text-sm" style={{ color: 'var(--rg-text)' }}>{notif.content}</span>
                  </div>
                  {notif.ritContent && (
                    <p className="text-xs mt-1 truncate" style={{ color: 'var(--rg-text-muted)' }}>
                      "{notif.ritContent}"
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: '#8B5CF6' }}>{notif.timestamp}</p>
                </div>

                {/* Follow back button */}
                {notif.type === 'follow' && (
                  <button className="text-xs px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', fontWeight: 600 }}>
                    Follow Back
                  </button>
                )}

                {/* Dot indicator */}
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#8B5CF6' }} />
              </motion.div>
            ))}
          </>
        )}

        {/* Earlier */}
        {read.length > 0 && (
          <>
            <div className="px-4 py-2">
              <span className="text-xs" style={{ fontWeight: 600, color: 'var(--rg-text-muted)' }}>EARLIER</span>
            </div>
            {read.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-3.5 flex items-start gap-3 hover:opacity-80 transition-all cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <img src={notif.user.avatar} alt={notif.user.name}
                    className="w-11 h-11 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1">
                    <NotifIcon type={notif.type} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>
                      {notif.user.name}
                    </span>
                    {notif.user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                    <span className="text-sm" style={{ color: 'var(--rg-text)' }}>{notif.content}</span>
                  </div>
                  {notif.ritContent && (
                    <p className="text-xs mt-1 truncate" style={{ color: 'var(--rg-text-muted)' }}>
                      "{notif.ritContent}"
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--rg-text-muted)' }}>{notif.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.1)' }}>
            <Heart size={28} style={{ color: '#8B5CF6' }} />
          </div>
          <div className="text-center">
            <p className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>No notifications yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--rg-text-muted)' }}>
              When someone likes or comments on your rits, you'll see it here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
