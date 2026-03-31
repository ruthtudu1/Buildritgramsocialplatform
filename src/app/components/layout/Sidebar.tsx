import { NavLink, useNavigate } from 'react-router';
import {
  Home, Compass, Bell, MessageCircle, User, Search,
  PlusSquare, Zap, Settings, LogOut, Sun, Moon, Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { CreateRitModal } from '../rit/CreateRitModal';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export function Sidebar() {
  const { unreadNotifications, unreadMessages, isDarkMode, toggleDarkMode } = useApp();
  const { user, isAdmin, logout } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { to: '/', icon: <Home size={22} />, label: 'Home' },
    { to: '/explore', icon: <Compass size={22} />, label: 'Explore' },
    { to: '/notifications', icon: <Bell size={22} />, label: 'Notifications', badge: unreadNotifications },
    { to: '/messages', icon: <MessageCircle size={22} />, label: 'Rit-Chat', badge: unreadMessages },
    { to: '/search', icon: <Search size={22} />, label: 'Search' },
    { to: `/profile/${user?.username || 'alexmorgan'}`, icon: <User size={22} />, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r"
        style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--rg-border)' }}>

        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="text-xl tracking-tight" style={{ fontWeight: 700, color: 'var(--rg-text)' }}>
            Rit<span style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gram</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                  isActive ? 'text-white' : 'hover:opacity-80'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: '#fff' }
                : { color: 'var(--rg-text-muted)' }
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center"
                      style={{ background: '#EC4899', fontSize: '10px' }}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Create Rit Button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setShowCreate(true)}
            className="w-full py-2.5 rounded-xl text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', fontWeight: 600 }}
          >
            <PlusSquare size={18} />
            Create Rit
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-3" style={{ height: 1, background: 'var(--rg-border)' }} />

        {/* Bottom actions */}
        <div className="px-3 pb-3 space-y-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
            style={{ color: 'var(--rg-text-muted)' }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
            style={{ color: 'var(--rg-text-muted)' }}
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
              style={{ color: '#8B5CF6' }}
            >
              <Shield size={20} />
              <span className="text-sm" style={{ fontWeight: 600 }}>Admin Panel</span>
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80"
            style={{ color: 'var(--rg-text-muted)' }}
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>

        {/* User info */}
        <div className="mx-3 mb-4 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-all"
          style={{ background: 'var(--rg-surface)' }}
          onClick={() => navigate(`/profile/${user?.username || 'alexmorgan'}`)}
        >
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2"
              style={{ ringColor: '#8B5CF6' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ fontWeight: 600, color: 'var(--rg-text)' }}>
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--rg-text-muted)' }}>
                @{user?.username || 'guest'}
              </p>
            </div>
            {isAdmin && (
              <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                Admin
              </span>
            )}
          </div>
        </div>
      </aside>

      {showCreate && <CreateRitModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
