import React from 'react';
import EmptyState from '../components/common/EmptyState';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export const CalendarPage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Manage interviews, deadlines, and follow-ups.</p>
        </div>
      </div>

      <div className="pipeline-section" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <EmptyState
          icon={CalendarIcon}
          title="No interviews scheduled yet."
          description="Your scheduled interviews and follow-up deadlines will appear here once connected to the backend events schedule."
        />
      </div>
    </div>
  );
};

export default CalendarPage;
