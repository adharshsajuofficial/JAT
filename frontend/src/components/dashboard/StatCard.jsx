import React from 'react';

export const StatCard = ({ label, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor, color }}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
