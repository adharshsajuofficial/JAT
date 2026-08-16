import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenMobile, onOpenAddModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/applications/')) return 'Application Details';
    if (path.startsWith('/applications')) return 'Applications';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/settings')) return 'Settings';
    return 'CareerFlow';
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn-icon"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          style={{ display: 'flex' }}
        >
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{getPageTitle(location.pathname)}</h1>
      </div>

      <div className="navbar-actions">
        {onOpenAddModal && (
          <button className="btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add Application</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
