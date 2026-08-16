import React from 'react';
import {
  Bookmark,
  Send,
  Search,
  Calendar,
  Award,
  XCircle,
} from 'lucide-react';

const STATUS_CONFIG = {
  WISHLIST: { label: 'Wishlist', icon: Bookmark },
  APPLIED: { label: 'Applied', icon: Send },
  SCREENING: { label: 'Screening', icon: Search },
  INTERVIEW: { label: 'Interview', icon: Calendar },
  OFFER: { label: 'Offer', icon: Award },
  REJECTED: { label: 'Rejected', icon: XCircle },
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'APPLIED').toUpperCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.APPLIED;
  const Icon = config.icon;

  return (
    <span className={`status-badge status-badge-${normalized}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
