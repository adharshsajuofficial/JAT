import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Calendar as CalendarIcon,
  Settings,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/applications', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  ];

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="sidebar-header">
            <NavLink to="/dashboard" className="logo-link" onClick={() => setMobileOpen(false)}>
              <div className="logo-icon">
                <Sparkles size={20} />
              </div>
              <span>CareerFlow</span>
            </NavLink>
            <button
              className="btn-icon mobile-only"
              onClick={() => setMobileOpen(false)}
              style={{ display: mobileOpen ? 'flex' : 'none' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav>
            <ul className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="user-profile-badge">
            <div className="avatar">{getInitial(user?.username)}</div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'User'}</span>
            </div>
          </div>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>

          <button type="button" className="nav-item" onClick={toggleTheme} style={{ width: '100%' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button type="button" className="nav-item" onClick={handleLogout} style={{ width: '100%', color: 'var(--status-rejected)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
