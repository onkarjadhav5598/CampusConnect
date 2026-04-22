import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages — Public
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

// Pages — Auth
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Pages — User (protected)
import UserDashboard from './pages/user/UserDashboard';

// Pages — Admin (protected + admin role)
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ── Public Routes ────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── User Protected Routes ────────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="user" />}>
            <Route path="/dashboard/*" element={<UserDashboard />} />
          </Route>

          {/* ── Admin Protected Routes ───────────────────────── */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* ── 404 Fallback ─────────────────────────────────── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-6xl font-bold text-gradient">404</h1>
                <p className="text-gray-400 text-lg">Page not found</p>
                <a href="/" className="text-primary hover:underline text-sm">← Go back home</a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
