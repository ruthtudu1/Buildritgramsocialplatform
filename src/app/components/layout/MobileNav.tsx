import { NavLink } from 'react-router';
import { Home, Compass, Bell, MessageCircle, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export function MobileNav() {
  const { unreadNotifications, unreadMessages } = useApp();
  const { user } = useAuth();

  const items = [
    { to: '/', icon: <Home size={22} />, end: true },
    { to: '/explore', icon: <Compass size={22} /> },
    { to: '/notifications', icon: <Bell size={22} />, badge: unreadNotifications },
    { to: '/messages', icon: <MessageCircle size={22} />, badge: unreadMessages },
    { to: `/profile/${user?.username || 'alexmorgan'}`, icon: <User size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t lg:hidden"
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--rg-border)' }}>
      {items.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `relative p-2.5 rounded-xl transition-all duration-200 ${isActive ? '' : 'opacity-50'}`
          }
          style={({ isActive }) => isActive
            ? { color: '#8B5CF6' }
            : { color: 'var(--rg-text-muted)' }
          }
        >
          {item.icon}
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: '#EC4899', fontSize: '9px', fontWeight: 700 }}>
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}