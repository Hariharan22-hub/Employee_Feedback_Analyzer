import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Filter, Sparkles, Eye, Shield, AlertTriangle, ArrowUpDown, RefreshCw, X } from 'lucide-react';

export default function HRFeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [department, setDepartment] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [urgency, setUrgency] = useState('');
  const [topic, setTopic] = useState('');
  const [search, setSearch] = useState('');

  // Selected feedback modal
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.getOrganizationalFeedback({
        department,
        sentiment,
        urgency,
        topic,
        search,
      });
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error fetching feedbacks for HR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [department, sentiment, urgency, topic]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFeedbacks();
  };

  const resetFilters = () => {
    setDepartment('');
    setSentiment('');
    setUrgency('');
    setTopic('');
    setSearch('');
  };

  const getSentimentBadge = (sent) => {
    switch (sent) {
      case 'POSITIVE':
        return <span className="badge badge-positive">Positive</span>;
      case 'NEGATIVE':
        return <span className="badge badge-negative">Negative</span>;
      default:
        return <span className="badge badge-neutral">Neutral</span>;
    }
  };

  const getUrgencyBadge = (urg) => {
    switch (urg) {
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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Organizational Feedback Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: 2 }}>
            Review, search, filter, and inspect AI-analyzed employee submissions across all company departments.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchFeedbacks} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: 18 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Search Row */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="Search feedback text, summary, topic, or key concern..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
              Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          {/* Filter Selects Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Department</label>
              <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product">Product Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales & Business Dev</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Operations">Operations & Legal</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Sentiment</label>
              <select className="form-select" value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
                <option value="">All Sentiments</option>
                <option value="POSITIVE">Positive</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="NEGATIVE">Negative</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Urgency</label>
              <select className="form-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="">All Urgencies</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Topic</label>
              <select className="form-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="">All Topics</option>
                <option value="Workload">Workload</option>
                <option value="Management">Management</option>
                <option value="Compensation">Compensation</option>
                <option value="Work Environment">Work Environment</option>
                <option value="Career Growth">Career Growth</option>
                <option value="Team Collaboration">Team Collaboration</option>
                <option value="Communication">Communication</option>
                <option value="Leave">Leave</option>
                <option value="Benefits">Benefits</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Feedbacks Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Feedback Submissions ({feedbacks.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Loading feedback entries...</div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Filter size={24} />
            </div>
            <div className="empty-state-title">No matching feedback found</div>
            <div className="empty-state-desc">
              Try adjusting your search criteria or resetting filters to view all submissions.
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Topic</th>
                  <th>Sentiment</th>
                  <th>Urgency</th>
                  <th>AI Summary Preview</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.85rem' }}>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: f.anonymous ? '#64748b' : '#0f172a' }}>
                        {f.employeeName || (f.anonymous ? 'Anonymous Employee' : 'Employee')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{f.department}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: 4 }}>
                        {f.topic || 'General'}
                      </span>
                    </td>
                    <td>{getSentimentBadge(f.sentiment)}</td>
                    <td>{getUrgencyBadge(f.urgency)}</td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.86rem' }}>
                        {f.summary || f.text}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
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

      {/* Comprehensive Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="modal-content" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Feedback Assessment & AI Diagnostics</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Submission ID #{selectedFeedback.id} • {selectedFeedback.department} • {selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setSelectedFeedback(null)}
              >
                &times;
              </button>
            </div>

            {/* Submitter Info Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, marginBottom: 20, border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Employee Identity</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {selectedFeedback.employeeName || (selectedFeedback.anonymous ? 'Anonymous Employee' : 'Employee')}
                </div>
              </div>
              <div>
                {selectedFeedback.anonymous ? (
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                    <Shield size={13} /> Protected Anonymity
                  </span>
                ) : (
                  <span className="badge badge-positive">Identified Submitter</span>
                )}
              </div>
            </div>

            {/* Original Feedback */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                Original Employee Feedback
              </label>
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 8, marginTop: 6, fontSize: '0.95rem', border: '1px solid #cbd5e1', lineHeight: 1.6, color: '#0f172a' }}>
                "{selectedFeedback.text}"
              </div>
            </div>

            {/* Structured AI Attributes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Sentiment</span>
                <div style={{ marginTop: 4 }}>{getSentimentBadge(selectedFeedback.sentiment)}</div>
                {selectedFeedback.sentimentScore !== null && selectedFeedback.sentimentScore !== undefined && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Score: {selectedFeedback.sentimentScore}</div>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Emotion</span>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '0.9rem' }}>{selectedFeedback.emotion || 'Neutral'}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Intent</span>
                <div style={{ marginTop: 4, fontWeight: 700, fontSize: '0.9rem' }}>{selectedFeedback.intent || 'General'}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Urgency</span>
                <div style={{ marginTop: 4 }}>{getUrgencyBadge(selectedFeedback.urgency)}</div>
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#1e40af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> AI Executive Summary
              </span>
              <div style={{ marginTop: 6, fontSize: '0.92rem', color: '#1e293b', background: '#eff6ff', padding: 14, borderRadius: 8, border: '1px solid #bfdbfe', lineHeight: 1.5 }}>
                {selectedFeedback.summary || 'Summary unavailable.'}
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> AI Actionable Recommendation for HR
              </span>
              <div style={{ marginTop: 6, fontSize: '0.92rem', color: '#065f46', background: '#ecfdf5', padding: 14, borderRadius: 8, border: '1px solid #a7f3d0', lineHeight: 1.5, fontWeight: 500 }}>
                {selectedFeedback.recommendation || 'Recommendation pending.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedFeedback(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
