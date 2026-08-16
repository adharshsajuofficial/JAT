import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../services/applicationService';
import StatCard from '../components/dashboard/StatCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentApplications from '../components/dashboard/RecentApplications';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  Briefcase,
  Calendar,
  Award,
  XCircle,
  Clock,
  Plus,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshTrigger, openAddModal } = useOutletContext() || {};

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplications();
      setApplications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching applications for dashboard:', err);
      setError('Something went wrong while loading your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [refreshTrigger]);

  // Derive stats dynamically from Django API responses
  const totalApps = applications.length;
  const interviewsCount = applications.filter(
    (a) => (a.status || '').toUpperCase() === 'INTERVIEW'
  ).length;
  const offersCount = applications.filter(
    (a) => (a.status || '').toUpperCase() === 'OFFER'
  ).length;
  const rejectionsCount = applications.filter(
    (a) => (a.status || '').toUpperCase() === 'REJECTED'
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, {user?.username || 'Job Hunter'}</h1>
          <p className="page-subtitle">Here's what's happening with your job search.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Application</span>
        </button>
      </div>

      {error && (
        <div className="auth-notice" style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Top Statistic Cards */}
      <div className="stats-grid">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Applications"
              value={totalApps}
              icon={Briefcase}
              color="var(--accent-primary)"
              bgColor="var(--accent-light)"
            />
            <StatCard
              label="Interviews"
              value={interviewsCount}
              icon={Calendar}
              color="var(--status-interview)"
              bgColor="var(--status-interview-bg)"
            />
            <StatCard
              label="Offers"
              value={offersCount}
              icon={Award}
              color="var(--status-offer)"
              bgColor="var(--status-offer-bg)"
            />
            <StatCard
              label="Rejections"
              value={rejectionsCount}
              icon={XCircle}
              color="var(--status-rejected)"
              bgColor="var(--status-rejected-bg)"
            />
          </>
        )}
      </div>

      {/* Pipeline Overview */}
      <PipelineOverview applications={applications} />

      {/* Grid for Recent Applications and Upcoming Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <RecentApplications applications={applications} />

        <div className="pipeline-section">
          <h3 className="section-title">Upcoming Activity</h3>
          <EmptyState
            icon={Clock}
            title="No upcoming events"
            description="Interviews, follow-ups, and application deadlines will appear here once scheduled."
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
