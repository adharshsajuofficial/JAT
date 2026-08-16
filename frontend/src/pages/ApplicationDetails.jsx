import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplication, updateApplication, deleteApplication } from '../services/applicationService';
import StatusBadge from '../components/applications/StatusBadge';
import ApplicationModal from '../components/applications/ApplicationModal';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const TIMELINE_STAGES = ['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'];

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplication(id);
      setApplication(data);
    } catch (err) {
      console.error('Error fetching application detail:', err);
      setError('Unable to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!application || application.status === newStatus) return;
    try {
      const updated = await updateApplication(application.id, { status: newStatus });
      setApplication(updated);
      toast.success(`Status changed to ${newStatus.toLowerCase()}.`);

      if (newStatus === 'OFFER') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    } catch (err) {
      console.error('Failed to change status:', err);
      toast.error('Unable to update application status.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteApplication(application.id);
      toast.success('Application deleted successfully.');
      navigate('/applications');
    } catch (err) {
      console.error('Failed to delete application:', err);
      toast.error('Unable to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="full-screen-loading" style={{ minHeight: '400px', background: 'transparent' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <button className="btn-secondary" onClick={() => navigate('/applications')} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Applications</span>
        </button>
        <div className="auth-notice" style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)' }}>
          {error || 'Application not found.'}
        </div>
      </div>
    );
  }

  const currentStatusIndex = TIMELINE_STAGES.indexOf((application.status || '').toUpperCase());
  const isRejected = (application.status || '').toUpperCase() === 'REJECTED';

  return (
    <div>
      <button className="btn-secondary" onClick={() => navigate('/applications')} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Applications</span>
      </button>

      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {application.company}
            </span>
            <StatusBadge status={application.status} />
          </div>
          <h1 className="page-title">{application.role}</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => setIsEditOpen(true)}>
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button className="btn-danger" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Visual Status Timeline (Section 17) */}
      <div className="pipeline-section" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">Hiring Pipeline Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {TIMELINE_STAGES.map((stage, idx) => {
            const isCompleted = currentStatusIndex !== -1 && idx <= currentStatusIndex && !isRejected;
            const isCurrent = currentStatusIndex === idx && !isRejected;

            return (
              <React.Fragment key={stage}>
                <button
                  type="button"
                  onClick={() => handleStatusChange(stage)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent
                        ? 'var(--accent-primary)'
                        : isCompleted
                        ? 'var(--status-offer)'
                        : 'var(--bg-badge)',
                      color: isCurrent || isCompleted ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: isCurrent ? '3px solid var(--accent-light)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {stage}
                  </span>
                </button>
                {idx < TIMELINE_STAGES.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '3px',
                      minWidth: '20px',
                      backgroundColor: idx < currentStatusIndex && !isRejected ? 'var(--status-offer)' : 'var(--border-color)',
                      transition: 'all 0.2s ease',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
            <button
              type="button"
              className={`btn-secondary ${isRejected ? 'btn-danger' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              onClick={() => handleStatusChange('REJECTED')}
            >
              Mark Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="form-grid" style={{ gap: '1.5rem' }}>
        <div className="stat-card" style={{ gridColumn: 'span 1' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <MapPin size={20} />
          </div>
          <div className="stat-info" style={{ marginLeft: '1rem' }}>
            <span className="stat-label">Location</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{application.location || 'Not specified'}</span>
          </div>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 1' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-screening-bg)', color: 'var(--status-screening)' }}>
            <Briefcase size={20} />
          </div>
          <div className="stat-info" style={{ marginLeft: '1rem' }}>
            <span className="stat-label">Work Type</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{application.work_type || 'Not specified'}</span>
          </div>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 1' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-interview-bg)', color: 'var(--status-interview)' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-info" style={{ marginLeft: '1rem' }}>
            <span className="stat-label">Date Applied</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {application.date_applied ? new Date(application.date_applied).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
            </span>
          </div>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 1' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-offer-bg)', color: 'var(--status-offer)' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-info" style={{ marginLeft: '1rem' }}>
            <span className="stat-label">Salary / Compensation</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{application.salary || 'Not specified'}</span>
          </div>
        </div>

        {application.job_url && (
          <div className="pipeline-section full-width">
            <h3 className="section-title">Job Posting</h3>
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', width: 'fit-content' }}
            >
              <span>Visit Job Listing</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        <div className="pipeline-section full-width">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="section-title" style={{ marginBottom: 0 }}>Notes & Insights</h3>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {application.notes || 'No notes provided for this application yet. Click Edit to add recruiter details, interview prep, or notes.'}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <ApplicationModal
          isOpen={isEditOpen}
          initialData={application}
          onClose={() => setIsEditOpen(false)}
          onSuccess={fetchDetail}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Application">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-rejected)', marginBottom: '1rem' }}>
            <AlertTriangle size={24} />
            <h4 style={{ fontWeight: 700 }}>Delete this application?</h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            This action cannot be undone. Are you sure you want to permanently delete your application for <strong>{application.role}</strong> at <strong>{application.company}</strong>?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
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

export default ApplicationDetails;
