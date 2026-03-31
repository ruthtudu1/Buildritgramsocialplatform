import { useState } from 'react';
import { Image, Video, Smile, PlusCircle } from 'lucide-react';
import { RitCard } from '../components/rit/RitCard';
import { CreateRitModal } from '../components/rit/CreateRitModal';
import { useApp } from '../context/AppContext';
import { CURRENT_USER, USERS } from '../data/mockData';

const STORIES = [
  { id: 'your-story', user: CURRENT_USER, isOwn: true },
  ...USERS.map(u => ({ id: u.id, user: u, isOwn: false })),
];

export function HomePage() {
  const { rits } = useApp();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 border-b"
        style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)', backdropFilter: 'blur(12px)' }}>
        <h1 className="text-base" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Rit-Feed</h1>
      </div>

      {/* Stories / Active Now */}
      <div className="px-4 py-3 border-b overflow-x-auto" style={{ borderColor: 'var(--rg-border)', scrollbarWidth: 'none' }}>
        <div className="flex gap-3 min-w-max">
          {STORIES.map(({ id, user, isOwn }) => (
            <button key={id} className="flex flex-col items-center gap-1.5 group">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full p-0.5"
                  style={{ background: isOwn ? 'var(--rg-surface)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                  <div className="w-full h-full rounded-full overflow-hidden"
                    style={{ border: '2px solid var(--rg-bg)' }}>
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                {isOwn && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: '2px solid var(--rg-bg)' }}>
                    <PlusCircle size={11} className="text-white" />
                  </div>
                )}
                {!isOwn && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                    style={{ background: '#10B981', borderColor: 'var(--rg-bg)' }} />
                )}
              </div>
              <span className="text-xs truncate w-14 text-center" style={{ color: 'var(--rg-text-muted)' }}>
                {isOwn ? 'Your Story' : user.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Compose Quick Box */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--rg-border)' }}>
        <div className="flex items-center gap-3">
          <img src={CURRENT_USER.avatar} alt="You"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <button
            onClick={() => setShowCreate(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full text-sm transition-all hover:opacity-80"
            style={{ background: 'var(--rg-surface)', color: 'var(--rg-text-muted)', border: '1px solid var(--rg-border)' }}
          >
            What's on your mind, {CURRENT_USER.name.split(' ')[0]}?
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2 ml-13 justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
            style={{ color: '#8B5CF6', background: 'rgba(139,92,246,0.1)' }}
          >
            <Image size={14} /> Photo
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
            style={{ color: '#EC4899', background: 'rgba(236,72,153,0.1)' }}
          >
            <Video size={14} /> Video
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
            style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}
          >
            <Smile size={14} /> Feeling
          </button>
        </div>
      </div>

      {/* Feed */}
      <div>
        {rits.map(rit => (
          <RitCard key={rit.id} rit={rit} />
        ))}

        {/* Load more placeholder */}
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--rg-text-muted)' }}>
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
            Loading more rits...
          </div>
        </div>
      </div>

      {showCreate && <CreateRitModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
