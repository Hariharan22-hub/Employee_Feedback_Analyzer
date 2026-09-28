import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, PieChart, TrendingUp, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';

export default function HRAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const total = analytics?.totalFeedback || 0;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Calculating organizational analytics...</div>;
  }

  if (total === 0) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Organizational Analytics</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Workplace sentiment intelligence and recurring topic trends</p>
          </div>
          <button className="btn btn-secondary" onClick={fetchAnalytics}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <BarChart3 size={32} />
            </div>
            <h2 className="empty-state-title">No feedback data available yet</h2>
            <p className="empty-state-desc">
              Analytics visualizations and trend reports will appear automatically once employees begin submitting feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sentimentDist = analytics.sentimentDistribution || {};
  const departmentDist = analytics.departmentDistribution || {};
  const urgencyDist = analytics.urgencyDistribution || {};
  const topicDist = analytics.topicDistribution || {};
  const recurring = analytics.recurringConcerns || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Organizational Analytics & Trends</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Aggregate metrics derived from {total} verified employee submissions</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAnalytics}>
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* Organizational Insight Alert */}
      {analytics.organizationalInsight && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <Sparkles size={20} color="#3b82f6" />
          <span style={{ fontSize: '0.92rem', color: '#1e293b' }}>
            <strong>Strategic Summary:</strong> {analytics.organizationalInsight}
          </span>
        </div>
      )}

      {/* Grid of Distribution Charts */}
      <div className="grid-cols-2">
        {/* Department Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Submissions by Department</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(departmentDist).map(([dept, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600, marginBottom: 4 }}>
                    <span>{dept}</span>
                    <span style={{ color: '#64748b' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#3b82f6', borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency Distribution */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Urgency Levels</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => {
              const count = urgencyDist[level] || 0;
              const pct = Math.round((count / total) * 100);
              const color = level === 'CRITICAL' ? '#ef4444' : (level === 'HIGH' ? '#f97316' : (level === 'MEDIUM' ? '#eab308' : '#22c55e'));
              return (
                <div key={level}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600, marginBottom: 4 }}>
                    <span style={{ color }}>{level}</span>
                    <span style={{ color: '#64748b' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Topic Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(topicDist).map(([top, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={top}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600, marginBottom: 4 }}>
                    <span>{top}</span>
                    <span style={{ color: '#64748b' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#8b5cf6', borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recurring Workplace Concerns */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Top Recurring Concerns</h2>
          {recurring.length === 0 ? (
            <p className="empty-state-desc">No specific concern clusters identified.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recurring.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.concern}</span>
                  </div>
                  <span className="badge badge-neutral">{item.count} occurrences</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
