const API_BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).join(', ') : 'Request failed');
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  registerEmployee: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  registerHR: (data) => request('/auth/hr-register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Employee
  getMyProfile: () => request('/employee/me'),
  getMyFeedback: () => request('/employee/feedback'),
  submitFeedback: (data) => request('/feedback', { method: 'POST', body: JSON.stringify(data) }),

  // HR
  getOrganizationalFeedback: (params = {}) => {
    const query = new URLSearchParams();
    if (params.department) query.append('department', params.department);
    if (params.sentiment) query.append('sentiment', params.sentiment);
    if (params.urgency) query.append('urgency', params.urgency);
    if (params.topic) query.append('topic', params.topic);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/hr/feedback${queryString}`);
  },
  getFeedbackDetail: (id) => request(`/hr/feedback/${id}`),
  getAnalytics: () => request('/hr/analytics'),
  askAssistant: (question) => request('/assistant/ask', { method: 'POST', body: JSON.stringify({ question }) }),

  // Health
  getHealth: () => request('/health'),
};
