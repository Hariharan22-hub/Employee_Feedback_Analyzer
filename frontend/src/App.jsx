import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthLanding from './pages/AuthLanding';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRDashboard from './pages/HRDashboard';
import HRFeedbackManagement from './pages/HRFeedbackManagement';
import HRAnalyticsPage from './pages/HRAnalyticsPage';
import HRAssistantPage from './pages/HRAssistantPage';
import AccessDenied from './pages/AccessDenied';

function MainApp() {
  const { isAuthenticated, isHR, isEmployee, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthLanding />;
  }

  const renderContent = () => {
    // Employee Views
    if (isEmployee) {
      if (['feedback-mgmt', 'analytics', 'assistant'].includes(activeTab)) {
        return <AccessDenied onReturn={() => setActiveTab('dashboard')} />;
      }

      if (activeTab === 'submit') {
        return <EmployeeDashboard defaultTab="submit" />;
      }

      return <EmployeeDashboard defaultTab="dashboard" />;
    }

    // HR Views
    if (isHR) {
      switch (activeTab) {
        case 'dashboard':
          return <HRDashboard setActiveTab={setActiveTab} />;
        case 'feedback-mgmt':
          return <HRFeedbackManagement />;
        case 'analytics':
          return <HRAnalyticsPage />;
        case 'assistant':
          return <HRAssistantPage />;
        default:
          return <HRDashboard setActiveTab={setActiveTab} />;
      }
    }

    return <AccessDenied onReturn={() => setActiveTab('dashboard')} />;
  };

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '24px 20px',
        color: '#64748b',
        fontSize: '0.82rem',
        borderTop: '1px solid #e2e8f0',
        background: 'white',
        marginTop: 40
      }}>
        <div>Employee Feedback Analyzer • Java 21 • Spring Boot 3 • Spring Security • SQLite • Google Gemini AI • React</div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
