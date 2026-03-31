import { useState, useRef } from 'react';
import { X, Image, Video, Hash, AtSign, Smile, MapPin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

interface Props {
  onClose: () => void;
  prefillContent?: string;
}

const EMOJI_SUGGESTIONS = ['😊', '🔥', '💡', '🚀', '❤️', '✨', '🎉', '💪', '🙌', '😂'];

export function CreateRitModal({ onClose, prefillContent = '' }: Props) {
  const { currentUser, addRit } = useApp();
  const [content, setContent] = useState(prefillContent);
  const [imageUrl, setImageUrl] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [audience, setAudience] = useState<'everyone' | 'followers'>('everyone');
  const [isPosting, setIsPosting] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const charLimit = 500;
  const remaining = charLimit - content.length;
  const progress = (content.length / charLimit) * 100;

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await new Promise(r => setTimeout(r, 600));
    addRit(content.trim(), imageUrl || undefined);
    setIsPosting(false);
    onClose();
  };

  const insertText = (text: string) => {
    const ta = textRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newContent = content.slice(0, start) + text + content.slice(end);
    setContent(newContent);
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + text.length;
      ta.focus();
    }, 0);
  };

  function getHashtags() {
    return (content.match(/#\w+/g) || []).length;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--rg-card)', border: '1px solid var(--rg-border)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--rg-border)' }}>
            <button onClick={onClose} className="p-1.5 rounded-full hover:opacity-70 transition-all"
              style={{ color: 'var(--rg-text-muted)' }}>
              <X size={20} />
            </button>
            <h2 className="text-sm" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Create Rit</h2>
            {/* Audience selector */}
            <button
              onClick={() => setAudience(a => a === 'everyone' ? 'followers' : 'everyone')}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
            >
              <Globe size={12} />
              {audience === 'everyone' ? 'Everyone' : 'Followers'}
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex gap-3">
              <img src={currentUser.avatar} alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>{currentUser.name}</span>
                  <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>@{currentUser.username}</span>
                </div>
                <textarea
                  ref={textRef}
                  value={content}
                  onChange={e => setContent(e.target.value.slice(0, charLimit))}
                  placeholder="What's on your mind? Share a rit... #hashtag @mention"
                  className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed min-h-[120px]"
                  style={{ color: 'var(--rg-text)' }}
                  autoFocus
                />

                {/* Image preview */}
                {imageUrl && (
                  <div className="relative mt-2 rounded-xl overflow-hidden">
                    <img src={imageUrl} alt="preview" className="w-full max-h-64 object-cover rounded-xl" />
                    <button
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white"
                      style={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Hashtag/mention preview */}
                {(content.includes('#') || content.includes('@')) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(content.match(/#\w+/g) || []).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                        {tag}
                      </span>
                    ))}
                    {(content.match(/@\w+/g) || []).map(mention => (
                      <span key={mention} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899' }}>
                        {mention}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emoji picker */}
          {showEmoji && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map(emoji => (
                <button key={emoji} onClick={() => { insertText(emoji); setShowEmoji(false); }}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:scale-110 transition-transform text-lg"
                  style={{ background: 'var(--rg-surface)' }}>
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Image URL input */}
          {!imageUrl && (
            <div className="px-4 pb-2">
              <input
                type="url"
                placeholder="Paste image URL (optional)..."
                className="w-full text-xs px-3 py-2 rounded-xl outline-none"
                style={{ background: 'var(--rg-surface)', color: 'var(--rg-text)', border: '1px solid var(--rg-border)' }}
                onBlur={e => { if (e.target.value) setImageUrl(e.target.value); }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--rg-border)' }}>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                title="Add image">
                <Image size={18} />
              </button>
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                title="Add video">
                <Video size={18} />
              </button>
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                onClick={() => insertText(' #')} title="Add hashtag">
                <Hash size={18} />
              </button>
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                onClick={() => insertText(' @')} title="Mention user">
                <AtSign size={18} />
              </button>
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                onClick={() => setShowEmoji(v => !v)} title="Emoji">
                <Smile size={18} />
              </button>
              <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: '#8B5CF6' }}
                title="Location">
                <MapPin size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Char counter */}
              <div className="relative w-7 h-7">
                <svg viewBox="0 0 28 28" className="w-7 h-7 -rotate-90">
                  <circle cx="14" cy="14" r="10" fill="none" strokeWidth="3"
                    style={{ stroke: 'var(--rg-border)' }} />
                  <circle cx="14" cy="14" r="10" fill="none" strokeWidth="3"
                    style={{
                      stroke: remaining < 50 ? '#EC4899' : '#8B5CF6',
                      strokeDasharray: `${2 * Math.PI * 10}`,
                      strokeDashoffset: `${2 * Math.PI * 10 * (1 - progress / 100)}`,
                      transition: 'stroke-dashoffset 0.2s',
                    }} />
                </svg>
                {remaining < 50 && (
                  <span className="absolute inset-0 flex items-center justify-center" style={{ fontSize: 8, color: remaining < 20 ? '#EC4899' : 'var(--rg-text-muted)' }}>
                    {remaining}
                  </span>
                )}
              </div>

              <button
                onClick={handlePost}
                disabled={!content.trim() || isPosting}
                className="px-5 py-2 rounded-full text-sm text-white disabled:opacity-50 transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', fontWeight: 600 }}
              >
                {isPosting ? 'Ritting...' : 'Rit it!'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
