import React, { useState, useEffect, useMemo } from 'react';
import { getApplications } from '../services/applicationService';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  BarChart3,
  Calendar,
  Award,
  XCircle,
  TrendingUp,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

const STATUS_COLORS = {
  WISHLIST: '#8b5cf6',
  APPLIED: '#3b82f6',
  SCREENING: '#06b6d4',
  INTERVIEW: '#f59e0b',
  OFFER: '#10b981',
  REJECTED: '#ef4444',
};

export const Analytics = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const data = await getApplications();
        setApplications(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Unable to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // Calculate real rates from API data
  const total = applications.length;
  const interviewsCount = applications.filter((a) => (a.status || '').toUpperCase() === 'INTERVIEW').length;
  const offersCount = applications.filter((a) => (a.status || '').toUpperCase() === 'OFFER').length;
  const rejectionsCount = applications.filter((a) => (a.status || '').toUpperCase() === 'REJECTED').length;

  const interviewRate = total ? Math.round((interviewsCount / total) * 100) : 0;
  const offerRate = total ? Math.round((offersCount / total) * 100) : 0;
  const rejectionRate = total ? Math.round((rejectionsCount / total) * 100) : 0;

  // Chart 1: Applications by Status
  const statusData = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      const st = (a.status || 'APPLIED').toUpperCase();
      counts[st] = (counts[st] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key.charAt(0) + key.slice(1).toLowerCase(),
      value: counts[key],
      color: STATUS_COLORS[key] || '#6366f1',
    }));
  }, [applications]);

  // Chart 2: Applications Over Time
  const timeData = useMemo(() => {
    const timeline = {};
    applications.forEach((a) => {
      const dateStr = a.date_applied || a.created_at;
      if (dateStr) {
        const monthYear = new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        timeline[monthYear] = (timeline[monthYear] || 0) + 1;
      }
    });
    return Object.keys(timeline).map((key) => ({
      month: key,
      applications: timeline[key],
    }));
  }, [applications]);

  // Chart 3: Work Type Distribution
  const workTypeData = useMemo(() => {
    const types = {};
    applications.forEach((a) => {
      const wt = a.work_type || 'Unspecified';
      types[wt] = (types[wt] || 0) + 1;
    });
    return Object.keys(types).map((key) => ({
      name: key,
      count: types[key],
    }));
  }, [applications]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Real-time insights on your job search performance.</p>
        </div>
      </div>

      {error && (
        <div className="auth-notice" style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Real Statistics */}
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
              label="Total Applications"
              value={total}
              icon={TrendingUp}
              color="var(--accent-primary)"
              bgColor="var(--accent-light)"
            />
            <StatCard
              label="Interview Rate"
              value={`${interviewRate}%`}
              icon={Calendar}
              color="var(--status-interview)"
              bgColor="var(--status-interview-bg)"
            />
            <StatCard
              label="Offer Rate"
              value={`${offerRate}%`}
              icon={Award}
              color="var(--status-offer)"
              bgColor="var(--status-offer-bg)"
            />
            <StatCard
              label="Rejection Rate"
              value={`${rejectionRate}%`}
              icon={XCircle}
              color="var(--status-rejected)"
              bgColor="var(--status-rejected-bg)"
            />
          </>
        )}
      </div>

      {!loading && total === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics data available"
          description="Add job applications to start visualizing your application progress, conversion rates, and monthly trends."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Applications by Status Donut Chart */}
          <div className="pipeline-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <PieChartIcon size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 className="section-title" style={{ marginBottom: 0 }}>Applications by Status</h3>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applications Over Time Area Chart */}
          <div className="pipeline-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--status-offer)' }} />
              <h3 className="section-title" style={{ marginBottom: 0 }}>Applications Over Time</h3>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer>
                <AreaChart data={timeData.length ? timeData : [{ month: 'Current', applications: total }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="var(--accent-primary)" fill="var(--accent-glow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Work Type Distribution Bar Chart */}
          <div className="pipeline-section full-width">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart3 size={18} style={{ color: 'var(--status-interview)' }} />
              <h3 className="section-title" style={{ marginBottom: 0 }}>Work Type Breakdown</h3>
            </div>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer>
                <BarChart data={workTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                  <Bar dataKey="count" fill="var(--accent-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
