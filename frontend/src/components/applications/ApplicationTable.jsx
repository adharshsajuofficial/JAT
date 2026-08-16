import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Eye, Edit2, Trash2, ExternalLink } from 'lucide-react';

export const ApplicationTable = ({ applications, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Location</th>
            <th>Work Type</th>
            <th>Date Applied</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td style={{ fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{app.company}</span>
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      style={{ padding: '2px' }}
                      title="Job Link"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>{app.role}</td>
              <td>
                <StatusBadge status={app.status} />
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{app.location || '—'}</td>
              <td style={{ color: 'var(--text-muted)' }}>{app.work_type || '—'}</td>
              <td style={{ color: 'var(--text-muted)' }}>{formatDate(app.date_applied)}</td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                  <button
                    type="button"
                    className="btn-icon"
                    title="View details"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    title="Edit application"
                    onClick={() => onEdit(app)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    title="Delete application"
                    style={{ color: 'var(--status-rejected)' }}
                    onClick={() => onDelete(app)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
