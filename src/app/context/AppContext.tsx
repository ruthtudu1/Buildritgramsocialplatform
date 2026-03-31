import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CURRENT_USER, USERS, RITS, CONVERSATIONS, NOTIFICATIONS,
  User, Rit, Conversation, Notification,
} from '../data/mockData';

interface AppContextType {
  currentUser: typeof CURRENT_USER;
  rits: Rit[];
  conversations: Conversation[];
  notifications: Notification[];
  activeConversation: string | null;
  searchQuery: string;
  isDarkMode: boolean;
  followingIds: Set<string>;

  likeRit: (ritId: string, type: 'like' | 'love' | 'insightful') => void;
  reRit: (ritId: string) => void;
  addComment: (ritId: string, content: string) => void;
  sendMessage: (convId: string, content: string) => void;
  setActiveConversation: (id: string | null) => void;
  markNotificationsRead: () => void;
  setSearchQuery: (q: string) => void;
  toggleDarkMode: () => void;
  toggleFollow: (userId: string) => void;
  addRit: (content: string, image?: string) => void;
  unreadNotifications: number;
  unreadMessages: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rits, setRits] = useState<Rit[]>(RITS);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(
    new Set(USERS.filter(u => u.isFollowing).map(u => u.id))
  );

  // Apply dark mode on mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const likeRit = useCallback((ritId: string, type: 'like' | 'love' | 'insightful') => {
    setRits(prev => prev.map(rit => {
      if (rit.id !== ritId) return rit;
      if (type === 'like') return { ...rit, isLiked: !rit.isLiked, likes: rit.isLiked ? rit.likes - 1 : rit.likes + 1 };
      if (type === 'love') return { ...rit, isLoved: !rit.isLoved, loves: rit.isLoved ? rit.loves - 1 : rit.loves + 1 };
      return { ...rit, isInsightful: !rit.isInsightful, insightfuls: rit.isInsightful ? rit.insightfuls - 1 : rit.insightfuls + 1 };
    }));
  }, []);

  const reRit = useCallback((ritId: string) => {
    setRits(prev => prev.map(rit => {
      if (rit.id !== ritId) return rit;
      return { ...rit, isReRitted: !rit.isReRitted, reRits: rit.isReRitted ? rit.reRits - 1 : rit.reRits + 1 };
    }));
  }, []);

  const addComment = useCallback((ritId: string, content: string) => {
    setRits(prev => prev.map(rit => {
      if (rit.id !== ritId) return rit;
      const newComment = {
        id: `c-${Date.now()}`,
        user: CURRENT_USER,
        content,
        timestamp: 'just now',
        likes: 0,
        isLiked: false,
      };
      return { ...rit, comments: [...rit.comments, newComment] };
    }));
  }, []);

  const sendMessage = useCallback((convId: string, content: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== convId) return conv;
      const newMsg = {
        id: `m-${Date.now()}`,
        senderId: 'current',
        content,
        timestamp: 'just now',
        status: 'sent' as const,
        type: 'text' as const,
      };
      return {
        ...conv,
        messages: [...conv.messages, newMsg],
        lastMessage: content,
        lastMessageTime: 'just now',
        isTyping: false,
      };
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleFollow = useCallback((userId: string) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const addRit = useCallback((content: string, image?: string) => {
    const newRit: Rit = {
      id: `r-${Date.now()}`,
      user: CURRENT_USER,
      content,
      image,
      timestamp: 'just now',
      likes: 0,
      loves: 0,
      insightfuls: 0,
      comments: [],
      reRits: 0,
      shares: 0,
      isLiked: false,
      isLoved: false,
      isInsightful: false,
      isReRitted: false,
      hashtags: (content.match(/#\w+/g) || []).map(h => h.slice(1)),
      mentions: (content.match(/@\w+/g) || []).map(m => m.slice(1)),
      type: image ? 'image' : 'text',
    };
    setRits(prev => [newRit, ...prev]);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <AppContext.Provider value={{
      currentUser: CURRENT_USER,
      rits,
      conversations,
      notifications,
      activeConversation,
      searchQuery,
      isDarkMode,
      followingIds,
      likeRit,
      reRit,
      addComment,
      sendMessage,
      setActiveConversation,
      markNotificationsRead,
      setSearchQuery,
      toggleDarkMode,
      toggleFollow,
      addRit,
      unreadNotifications,
      unreadMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}