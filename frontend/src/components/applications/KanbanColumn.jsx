import React, { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import StatusBadge from './StatusBadge';

export const KanbanColumn = ({
  statusKey,
  statusLabel,
  applications,
  onEdit,
  onDelete,
  onDropCard,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const appId = e.dataTransfer.getData('applicationId');
    if (appId && onDropCard) {
      onDropCard(Number(appId), statusKey);
    }
  };

  const handleDragStart = (e, app) => {
    e.dataTransfer.setData('applicationId', app.id);
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        borderColor: isDragOver ? 'var(--accent-primary)' : 'var(--border-color)',
        backgroundColor: isDragOver ? 'var(--accent-light)' : 'var(--bg-badge)',
      }}
    >
      <div className="column-header">
        <div className="column-title-group">
          <StatusBadge status={statusKey} />
        </div>
        <span className="column-count">{applications.length}</span>
      </div>

      <div className="cards-container">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
