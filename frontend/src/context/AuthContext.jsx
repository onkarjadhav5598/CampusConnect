import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';

// ── State Shape ──────────────────────────────────────────────────────────────
const initialState = {
  user: null,     // { id, full_name, email, role }
  token: null,
  isLoading: true,
};

// ── Reducer ──────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, user: action.payload.user, token: action.payload.token, isLoading: false };
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        dispatch({ type: 'INIT', payload: { user, token } });
      } else {
        dispatch({ type: 'INIT', payload: { user: null, token: null } });
      }
    } catch {
      dispatch({ type: 'INIT', payload: { user: null, token: null } });
    }
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, ...user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token } });
    return user;
  }, []);

  const signup = useCallback(async ({ full_name, email, password, role = 'user' }) => {
    const response = await apiClient.post('/auth/register', { full_name, email, password, role });
    const { token, ...user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token } });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
