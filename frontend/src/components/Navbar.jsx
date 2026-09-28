import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, LayoutDashboard, PlusCircle, BarChart3, HelpCircle, UserCheck, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, role, logout, isHR, isEmployee } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <MessageSquare size={20} />
          </div>
          <div>
            <span>Employee Feedback Analyzer</span>
          </div>
        </div>

        <nav className="nav-links">
          {isEmployee && (
            <>
              <button
                className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </button>
              <button
                className={`nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
                onClick={() => setActiveTab('submit')}
              >
                <PlusCircle size={17} />
                Submit Feedback
              </button>
              <button
                className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <MessageSquare size={17} />
                My Feedback
              </button>
            </>
          )}

          {isHR && (
            <>
              <button
                className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={17} />
                HR Overview
              </button>
              <button
                className={`nav-btn ${activeTab === 'feedback-mgmt' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback-mgmt')}
              >
                <MessageSquare size={17} />
                Employee Feedback
              </button>
              <button
                className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={17} />
                Analytics
              </button>
              <button
                className={`nav-btn ${activeTab === 'assistant' ? 'active' : ''}`}
                onClick={() => setActiveTab('assistant')}
              >
                <HelpCircle size={17} />
                HR Assistant
              </button>
            </>
          )}
        </nav>

        <div className="nav-user">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.department}</div>
          </div>
          <span className={`role-badge ${isHR ? 'hr' : 'employee'}`}>
            {role}
          </span>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={logout}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
