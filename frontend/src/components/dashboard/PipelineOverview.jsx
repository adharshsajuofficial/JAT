import React from 'react';
import StatusBadge from '../applications/StatusBadge';

const PIPELINE_STAGES = [
  { key: 'WISHLIST', label: 'Wishlist' },
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SCREENING', label: 'Screening' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'OFFER', label: 'Offer' },
  { key: 'REJECTED', label: 'Rejected' },
];

export const PipelineOverview = ({ applications }) => {
  const total = applications.length || 1;

  const counts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.key] = applications.filter(
      (app) => (app.status || 'APPLIED').toUpperCase() === stage.key
    ).length;
    return acc;
  }, {});

  return (
    <div className="pipeline-section">
      <h3 className="section-title">Application Pipeline</h3>
      <div className="pipeline-bars">
        {PIPELINE_STAGES.map((stage) => {
          const count = counts[stage.key] || 0;
          const percentage = Math.round((count / total) * 100);

          return (
            <div key={stage.key} className="pipeline-item">
              <StatusBadge status={stage.key} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {count}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {percentage}%
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--bg-badge)',
                  overflow: 'hidden',
                  marginTop: '0.25rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: `var(--status-${stage.key.toLowerCase()})`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineOverview;
