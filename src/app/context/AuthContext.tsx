import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  website: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  joinedDate: string;
  followers: number;
  following: number;
  postsCount: number;
}

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

type StoredUser = AuthUser & { password: string };

// ─── Seeded mock user database ────────────────────────────────────────────────
const MOCK_USERS: StoredUser[] = [
  {
    id: 'admin-1',
    email: 'admin@ritgram.com',
    password: 'admin123',
    name: 'Admin User',
    username: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '⚡ Ritgram Administrator | Keeping the community safe and thriving',
    location: 'San Francisco, CA',
    website: 'ritgram.com',
    role: 'admin',
    isVerified: true,
    joinedDate: 'January 2022',
    followers: 50000,
    following: 120,
    postsCount: 0,
  },
  {
    id: 'current',
    email: 'alex@ritgram.com',
    password: 'alex123',
    name: 'Alex Morgan',
    username: 'alexmorgan',
    avatar: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1764260640542-3d62cdbf9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '✨ Designer & Creator | Exploring the intersection of tech & art | Coffee enthusiast ☕ | Building cool things @RitgramHQ',
    location: 'San Francisco, CA',
    website: 'alexmorgan.dev',
    role: 'user',
    isVerified: true,
    joinedDate: 'January 2022',
    followers: 12847,
    following: 1203,
    postsCount: 384,
  },
  {
    id: 'demo-user',
    email: 'demo@ritgram.com',
    password: 'demo123',
    name: 'Demo User',
    username: 'demouser',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
    coverPhoto: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    bio: '👋 Just exploring Ritgram! New to the platform.',
    location: 'New York, NY',
    website: '',
    role: 'user',
    isVerified: false,
    joinedDate: 'March 2026',
    followers: 12,
    following: 48,
    postsCount: 3,
  },
];

const AUTH_KEY = 'ritgram_auth_user';
const REGISTERED_KEY = 'ritgram_registered_users';
const PASSWORDS_KEY = 'ritgram_user_passwords';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem(AUTH_KEY); }
    }
    setIsLoading(false);
  }, []);

  const getAllUsers = useCallback((): StoredUser[] => {
    const raw = localStorage.getItem(REGISTERED_KEY);
    const extra: StoredUser[] = raw ? JSON.parse(raw) : [];
    return [...MOCK_USERS, ...extra];
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 750));
    const all = getAllUsers();
    // Check override passwords first
    const overrides: Record<string, string> = (() => {
      try { return JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}'); } catch { return {}; }
    })();

    const found = all.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'No account found with that email.' };

    const expectedPw = overrides[found.id] ?? found.password;
    if (expectedPw !== password) return { success: false, error: 'Incorrect password.' };

    const { password: _, ...authUser } = found;
    setUser(authUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return { success: true };
  }, [getAllUsers]);

  const loginWithGoogle = useCallback(async () => {
    await new Promise(r => setTimeout(r, 1200));
    const googleUser: AuthUser = {
      id: `google-${Date.now()}`,
      email: 'googleuser@gmail.com',
      name: 'Google User',
      username: `user${Date.now().toString().slice(-6)}`,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      bio: '👋 New to Ritgram!',
      location: '',
      website: '',
      role: 'user',
      isVerified: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      followers: 0,
      following: 0,
      postsCount: 0,
    };
    setUser(googleUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(googleUser));
    return { success: true };
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    await new Promise(r => setTimeout(r, 900));
    const all = getAllUsers();
    if (all.find(u => u.email.toLowerCase() === data.email.toLowerCase()))
      return { success: false, error: 'An account with this email already exists.' };
    if (all.find(u => u.username.toLowerCase() === data.username.toLowerCase()))
      return { success: false, error: 'This username is already taken.' };

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username,
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      bio: '',
      location: '',
      website: '',
      role: 'user',
      isVerified: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      followers: 0,
      following: 0,
      postsCount: 0,
    };
    const raw = localStorage.getItem(REGISTERED_KEY);
    const registered: StoredUser[] = raw ? JSON.parse(raw) : [];
    registered.push(newUser);
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));

    const { password: _, ...authUser } = newUser;
    setUser(authUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return { success: true };
  }, [getAllUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      // Also update registered users list if applicable
      const raw = localStorage.getItem(REGISTERED_KEY);
      if (raw) {
        const registered: StoredUser[] = JSON.parse(raw);
        const idx = registered.findIndex(u => u.id === prev.id);
        if (idx !== -1) {
          registered[idx] = { ...registered[idx], ...data };
          localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
        }
      }
      return updated;
    });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await new Promise(r => setTimeout(r, 600));
    if (!user) return { success: false, error: 'Not authenticated.' };
    const all = getAllUsers();
    const overrides: Record<string, string> = (() => {
      try { return JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}'); } catch { return {}; }
    })();
    const found = all.find(u => u.id === user.id);
    if (!found) return { success: false, error: 'User not found.' };
    const expected = overrides[found.id] ?? found.password;
    if (expected !== currentPassword) return { success: false, error: 'Current password is incorrect.' };

    // Save override
    overrides[user.id] = newPassword;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(overrides));
    return { success: true };
  }, [user, getAllUsers]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isAdmin: user?.role === 'admin',
      isLoading, login, loginWithGoogle, signup, logout, updateProfile, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
