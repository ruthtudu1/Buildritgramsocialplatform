import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Send, Image, Smile, Phone, Video, MoreHorizontal, BadgeCheck, Check, CheckCheck, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Conversation } from '../data/mockData';

export function MessagesPage() {
  const { conversations, sendMessage, currentUser } = useApp();
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filtered = conversations.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConv = activeConv
    ? conversations.find(c => c.id === activeConv.id) || null
    : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedConv) return;
    sendMessage(selectedConv.id, inputText.trim());
    setInputText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'seen') return <CheckCheck size={12} style={{ color: '#8B5CF6' }} />;
    if (status === 'delivered') return <CheckCheck size={12} style={{ color: 'var(--rg-text-muted)' }} />;
    return <Check size={12} style={{ color: 'var(--rg-text-muted)' }} />;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--rg-bg)' }}>
      {/* Conversation List */}
      <div className={`w-full lg:w-80 flex-shrink-0 flex flex-col border-r ${selectedConv ? 'hidden lg:flex' : 'flex'}`}
        style={{ borderColor: 'var(--rg-border)' }}>

        {/* Header */}
        <div className="px-4 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--rg-border)' }}>
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:opacity-70 lg:hidden"
            style={{ color: 'var(--rg-text)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base flex-1" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>Rit-Chat</h1>
          <button className="p-1.5 rounded-full hover:opacity-70" style={{ color: 'var(--rg-text-muted)' }}>
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--rg-border)' }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rg-text-muted)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--rg-surface)', color: 'var(--rg-text)', border: '1px solid var(--rg-border)' }}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className="w-full px-4 py-3.5 flex items-center gap-3 hover:opacity-80 transition-all text-left border-b"
              style={{
                borderColor: 'var(--rg-border)',
                background: selectedConv?.id === conv.id ? 'rgba(139,92,246,0.08)' : 'transparent',
              }}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.user.avatar} alt={conv.user.name}
                  className="w-12 h-12 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                  style={{ background: '#10B981', borderColor: 'var(--rg-bg)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-sm truncate" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>
                      {conv.user.name}
                    </span>
                    {conv.user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--rg-text-muted)' }}>
                    {conv.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs truncate flex-1" style={{ color: 'var(--rg-text-muted)' }}>
                    {conv.isTyping ? (
                      <span style={{ color: '#8B5CF6' }}>typing...</span>
                    ) : (
                      conv.lastMessage
                    )}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: '#8B5CF6', fontSize: 10, fontWeight: 700 }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${selectedConv ? 'flex' : 'hidden lg:flex'}`}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b flex items-center gap-3"
              style={{ background: 'var(--rg-bg)', borderColor: 'var(--rg-border)' }}>
              <button onClick={() => setActiveConv(null)} className="p-1.5 rounded-full hover:opacity-70 lg:hidden"
                style={{ color: 'var(--rg-text)' }}>
                <ArrowLeft size={20} />
              </button>
              <img src={selectedConv.user.avatar} alt={selectedConv.user.name}
                className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>{selectedConv.user.name}</span>
                  {selectedConv.user.isVerified && <BadgeCheck size={13} style={{ color: '#8B5CF6' }} />}
                </div>
                <p className="text-xs flex items-center gap-1" style={{ color: '#10B981' }}>
                  <Circle size={7} fill="#10B981" />
                  {selectedConv.isTyping ? 'typing...' : 'Active now'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: 'var(--rg-text-muted)' }}>
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: 'var(--rg-text-muted)' }}>
                  <Video size={18} />
                </button>
                <button className="p-2 rounded-full hover:opacity-70 transition-all" style={{ color: 'var(--rg-text-muted)' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
              {selectedConv.messages.map((msg, i) => {
                const isMe = msg.senderId === 'current';
                const showAvatar = !isMe && (i === 0 || selectedConv.messages[i - 1]?.senderId !== msg.senderId);

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-7 flex-shrink-0">
                        {showAvatar && (
                          <img src={selectedConv.user.avatar} alt=""
                            className="w-7 h-7 rounded-full object-cover" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-xs md:max-w-sm ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                        style={isMe ? {
                          background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                          color: 'white',
                          borderBottomRightRadius: 4,
                        } : {
                          background: 'var(--rg-surface)',
                          color: 'var(--rg-text)',
                          border: '1px solid var(--rg-border)',
                          borderBottomLeftRadius: 4,
                        }}
                      >
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1 px-1">
                        <span className="text-xs" style={{ color: 'var(--rg-text-muted)' }}>{msg.timestamp}</span>
                        {isMe && <StatusIcon status={msg.status} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {selectedConv.isTyping && (
                <div className="flex items-end gap-2">
                  <img src={selectedConv.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
                    style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{
                          background: 'var(--rg-text-muted)',
                          animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--rg-border)' }}>
              <div className="flex items-center gap-2 rounded-2xl px-3 py-2"
                style={{ background: 'var(--rg-surface)', border: '1px solid var(--rg-border)' }}>
                <button className="p-1 hover:opacity-70" style={{ color: '#8B5CF6' }}>
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  placeholder={`Message ${selectedConv.user.name}...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--rg-text)' }}
                />
                <button className="p-1 hover:opacity-70" style={{ color: '#8B5CF6' }}>
                  <Image size={20} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.1)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-base" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>Your Rit-Chat</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--rg-text-muted)' }}>
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}