import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDenied({ onReturn }) {
  return (
    <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '48px 32px' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#fef2f2',
          color: '#ef4444',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20
        }}>
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Access Restricted
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.5 }}>
          You do not have permission to access this area. This section is restricted to authorized HR personnel under role-based security policies.
        </p>
        <button className="btn btn-primary" onClick={onReturn}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}
