import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PlusCircle, MessageSquare, Shield, Clock, Send, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, User } from 'lucide-react';

export default function EmployeeDashboard({ defaultTab = 'dashboard' }) {
  const { user } = useAuth();

  const [feedbacks, setFeedbacks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Submit Modal state
  const [isModalOpen, setIsModalOpen] = useState(defaultTab === 'submit');
  const [submitting, setSubmitting] = useState(false);
  const [department, setDepartment] = useState(user?.department || 'Engineering');
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Selected feedback for inspection
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedbacksData, profileData] = await Promise.all([
        api.getMyFeedback(),
        api.getMyProfile(),
      ]);
      setFeedbacks(feedbacksData || []);
      setProfile(profileData || null);
    } catch (err) {
      console.error('Error fetching employee dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      const res = await api.submitFeedback({ department, text, anonymous });
      setSubmitSuccess('Your feedback has been analyzed and securely submitted!');
      setText('');
      setAnonymous(false);
      fetchData();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess('');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <span className="badge badge-positive">Positive</span>;
      case 'NEGATIVE':
        return <span className="badge badge-negative">Negative</span>;
      default:
        return <span className="badge badge-neutral">Neutral</span>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <span className="badge badge-urgency-critical">Critical</span>;
      case 'HIGH':
        return <span className="badge badge-urgency-high">High</span>;
      case 'MEDIUM':
        return <span className="badge badge-urgency-medium">Medium</span>;
      default:
        return <span className="badge badge-urgency-low">Low</span>;
    }
  };

  return (
    <div>
      {/* Header welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        borderRadius: 16,
        padding: '32px 36px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
      }}>
        <div>
          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 600 }}>
            Employee Workspace
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4 }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: 6, maxWidth: 540 }}>
            Your feedback helps improve our workplace culture, processes, and leadership. All submissions are processed securely with AI insights.
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.95rem', background: '#2563eb' }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} />
          Submit Feedback
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4">
        <div className="metric-card">
          <div>
            <div className="metric-title">My Total Submissions</div>
            <div className="metric-value">{feedbacks.length}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Department</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{user?.department}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <User size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Anonymous Submissions</div>
            <div className="metric-value">
              {feedbacks.filter(f => f.anonymous).length}
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Shield size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Privacy Level</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>End-to-End</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Feedback History Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>My Feedback History</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>A private record of your workplace feedback and AI analysis</p>
          </div>
          <button className="btn btn-secondary" onClick={fetchData} style={{ fontSize: '0.85rem' }}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Loading your feedback history...</div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MessageSquare size={28} />
            </div>
            <div className="empty-state-title">No feedback submitted yet</div>
            <div className="empty-state-desc">
              Share your thoughts, suggestions, or concerns regarding your team or organizational processes.
            </div>
            <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => setIsModalOpen(true)}>
              <PlusCircle size={16} /> Submit Your First Feedback
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Feedback Preview</th>
                  <th>Topic</th>
                  <th>Sentiment</th>
                  <th>Urgency</th>
                  <th>Privacy</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.85rem' }}>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{f.department}</span></td>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.text}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: 4 }}>
                        {f.topic || 'General'}
                      </span>
                    </td>
                    <td>{getSentimentBadge(f.sentiment)}</td>
                    <td>{getUrgencyBadge(f.urgency)}</td>
                    <td>
                      {f.anonymous ? (
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                          <EyeOff size={13} /> Anonymous
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                          <Eye size={13} /> Identified
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => setSelectedFeedback(f)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Submit Workplace Feedback</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Provide candid input to help HR and management improve workplace experience</p>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {submitSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitFeedback}>
              <div className="form-group">
                <label className="form-label">Relevant Department</label>
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product">Product Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales & Business Dev</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Operations">Operations & Legal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Feedback / Workplace Concern</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share details about your experience, suggestions, workload, management, or environment... (Minimum 10 characters)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={5}
                />
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '14px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Shield size={20} color="#3b82f6" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Submit Anonymously</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>HR and leadership will not see your name or profile identifier</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Analyzing & Submitting...' : 'Submit Feedback'}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Detail Inspector Modal */}
      {selectedFeedback && (
        <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Feedback Details & AI Analysis</h3>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setSelectedFeedback(null)}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Your Original Submission
              </label>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, marginTop: 6, fontSize: '0.92rem', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                "{selectedFeedback.text}"
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Sentiment</span>
                <div style={{ marginTop: 4 }}>{getSentimentBadge(selectedFeedback.sentiment)}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Emotion</span>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: '0.9rem' }}>{selectedFeedback.emotion || 'Neutral'}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Urgency</span>
                <div style={{ marginTop: 4 }}>{getUrgencyBadge(selectedFeedback.urgency)}</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                AI Executive Summary
              </span>
              <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#334155', background: '#eff6ff', padding: 12, borderRadius: 8, border: '1px solid #bfdbfe' }}>
                {selectedFeedback.summary || 'Summary unavailable'}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                AI Recommendation for HR
              </span>
              <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#334155', background: '#ecfdf5', padding: 12, borderRadius: 8, border: '1px solid #a7f3d0' }}>
                {selectedFeedback.recommendation || 'Recommendation pending'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedFeedback(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
