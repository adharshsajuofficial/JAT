import React from 'react';
import KanbanColumn from './KanbanColumn';
import { updateApplication } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

const KANBAN_COLUMNS = [
  { key: 'WISHLIST', label: 'Wishlist' },
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SCREENING', label: 'Screening' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'OFFER', label: 'Offer' },
  { key: 'REJECTED', label: 'Rejected' },
];

export const KanbanBoard = ({ applications, onEdit, onDelete, onStatusChange }) => {
  const toast = useToast();

  const handleDropCard = async (appId, newStatus) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp || targetApp.status === newStatus) return;

    try {
      await updateApplication(appId, { status: newStatus });
      toast.success(`Status updated to ${newStatus.toLowerCase()}.`);

      if (newStatus === 'OFFER') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Unable to update application status.');
    }
  };

  return (
    <div className="kanban-board">
      {KANBAN_COLUMNS.map((col) => {
        const colApps = applications.filter(
          (app) => (app.status || 'APPLIED').toUpperCase() === col.key
        );
        return (
          <KanbanColumn
            key={col.key}
            statusKey={col.key}
            statusLabel={col.label}
            applications={colApps}
            onEdit={onEdit}
            onDelete={onDelete}
            onDropCard={handleDropCard}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;
