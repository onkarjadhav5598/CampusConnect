import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/common/Sidebar';
import { Modal } from '../../components/common/Modal';
import EventTable from '../../components/events/EventTable';
import EventForm from '../../components/events/EventForm';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';
import { Plus, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
function DeleteConfirm({ event, onConfirm, onCancel, isLoading }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">"{event?.title}"</span>? This action
            cannot be undone and will also remove all registrations linked to this event.
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" isLoading={isLoading} onClick={onConfirm}>
          <Trash2 className="w-4 h-4 mr-1.5" />
          Delete Event
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Modal state
  const [modal, setModal] = useState({ type: null }); // type: 'create' | 'edit' | 'delete'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch all events ────────────────────────────────────────────────────────
  const loadEvents = useCallback(() => {
    setIsFetching(true);
    fetchEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : data.events ?? []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setSelectedEvent(null);
    setModal({ type: 'create' });
  };

  const openEdit = (event) => {
    setSelectedEvent(event);
    setModal({ type: 'edit' });
  };

  const openDelete = (event) => {
    setSelectedEvent(event);
    setModal({ type: 'delete' });
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModal({ type: null });
    setSelectedEvent(null);
  };

  // CREATE
  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const newEvent = await createEvent(formData);
      setEvents((prev) => [newEvent, ...prev]);
      toast.success('Event created successfully! 🎉');
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE
  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      const updated = await updateEvent(selectedEvent.id, formData);
      setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...updated } : e)));
      toast.success('Event updated successfully! ✅');
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteEvent(selectedEvent.id);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      toast.success('Event deleted');
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
      <Sidebar isAdmin />

      <main className="flex-1 overflow-y-auto">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Manage Events
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isFetching ? 'Loading…' : `${events.length} event${events.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <Button id="create-event-btn" size="sm" className="gap-2 shrink-0" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </header>

        {/* Table Section */}
        <motion.div
          className="p-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <EventTable
            events={events}
            isLoading={isFetching}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </motion.div>
      </main>

      {/* ── Create Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={modal.type === 'create'}
        onClose={closeModal}
        title="Create New Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleCreate}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* ── Edit Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        title="Edit Event"
        size="lg"
      >
        <EventForm
          onSubmit={handleUpdate}
          initialData={selectedEvent}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* ── Delete Confirmation Modal ────────────────────────── */}
      <Modal
        isOpen={modal.type === 'delete'}
        onClose={closeModal}
        title="Delete Event"
        size="sm"
      >
        <DeleteConfirm
          event={selectedEvent}
          onConfirm={handleDelete}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
