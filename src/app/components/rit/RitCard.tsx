import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal, Bookmark, BadgeCheck, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Rit, formatNumber } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface RitCardProps {
  rit: Rit;
  compact?: boolean;
}

function formatContent(text: string) {
  const parts = text.split(/(\s|^)(#\w+|@\w+)/g);
  return text.split(/(\s)(#\w+|@\w+)/).map((part, i) => {
    if (part.startsWith('#') || part.startsWith('@')) {
      return (
        <span key={i} style={{ color: '#8B5CF6', fontWeight: 500, cursor: 'pointer' }}
          className="hover:underline">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function RitCard({ rit, compact }: RitCardProps) {
  const { likeRit, reRit, addComment } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactPicker, setShowReactPicker] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(rit.id, commentText.trim());
      setCommentText('');
    }
  };

  const totalReactions = rit.likes + rit.loves + rit.insightfuls;
  const hasReacted = rit.isLiked || rit.isLoved || rit.isInsightful;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b"
      style={{ borderColor: 'var(--rg-border)' }}
    >
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <img
            src={rit.user.avatar}
            alt={rit.user.name}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-violet-500 transition-all"
            onClick={() => navigate(`/profile/${rit.user.username}`)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="text-sm cursor-pointer hover:underline truncate"
                  style={{ fontWeight: 700, color: 'var(--rg-text)' }}
                  onClick={() => navigate(`/profile/${rit.user.username}`)}
                >
                  {rit.user.name}
                </span>
                {rit.user.isVerified && (
                  <BadgeCheck size={15} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                )}
                <span className="text-sm truncate" style={{ color: 'var(--rg-text-muted)' }}>
                  @{rit.user.username}
                </span>
                <span style={{ color: 'var(--rg-text-muted)' }}>·</span>
                <span className="text-sm flex-shrink-0" style={{ color: 'var(--rg-text-muted)' }}>
                  {rit.timestamp}
                </span>
              </div>
              <button className="p-1 rounded-full hover:opacity-70 transition-all flex-shrink-0"
                style={{ color: 'var(--rg-text-muted)' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Content */}
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--rg-text)' }}>
              {formatContent(rit.content)}
            </p>

            {/* Image */}
            {rit.image && (
              <div className="mt-3 rounded-2xl overflow-hidden relative"
                style={{ background: 'var(--rg-surface)', maxHeight: compact ? 240 : 420 }}>
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse" style={{ background: 'var(--rg-surface)' }} />
                )}
                <img
                  src={rit.image}
                  alt="Post image"
                  className="w-full object-cover transition-opacity duration-300"
                  style={{ maxHeight: compact ? 240 : 420, opacity: imageLoaded ? 1 : 0 }}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-between">
              {/* Rit-Reacts */}
              <div className="relative">
                <div className="flex items-center gap-1">
                  <button
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-200 hover:opacity-80 group"
                    style={{ color: rit.isLiked ? '#EC4899' : 'var(--rg-text-muted)', background: rit.isLiked ? 'rgba(236,72,153,0.1)' : 'transparent' }}
                    onClick={() => likeRit(rit.id, 'like')}
                    onMouseEnter={() => setShowReactPicker(true)}
                    onMouseLeave={() => setShowReactPicker(false)}
                  >
                    <Heart size={17} fill={rit.isLiked ? '#EC4899' : 'none'} />
                    <span className="text-xs">{formatNumber(totalReactions)}</span>
                  </button>
                </div>

                {/* React picker */}
                {showReactPicker && (
                  <div
                    className="absolute bottom-full left-0 mb-1 flex items-center gap-1 px-3 py-2 rounded-2xl shadow-xl z-50 border"
                    style={{ background: 'var(--rg-card)', borderColor: 'var(--rg-border)' }}
                    onMouseEnter={() => setShowReactPicker(true)}
                    onMouseLeave={() => setShowReactPicker(false)}
                  >
                    <button
                      onClick={() => { likeRit(rit.id, 'like'); setShowReactPicker(false); }}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:scale-125 transition-transform text-lg"
                      title="Like"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => { likeRit(rit.id, 'love'); setShowReactPicker(false); }}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:scale-125 transition-transform text-lg"
                      title="Love"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => { likeRit(rit.id, 'insightful'); setShowReactPicker(false); }}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:scale-125 transition-transform text-lg"
                      title="Insightful"
                    >
                      💡
                    </button>
                  </div>
                )}
              </div>

              {/* Comment */}
              <button
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-200 hover:opacity-80"
                style={{ color: 'var(--rg-text-muted)' }}
                onClick={() => setShowComments(v => !v)}
              >
                <MessageCircle size={17} />
                <span className="text-xs">{formatNumber(rit.comments.length)}</span>
              </button>

              {/* Re-Rit */}
              <button
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-200 hover:opacity-80"
                style={{ color: rit.isReRitted ? '#10B981' : 'var(--rg-text-muted)', background: rit.isReRitted ? 'rgba(16,185,129,0.1)' : 'transparent' }}
                onClick={() => reRit(rit.id)}
              >
                <Repeat2 size={17} />
                <span className="text-xs">{formatNumber(rit.reRits)}</span>
              </button>

              {/* Share */}
              <button
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-200 hover:opacity-80"
                style={{ color: 'var(--rg-text-muted)' }}
              >
                <Share2 size={17} />
                <span className="text-xs">{formatNumber(rit.shares)}</span>
              </button>

              {/* Bookmark */}
              <button
                className="p-1.5 rounded-xl transition-all duration-200 hover:opacity-80"
                style={{ color: bookmarked ? '#8B5CF6' : 'var(--rg-text-muted)' }}
                onClick={() => setBookmarked(v => !v)}
              >
                <Bookmark size={17} fill={bookmarked ? '#8B5CF6' : 'none'} />
              </button>
            </div>

            {/* Reaction summary */}
            {hasReacted && (
              <div className="mt-1 flex items-center gap-1">
                {rit.isLiked && <span className="text-xs">👍</span>}
                {rit.isLoved && <span className="text-xs">❤️</span>}
                {rit.isInsightful && <span className="text-xs">💡</span>}
                <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>
                  You and {formatNumber(totalReactions - 1)} others reacted
                </span>
              </div>
            )}

            {/* Comments */}
            {showComments && (
              <div className="mt-3 space-y-3">
                <div className="h-px" style={{ background: 'var(--rg-border)' }} />

                {rit.comments.map(comment => (
                  <div key={comment.id} className="flex gap-2.5">
                    <img src={comment.user.avatar} alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.user.username}`)} />
                    <div className="flex-1 min-w-0">
                      <div className="rounded-2xl px-3 py-2.5" style={{ background: 'var(--rg-surface)' }}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs cursor-pointer hover:underline"
                            style={{ fontWeight: 600, color: 'var(--rg-text)' }}
                            onClick={() => navigate(`/profile/${comment.user.username}`)}>
                            {comment.user.name}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>· {comment.timestamp}</span>
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--rg-text)' }}>
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 px-1">
                        <button className="text-xs hover:underline" style={{ color: 'var(--rg-text-muted)' }}>Like</button>
                        <button className="text-xs hover:underline" style={{ color: 'var(--rg-text-muted)' }}>Reply</button>
                        <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>{comment.likes} likes</span>
                      </div>

                      {/* Nested replies */}
                      {comment.replies && comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2 mt-2 ml-3">
                          <img src={reply.user.avatar} alt={reply.user.name}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                          <div className="rounded-2xl px-3 py-2" style={{ background: 'var(--rg-surface)' }}>
                            <span className="text-xs" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{reply.user.name}</span>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--rg-text)' }}>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="flex gap-2.5 mt-2">
                  <img src="https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                    alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 flex items-center gap-2 rounded-full px-3 py-2"
                    style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-xs"
                      style={{ color: 'var(--rg-text)' }}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="disabled:opacity-40 transition-all"
                      style={{ color: '#8B5CF6' }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}