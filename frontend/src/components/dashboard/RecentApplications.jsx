import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../applications/StatusBadge';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

export const RecentApplications = ({ applications }) => {
  const navigate = useNavigate();
  const recent = applications.slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pipeline-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="section-title" style={{ marginBottom: 0 }}>Recent Applications</h3>
        <button
          type="button"
          className="btn-secondary"
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
          onClick={() => navigate('/applications')}
        >
          <span>View all applications</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {!recent.length ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No applications added yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recent.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              className="recent-app-item"
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {app.role}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                  <span style={{ fontWeight: 600 }}>{app.company}</span>
                  {app.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} />
                      {app.location}
                    </span>
                  )}
                  {app.date_applied && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      {formatDate(app.date_applied)}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
