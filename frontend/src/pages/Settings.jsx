import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { User, Sun, Moon, Server, CheckCircle2, XCircle } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get('/api/applications/');
        setBackendStatus('connected');
      } catch (err) {
        if (err.response) {
          // Even a 401 response means backend is live & connected!
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      }
    };
    checkBackend();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage preferences and system connectivity.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        {/* Profile Card */}
        <div className="pipeline-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <User size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="section-title" style={{ marginBottom: 0 }}>Account Information</h3>
          </div>
          <div className="user-profile-badge" style={{ padding: '1rem' }}>
            <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.username || 'Authenticated User'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Active JWT Session
              </span>
            </div>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="pipeline-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            {theme === 'dark' ? <Moon size={20} style={{ color: 'var(--accent-primary)' }} /> : <Sun size={20} style={{ color: 'var(--accent-primary)' }} />}
            <h3 className="section-title" style={{ marginBottom: 0 }}>Appearance</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Theme Preference</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Current theme is set to <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>
              </div>
            </div>
            <button className="btn-secondary" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>

        {/* Backend API Connection Status */}
        <div className="pipeline-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Server size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="section-title" style={{ marginBottom: 0 }}>Django API Connectivity</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Endpoint</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>http://127.0.0.1:8000/api/</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              {backendStatus === 'connected' ? (
                <span style={{ color: 'var(--status-offer)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={18} />
                  Connected
                </span>
              ) : backendStatus === 'disconnected' ? (
                <span style={{ color: 'var(--status-rejected)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <XCircle size={18} />
                  Offline
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Checking...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
