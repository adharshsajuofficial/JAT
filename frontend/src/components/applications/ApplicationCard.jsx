import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink, Eye, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const ApplicationCard = ({ application, onEdit, onDelete, onDragStart }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Avoid navigation if clicking action buttons or links
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/applications/${application.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, application)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick(e);
      }}
    >
      <div className="card-header">
        <span className="card-company">{application.company}</span>
        <StatusBadge status={application.status} />
      </div>

      <h4 className="card-role">{application.role}</h4>

      <div className="card-meta">
        {application.location && (
          <div className="card-meta-item">
            <MapPin size={12} />
            <span>{application.location}</span>
          </div>
        )}
        {application.date_applied && (
          <div className="card-meta-item">
            <Calendar size={12} />
            <span>Applied {formatDate(application.date_applied)}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {application.job_url && (
          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="Open job link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        )}
        <button
          type="button"
          className="btn-icon"
          title="View details"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/applications/${application.id}`);
          }}
        >
          <Eye size={14} />
        </button>
        <button
          type="button"
          className="btn-icon"
          title="Edit application"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(application);
          }}
        >
          <Edit2 size={14} />
        </button>
        <button
          type="button"
          className="btn-icon"
          title="Delete application"
          style={{ color: 'var(--status-rejected)' }}
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(application);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
