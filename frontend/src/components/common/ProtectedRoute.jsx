import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * ProtectedRoute
 * @param {string} requiredRole - 'admin' | 'user' | undefined (any auth)
 *
 * Usage (in App.jsx):
 *   <Route element={<ProtectedRoute requiredRole="admin" />}>
 *     <Route path="/admin" element={<AdminDashboard />} />
 *   </Route>
 */
export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  // While hydrating auth state from localStorage, show spinner
  if (isLoading) return <Loader />;

  // Not logged in → redirect to login, remembering where they wanted to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only route, but user is not admin
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Regular user-only route, but they're an admin (optional — currently just passes through)
  // if (requiredRole === 'user' && isAdmin) {
  //   return <Navigate to="/admin" replace />;
  // }

  return <Outlet />;
}
