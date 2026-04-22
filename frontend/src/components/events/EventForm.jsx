import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';

const CATEGORIES = ['Technology', 'Design', 'Business', 'Entertainment', 'Sports', 'Cultural', 'Academic', 'Other'];

const defaultForm = {
  title: '',
  description: '',
  venue: '',
  event_date: '',
  category: 'Technology',
  poster_url: '',
  seats: '',
};

const validate = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = 'Event title is required';
  if (!data.venue.trim()) errors.venue = 'Venue is required';
  if (!data.event_date) errors.event_date = 'Date is required';
  if (!data.seats || isNaN(data.seats) || Number(data.seats) <= 0)
    errors.seats = 'Valid seat count required';
  return errors;
};

export default function EventForm({ onSubmit, initialData = null, isLoading = false }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        venue: initialData.venue || '',
        event_date: initialData.event_date
          ? initialData.event_date.slice(0, 16)   // Keep datetime-local format
          : '',
        category: initialData.category || 'Technology',
        poster_url: initialData.poster_url || '',
        seats: initialData.seats?.toString() || '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(defaultForm).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ ...form, seats: Number(form.seats) });
  };

  const inputCls = (field) =>
    cn(
      "w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder:text-gray-600",
      "focus:outline-none focus:ring-1 transition-all text-sm",
      errors[field] && touched[field]
        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
        : "border-white/10 focus:border-primary focus:ring-primary/30"
    );

  const labelCls = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Title */}
      <div>
        <label htmlFor="ef-title" className={labelCls}>Event Title <span className="text-red-400">*</span></label>
        <input
          id="ef-title" name="title" type="text"
          value={form.title} onChange={handleChange} onBlur={handleBlur}
          placeholder="e.g. CodeFest 2026"
          className={inputCls('title')}
        />
        {errors.title && touched.title && <FieldError msg={errors.title} />}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="ef-desc" className={labelCls}>Description</label>
        <textarea
          id="ef-desc" name="description"
          value={form.description} onChange={handleChange}
          placeholder="Brief description of the event..."
          rows={3}
          className={cn(inputCls('description'), 'resize-none')}
        />
      </div>

      {/* Venue */}
      <div>
        <label htmlFor="ef-venue" className={labelCls}>Venue <span className="text-red-400">*</span></label>
        <input
          id="ef-venue" name="venue" type="text"
          value={form.venue} onChange={handleChange} onBlur={handleBlur}
          placeholder="e.g. Main Auditorium"
          className={inputCls('venue')}
        />
        {errors.venue && touched.venue && <FieldError msg={errors.venue} />}
      </div>

      {/* Date + Seats row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ef-date" className={labelCls}>Date & Time <span className="text-red-400">*</span></label>
          <input
            id="ef-date" name="event_date" type="datetime-local"
            value={form.event_date} onChange={handleChange} onBlur={handleBlur}
            className={cn(inputCls('event_date'), 'cursor-pointer')}
          />
          {errors.event_date && touched.event_date && <FieldError msg={errors.event_date} />}
        </div>
        <div>
          <label htmlFor="ef-seats" className={labelCls}>Total Seats <span className="text-red-400">*</span></label>
          <input
            id="ef-seats" name="seats" type="number" min="1"
            value={form.seats} onChange={handleChange} onBlur={handleBlur}
            placeholder="100"
            className={inputCls('seats')}
          />
          {errors.seats && touched.seats && <FieldError msg={errors.seats} />}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="ef-category" className={labelCls}>Category</label>
        <select
          id="ef-category" name="category"
          value={form.category} onChange={handleChange}
          className={cn(inputCls('category'), 'cursor-pointer')}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>
          ))}
        </select>
      </div>

      {/* Poster URL */}
      <div>
        <label htmlFor="ef-poster" className={labelCls}>Poster URL</label>
        <input
          id="ef-poster" name="poster_url" type="url"
          value={form.poster_url} onChange={handleChange}
          placeholder="https://example.com/poster.jpg"
          className={inputCls('poster_url')}
        />
        {form.poster_url && (
          <img
            src={form.poster_url}
            alt="Poster preview"
            className="mt-2 h-28 w-full object-cover rounded-xl border border-white/10"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isLoading} disabled={isLoading}>
        {initialData ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
}

function FieldError({ msg }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {msg}
    </p>
  );
}
