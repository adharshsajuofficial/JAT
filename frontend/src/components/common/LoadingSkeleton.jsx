import React from 'react';

export const CardSkeleton = () => (
  <div className="stat-card" style={{ height: '90px' }}>
    <div style={{ flex: 1 }}>
      <div className="skeleton" style={{ width: '40%', height: '14px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '60%', height: '24px' }} />
    </div>
    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '10px' }} />
  </div>
);

export const KanbanCardSkeleton = () => (
  <div className="kanban-card" style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div>
      <div className="skeleton" style={{ width: '50%', height: '12px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '80%', height: '16px', marginBottom: '12px' }} />
    </div>
    <div className="skeleton" style={{ width: '40%', height: '14px' }} />
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td colSpan={7} style={{ padding: '1rem' }}>
      <div className="skeleton" style={{ width: '100%', height: '20px' }} />
    </td>
  </tr>
);

export default CardSkeleton;
