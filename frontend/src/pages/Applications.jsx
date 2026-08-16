import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getApplications, deleteApplication } from '../services/applicationService';
import KanbanBoard from '../components/applications/KanbanBoard';
import ApplicationTable from '../components/applications/ApplicationTable';
import ApplicationModal from '../components/applications/ApplicationModal';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { KanbanCardSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Briefcase,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export const Applications = () => {
  const { refreshTrigger, triggerRefresh, openAddModal } = useOutletContext() || {};
  const toast = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI view state: 'kanban' | 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workTypeFilter, setWorkTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [editApp, setEditApp] = useState(null);
  const [deleteAppTarget, setDeleteAppTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplications();
      setApplications(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Something went wrong while loading your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [refreshTrigger]);

  // Instantaneous client-side search, filtering, and sorting
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          !searchTerm.trim() ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
          statusFilter === 'ALL' || (app.status || 'APPLIED').toUpperCase() === statusFilter;

        const matchesWorkType =
          workTypeFilter === 'ALL' || app.work_type === workTypeFilter;

        return matchesSearch && matchesStatus && matchesWorkType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || b.date_applied || 0) - new Date(a.created_at || a.date_applied || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at || a.date_applied || 0) - new Date(b.created_at || b.date_applied || 0);
        }
        if (sortBy === 'company_asc') {
          return a.company.localeCompare(b.company);
        }
        if (sortBy === 'company_desc') {
          return b.company.localeCompare(a.company);
        }
        return 0;
      });
  }, [applications, searchTerm, statusFilter, workTypeFilter, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!deleteAppTarget) return;
    setDeleting(true);
    try {
      await deleteApplication(deleteAppTarget.id);
      toast.success('Application deleted.');
      setDeleteAppTarget(null);
      fetchApps();
      if (triggerRefresh) triggerRefresh();
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Unable to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">Track every opportunity in one place.</p>
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

      {/* Search, Filter, Sort, and View Controls */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search company, role, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="WISHLIST">Wishlist</option>
          <option value="APPLIED">Applied</option>
          <option value="SCREENING">Screening</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          className="filter-select"
          value={workTypeFilter}
          onChange={(e) => setWorkTypeFilter(e.target.value)}
        >
          <option value="ALL">All Work Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="company_asc">Company (A-Z)</option>
          <option value="company_desc">Company (Z-A)</option>
        </select>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Kanban Board"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <KanbanCardSkeleton />
          <KanbanCardSkeleton />
          <KanbanCardSkeleton />
          <KanbanCardSkeleton />
        </div>
      ) : !filteredApplications.length ? (
        <EmptyState
          icon={Briefcase}
          title={applications.length === 0 ? 'Your job search starts here.' : 'No matching applications'}
          description={
            applications.length === 0
              ? 'Add your first application to start tracking your opportunities.'
              : 'No applications match your current filters. Try clearing search filters.'
          }
          actionLabel={applications.length === 0 ? 'Add Application' : undefined}
          onAction={applications.length === 0 ? openAddModal : undefined}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApplications}
          onEdit={(app) => setEditApp(app)}
          onDelete={(app) => setDeleteAppTarget(app)}
          onStatusChange={fetchApps}
        />
      ) : (
        <ApplicationTable
          applications={filteredApplications}
          onEdit={(app) => setEditApp(app)}
          onDelete={(app) => setDeleteAppTarget(app)}
        />
      )}

      {/* Edit Modal */}
      {editApp && (
        <ApplicationModal
          isOpen={Boolean(editApp)}
          initialData={editApp}
          onClose={() => setEditApp(null)}
          onSuccess={() => {
            fetchApps();
            if (triggerRefresh) triggerRefresh();
          }}
        />
      )}

      {/* Delete Confirmation Modal (Section 19) */}
      <Modal
        isOpen={Boolean(deleteAppTarget)}
        onClose={() => setDeleteAppTarget(null)}
        title="Delete Application"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-rejected)', marginBottom: '1rem' }}>
            <AlertTriangle size={24} />
            <h4 style={{ fontWeight: 700 }}>Delete this application?</h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Are you sure you want to delete your application for <strong>{deleteAppTarget?.role}</strong> at <strong>{deleteAppTarget?.company}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDeleteAppTarget(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Applications;
