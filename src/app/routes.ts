import { createBrowserRouter } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminPage } from './pages/admin/AdminPage';

export const router = createBrowserRouter([
  // ── Auth pages (standalone, no main layout) ──────────────────────────────
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignupPage },

  // ── Admin panel (own layout, protected) ──────────────────────────────────
  { path: '/admin', Component: AdminPage },

  // ── Main app (MainLayout wraps all children) ─────────────────────────────
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'explore', Component: ExplorePage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'messages', Component: MessagesPage },
      { path: 'search', Component: SearchPage },
      { path: 'profile/:username', Component: ProfilePage },
      { path: 'settings', Component: SettingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
