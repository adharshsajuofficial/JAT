import React, { useState } from 'react';
import { createApplication, updateApplication } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const STATUS_OPTIONS = [
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
];

const WORK_TYPES = [
  { value: '', label: 'Select Work Type' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'On-site', label: 'On-site' },
  { value: 'Internship', label: 'Internship' },
];

export const ApplicationForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = Boolean(initialData?.id);
  const toast = useToast();

  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    role: initialData?.role || '',
    status: initialData?.status || 'APPLIED',
    date_applied: initialData?.date_applied || new Date().toISOString().split('T')[0],
    job_url: initialData?.job_url || '',
    location: initialData?.location || '',
    work_type: initialData?.work_type || '',
    salary: initialData?.salary || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await updateApplication(initialData.id, formData);
        toast.success('Application updated successfully.');
      } else {
        await createApplication(formData);
        toast.success('Application added successfully.');

        // Trigger confetti celebration if status is OFFER
        if (formData.status === 'OFFER') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      const serverErr = err.response?.data;
      if (serverErr && typeof serverErr === 'object') {
        const fieldErrors = {};
        Object.keys(serverErr).forEach((key) => {
          if (Array.isArray(serverErr[key])) {
            fieldErrors[key] = serverErr[key].join(' ');
          } else if (typeof serverErr[key] === 'string') {
            fieldErrors[key] = serverErr[key];
          }
        });
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setApiError('Unable to save application. Please try again.');
        }
      } else {
        setApiError('Something went wrong while saving your application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {apiError && (
        <div className="auth-notice" style={{ background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', marginBottom: '1rem' }}>
          {apiError}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="company">
            Company *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="form-input"
            placeholder="e.g. Google, Stripe"
            value={formData.company}
            onChange={handleChange}
          />
          {errors.company && <span className="form-error">{errors.company}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="role">
            Role *
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className="form-input"
            placeholder="e.g. Software Engineer"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <span className="form-error">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date_applied">
            Date Applied
          </label>
          <input
            id="date_applied"
            name="date_applied"
            type="date"
            className="form-input"
            value={formData.date_applied}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="form-input"
            placeholder="e.g. San Francisco, CA / Remote"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="work_type">
            Work Type
          </label>
          <select
            id="work_type"
            name="work_type"
            className="form-select"
            value={formData.work_type}
            onChange={handleChange}
          >
            {WORK_TYPES.map((wt) => (
              <option key={wt.value} value={wt.value}>
                {wt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="salary">
            Salary / Compensation
          </label>
          <input
            id="salary"
            name="salary"
            type="text"
            className="form-input"
            placeholder="e.g. $140,000 - $160,000"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="job_url">
            Job Posting URL
          </label>
          <input
            id="job_url"
            name="job_url"
            type="url"
            className="form-input"
            placeholder="https://..."
            value={formData.job_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="form-textarea"
            placeholder="Interviews, recruiter contact info, prep notes..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modal-footer" style={{ padding: '1.25rem 0 0 0', marginTop: '1.25rem' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="spinner" size={16} />
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEditing ? 'Update Application' : 'Save Application'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
