import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  Search, Edit, Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  CalendarDays, MapPin, Tag, ChevronLeft, ChevronRight, Inbox,
} from 'lucide-react';
import Loader from '../common/Loader';

const PAGE_SIZE = 10;

function StatusBadge({ date }) {
  const isUpcoming = date ? new Date(date) >= new Date() : true;
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-bold",
      isUpcoming
        ? "bg-green-500/15 text-green-400 border border-green-500/25"
        : "bg-gray-500/15 text-gray-400 border border-gray-500/25"
    )}>
      {isUpcoming ? 'Upcoming' : 'Past'}
    </span>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
}

export default function EventTable({ events = [], onEdit, onDelete, isLoading }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('event_date');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter((e) =>
      e.title?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
    );
  }, [events, search]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';
      if (sortField === 'event_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const cols = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'event_date', label: 'Date', sortable: true },
    { key: 'venue', label: 'Venue', sortable: false },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'seats', label: 'Seats', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            id="event-search"
            value={search}
            onChange={handleSearch}
            placeholder="Search by title, category, venue..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <p className="text-xs text-gray-500 sm:ml-auto shrink-0">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400 whitespace-nowrap">
          <thead className="bg-white/5 text-xs uppercase text-gray-500 tracking-wider">
            <tr>
              {cols.map((col) => (
                <th key={col.key} className="px-5 py-4 font-medium">
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      {col.label}
                      <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-20">
                  <Loader fullPage={false} />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState search={search} />
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginated.map((event, i) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.025] transition-colors group"
                  >
                    {/* Title */}
                    <td className="px-5 py-4 max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.poster_url || event.poster || `https://picsum.photos/seed/${event.id}/80/80`}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id}/80/80`; }}
                        />
                        <span className="font-medium text-white truncate max-w-[140px]" title={event.title}>
                          {event.title}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : event.date || '—'}
                      </div>
                    </td>

                    {/* Venue */}
                    <td className="px-5 py-4 max-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[120px]" title={event.venue}>{event.venue || '—'}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                        {event.category || '—'}
                      </div>
                    </td>

                    {/* Seats */}
                    <td className="px-5 py-4 text-center">
                      {event.seats ?? '—'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge date={event.event_date} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          id={`edit-event-${event.id}`}
                          onClick={() => onEdit(event)}
                          title="Edit event"
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-event-${event.id}`}
                          onClick={() => onDelete(event)}
                          title="Delete event"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-primary/30 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-600">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                      page === p
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-primary/30 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ search }) {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
        <Inbox className="w-8 h-8 text-gray-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-300 mb-1">
          {search ? 'No matching events' : 'No events yet'}
        </p>
        <p className="text-sm text-gray-500">
          {search
            ? 'Try adjusting your search query'
            : 'Create your first event using the button above'}
        </p>
      </div>
    </div>
  );
}
