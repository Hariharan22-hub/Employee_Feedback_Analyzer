import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    const userData = {
      id: authResponse.id,
      name: authResponse.name,
      username: authResponse.username,
      email: authResponse.email,
      department: authResponse.department,
      role: authResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authResponse.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isHR = user?.role === 'HR';
  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider value={{ token, user, role: user?.role, login, logout, isHR, isEmployee, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
