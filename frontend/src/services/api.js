/**
 * services/api.js
 * Domain-specific API helpers wrapping the shared Axios instance.
 *
 * Public events  → GET  /api/events
 * Admin CRUD     → POST/PUT/DELETE /api/admin/events  (JWT + admin role required)
 * Auth           → POST /api/auth/login | /api/auth/register
 */
import apiClient from '../lib/apiClient';

// ── Events (public) ───────────────────────────────────────────────────────────
export const fetchEvents = () =>
  apiClient.get('/events').then((r) => r.data);

export const fetchEventById = (id) =>
  apiClient.get(`/events/${id}`).then((r) => r.data);

// ── Events (admin CRUD) ───────────────────────────────────────────────────────
export const createEvent = (data) =>
  apiClient.post('/admin/events', data).then((r) => r.data);

export const updateEvent = (id, data) =>
  apiClient.put(`/admin/events/${id}`, data).then((r) => r.data);

export const deleteEvent = (id) =>
  apiClient.delete(`/admin/events/${id}`).then((r) => r.data);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  apiClient.post('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (data) =>
  apiClient.post('/auth/register', data).then((r) => r.data);

// ── Admin extras ──────────────────────────────────────────────────────────────
export const fetchAdminAnalytics = () =>
  apiClient.get('/admin/analytics').then((r) => r.data);

export const fetchAdminUsers = () =>
  apiClient.get('/admin/users').then((r) => r.data);

// ── User Dashboard (Students) ────────────────────────────────────────────────
export const fetchMyEvents = () =>
  apiClient.get('/users/my-events').then((r) => r.data);

export const registerForEvent = (eventId) =>
  apiClient.post('/registrations', { event_id: eventId }).then((r) => r.data);

export const cancelRegistration = (registrationId) =>
  apiClient.delete(`/registrations/${registrationId}`).then((r) => r.data);

export const updateProfile = (data) =>
  apiClient.put('/users/profile', data).then((r) => r.data);

// ── Notifications ─────────────────────────────────────────────────────────────
export const fetchNotifications = () =>
  apiClient.get('/notifications').then((r) => r.data);

export const markNotificationRead = (id) =>
  apiClient.patch(`/notifications/${id}/read`).then((r) => r.data);

export const markAllNotificationsRead = () =>
  apiClient.patch('/notifications/read-all').then((r) => r.data);
