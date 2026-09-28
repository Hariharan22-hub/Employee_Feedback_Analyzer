import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, MessageSquare, Sparkles, ArrowRight, ShieldCheck, RefreshCw, HelpCircle } from 'lucide-react';

export default function HRDashboard({ setActiveTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, feedbacksData] = await Promise.all([
        api.getAnalytics(),
        api.getOrganizationalFeedback({}),
      ]);
      setAnalytics(analyticsData);
      setRecentFeedbacks((feedbacksData || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to load HR dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = analytics?.totalFeedback || 0;
  const posCount = analytics?.positiveCount || 0;
  const negCount = analytics?.negativeCount || 0;
  const neutCount = analytics?.neutralCount || 0;
  const urgentCount = analytics?.urgentCount || 0;

  const posPct = total > 0 ? Math.round((posCount / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negCount / total) * 100) : 0;
  const neutPct = total > 0 ? Math.round((neutCount / total) * 100) : 0;

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
        color: 'white',
        borderRadius: 16,
        padding: '32px 36px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
      }}>
        <div>
          <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c7d2fe', fontWeight: 600 }}>
            HR Leadership & People Analytics
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4 }}>
            Organizational Insights & Feedback Hub
          </h1>
          <p style={{ color: '#e0e7ff', fontSize: '0.95rem', marginTop: 6, maxWidth: 600 }}>
            Real-time workplace sentiment analysis, proactive issue detection, and AI-powered recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={fetchData} style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', borderColor: 'transparent' }}>
            <RefreshCw size={16} />
            Refresh Data
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('assistant')} style={{ background: '#7c3aed' }}>
            <HelpCircle size={16} />
            HR Assistant
          </button>
        </div>
      </div>

      {/* AI Organizational Insight Card */}
      {analytics?.organizationalInsight && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
          border: '1px solid #c7d2fe',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#4338ca', fontWeight: 700, letterSpacing: '0.05em' }}>
              AI Organizational Health Insight
            </div>
            <p style={{ fontSize: '0.96rem', color: '#1e293b', marginTop: 4, lineHeight: 1.5, fontWeight: 500 }}>
              {analytics.organizationalInsight}
            </p>
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid-cols-4">
        <div className="metric-card">
          <div>
            <div className="metric-title">Total Submissions</div>
            <div className="metric-value">{total}</div>
          </div>
          <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Positive Sentiment</div>
            <div className="metric-value" style={{ color: '#16a34a' }}>
              {posCount} <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>({posPct}%)</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Negative Sentiment</div>
            <div className="metric-value" style={{ color: '#dc2626' }}>
              {negCount} <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>({negPct}%)</span>
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-title">Urgent / Critical</div>
            <div className="metric-value" style={{ color: urgentCount > 0 ? '#ea580c' : '#0f172a' }}>
              {urgentCount}
            </div>
          </div>
          <div className="metric-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Sentiment Progress & Top Concerns Grid */}
      <div className="grid-cols-2">
        {/* Sentiment Distribution Bar */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Sentiment Distribution</h2>
          {total === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p className="empty-state-desc">No feedback data available yet to compute sentiment distribution.</p>
            </div>
          ) : (
            <div>
              {/* Stacked Progress Bar */}
              <div style={{ height: 16, width: '100%', display: 'flex', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ width: `${posPct}%`, background: '#10b981' }} title={`Positive: ${posPct}%`} />
                <div style={{ width: `${neutPct}%`, background: '#94a3b8' }} title={`Neutral: ${neutPct}%`} />
                <div style={{ width: `${negPct}%`, background: '#ef4444' }} title={`Negative: ${negPct}%`} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
                <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>POSITIVE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>{posCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{posPct}%</div>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>NEUTRAL</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#475569' }}>{neutCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{neutPct}%</div>
                </div>
                <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>NEGATIVE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#dc2626' }}>{negCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{negPct}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Recurring Concerns */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recurring Workplace Concerns</h2>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setActiveTab('analytics')}>
              View Full Analytics
            </button>
          </div>

          {analytics?.recurringConcerns?.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p className="empty-state-desc">No recurring concerns detected yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analytics?.recurringConcerns?.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      background: '#e0e7ff',
                      color: '#4338ca',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{item.concern}</span>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                    {item.count} {item.count === 1 ? 'submission' : 'submissions'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Feedback Submissions Preview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Employee Submissions</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Latest workplace feedback analyzed across all departments</p>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('feedback-mgmt')} style={{ fontSize: '0.85rem' }}>
            Open Feedback Management <ArrowRight size={15} />
          </button>
        </div>

        {recentFeedbacks.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px 0' }}>
            <p className="empty-state-desc">No feedback data available yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Summary</th>
                  <th>Sentiment</th>
                  <th>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedbacks.map((f) => (
                  <tr key={f.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.85rem' }}>
                      {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: f.anonymous ? '#64748b' : '#0f172a' }}>
                        {f.employeeName || (f.anonymous ? 'Anonymous Employee' : 'Employee')}
                      </span>
                    </td>
                    <td>{f.department}</td>
                    <td style={{ maxWidth: 360 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.88rem' }}>
                        {f.summary || f.text}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${(f.sentiment || 'neutral').toLowerCase()}`}>
                        {f.sentiment || 'NEUTRAL'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-urgency-${(f.urgency || 'low').toLowerCase()}`}>
                        {f.urgency || 'LOW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
