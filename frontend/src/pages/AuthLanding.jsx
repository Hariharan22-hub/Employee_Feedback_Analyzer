import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserCheck, ShieldCheck, Lock, User, Mail, Building, KeyRound, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function AuthLanding() {
  const { login } = useAuth();

  const [activePortal, setActivePortal] = useState('EMPLOYEE'); // 'EMPLOYEE' | 'HR'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [hrCode, setHrCode] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showHrCode, setShowHrCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setError('');
    setAuthMode('login');
    setShowPassword(false);
    setShowHrCode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activePortal === 'EMPLOYEE') {
        if (authMode === 'login') {
          const res = await api.login({ usernameOrEmail: username, password });
          login(res);
        } else {
          const res = await api.registerEmployee({ name, username, email, password, department });
          login(res);
        }
      } else {
        // HR Portal
        if (authMode === 'login') {
          const res = await api.login({ usernameOrEmail: username, password });
          if (res.role !== 'HR') {
            setError('Access Denied: This account does not possess HR privileges. Please use the Employee Portal.');
            setLoading(false);
            return;
          }
          login(res);
        } else {
          const res = await api.registerHR({ name, username, email, password, department, hrCode });
          login(res);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
      {/* Top Banner */}
      <header style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Employee Feedback Analyzer</h1>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>AI-Powered Workplace Intelligence Platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={14} /> Spring Security</span>
            <span>•</span>
            <span>Google Gemini AI</span>
            <span>•</span>
            <span>Java 21</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 16px' }}>
        <div style={{ width: '100%', maxWidth: 960, background: 'white', borderRadius: 20, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          
          {/* Dual Portal Selection Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '2px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => handlePortalSwitch('EMPLOYEE')}
              style={{
                padding: '20px 16px',
                border: 'none',
                background: activePortal === 'EMPLOYEE' ? 'white' : '#f8fafc',
                borderBottom: activePortal === 'EMPLOYEE' ? '3px solid #2563eb' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: activePortal === 'EMPLOYEE' ? '#eff6ff' : '#e2e8f0',
                color: activePortal === 'EMPLOYEE' ? '#2563eb' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UserCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: activePortal === 'EMPLOYEE' ? '#1d4ed8' : '#475569' }}>
                  EMPLOYEE PORTAL
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Submit and manage your workplace feedback
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('HR')}
              style={{
                padding: '20px 16px',
                border: 'none',
                background: activePortal === 'HR' ? 'white' : '#f8fafc',
                borderBottom: activePortal === 'HR' ? '3px solid #7c3aed' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: activePortal === 'HR' ? '#f5f3ff' : '#e2e8f0',
                color: activePortal === 'HR' ? '#7c3aed' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: activePortal === 'HR' ? '#6d28d9' : '#475569' }}>
                  HR PORTAL
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Review employee feedback & organizational insights
                </div>
              </div>
            </button>
          </div>

          <div style={{ padding: '36px 40px' }}>
            {/* Mode Switcher (Login vs Register) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
                  {activePortal === 'EMPLOYEE'
                    ? (authMode === 'login' ? 'Employee Login' : 'Employee Registration')
                    : (authMode === 'login' ? 'HR Portal Login' : 'Protected HR Registration')}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: 2 }}>
                  {activePortal === 'EMPLOYEE'
                    ? (authMode === 'login' ? 'Access your personal feedback dashboard and submit suggestions' : 'Create an employee account to submit workplace feedback')
                    : (authMode === 'login' ? 'Restricted to authorized Human Resources personnel only' : 'Enter designated HR Access Code to provision HR administrator privileges')}
                </p>
              </div>

              <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setShowPassword(false); setShowHrCode(false); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: authMode === 'login' ? 'white' : 'transparent',
                    color: authMode === 'login' ? '#0f172a' : '#64748b',
                    boxShadow: authMode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); setShowPassword(false); setShowHrCode(false); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: authMode === 'register' ? 'white' : 'transparent',
                    color: authMode === 'register' ? '#0f172a' : '#64748b',
                    boxShadow: authMode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {authMode === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: authMode === 'register' ? '1fr 1fr' : '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">{authMode === 'login' ? 'Username or Email' : 'Choose Username'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={authMode === 'login' ? 'username or work email' : 'e.g. sjenkins'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={0}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {authMode === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: activePortal === 'HR' ? '1fr 1fr' : '1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
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

                  {activePortal === 'HR' && (
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6d28d9' }}>
                        <KeyRound size={15} />
                        HR Verification Code *
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showHrCode ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Enter organization HR verification code"
                          value={hrCode}
                          onChange={(e) => setHrCode(e.target.value)}
                          required
                          style={{ borderColor: '#c4b5fd' }}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowHrCode(!showHrCode)}
                          aria-label={showHrCode ? "Hide HR verification code" : "Show HR verification code"}
                          tabIndex={0}
                        >
                          {showHrCode ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.98rem',
                    background: activePortal === 'HR' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  }}
                >
                  {loading ? 'Authenticating...' : (authMode === 'login' ? `Sign In to ${activePortal === 'HR' ? 'HR Portal' : 'Employee Portal'}` : 'Create Account')}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
