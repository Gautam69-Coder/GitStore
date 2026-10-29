import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockUser } from '../services/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [token, setToken] = useState(localStorage.getItem('gitstore_token') || null);
  const [authMode, setAuthMode] = useState(localStorage.getItem('gitstore_auth_mode') || 'demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authMode !== 'demo' && token) {
      checkAuth();
    } else {
      // Default to demo mode
      setUser(mockUser);
    }
  }, [token, authMode]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Auth verification failed, switching to demo mode:', err);
      // Fallback gracefully to demo
      setAuthMode('demo');
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const loginWithPAT = async (pat) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.loginWithPAT(pat);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setAuthMode('pat');
        localStorage.setItem('gitstore_token', res.token);
        localStorage.setItem('gitstore_auth_mode', 'pat');
        return { success: true };
      }
      throw new Error('Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (code) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.handleOAuthCallback(code);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        setAuthMode('oauth');
        localStorage.setItem('gitstore_token', res.token);
        localStorage.setItem('gitstore_auth_mode', 'oauth');
        return { success: true };
      }
      throw new Error('OAuth login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const enableDemoMode = () => {
    setAuthMode('demo');
    setUser(mockUser);
    localStorage.setItem('gitstore_auth_mode', 'demo');
    setError(null);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.logout().catch(() => {});
      }
    } finally {
      setToken(null);
      localStorage.removeItem('gitstore_token');
      enableDemoMode();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authMode,
        isDemo: authMode === 'demo',
        loading,
        error,
        loginWithPAT,
        loginWithOAuth,
        enableDemoMode,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
