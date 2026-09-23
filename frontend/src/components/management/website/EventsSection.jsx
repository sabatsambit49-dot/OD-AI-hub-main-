import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const EventsSection = ({ isEditor, isAdmin, setToast }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.event_type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getEvents(params);
      setEvents(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch events', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filterType, filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCreate = () => {
    setEditingEvent({
      slug: '',
      title: '',
      type: 'workshop',
      description: '',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      mode: 'online',
      location: '',
      registration_open: true,
      image_url: '',
      status: 'draft',
      display_order: events.length + 1,
    });
  };

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
    });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteEvent(id);
      setToast({ message: 'Event deleted', type: 'success' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete event', type: 'error' });
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        slug: editingEvent.slug,
        title: editingEvent.title,
        type: editingEvent.type,
        description: editingEvent.description,
        event_date: editingEvent.event_date,
        mode: editingEvent.mode,
        location: editingEvent.location,
        registration_open: editingEvent.registration_open,
        image_url: editingEvent.image_url,
        status: editingEvent.status,
        display_order: Number(editingEvent.display_order),
      };
      if (editingEvent.id) {
        await websiteAdminApi.updateEvent(editingEvent.id, data);
      } else {
        await websiteAdminApi.createEvent(data);
      }
      setToast({ message: editingEvent.id ? 'Event updated successfully' : 'Event created successfully', type: 'success' });
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ message: editingEvent.id ? 'Failed to update event' : 'Failed to create event', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Published</span>;
      case 'draft':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">Draft</span>;
      case 'archived':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/15 text-gray-700 border border-gray-500/30">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">{status}</span>;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      workshop: 'bg-blue-500/15 text-blue-700',
      hackathon: 'bg-purple-500/15 text-purple-700',
      demo_class: 'bg-green-500/15 text-green-700',
      seminar: 'bg-orange-500/15 text-orange-700',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[type] || 'bg-gray-500/15 text-gray-700'}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Events</h2>
          <p className="text-xs text-on-surface-variant">
            Manage workshops, hackathons, demo classes, and seminars.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="hackathon">Hackathon</option>
            <option value="demo_class">Demo Class</option>
            <option value="seminar">Seminar</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">event</span>
          <p className="font-semibold">No events found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold text-base text-on-surface">{event.title}</h3>
                  {getTypeBadge(event.type)}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant mb-3">
                  <span className="bg-surface-container-high px-2 py-1 rounded-md">
                    {new Date(event.event_date).toLocaleDateString()}
                  </span>
                  <span className="bg-surface-container-high px-2 py-1 rounded-md capitalize">
                    {event.mode}
                  </span>
                  {event.location && (
                    <span className="bg-surface-container-high px-2 py-1 rounded-md">
                      {event.location}
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Registrations: {event.registration_count || 0}
                  </span>
                  {getStatusBadge(event.status)}
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="px-4 py-1.5 rounded-lg bg-error/15 text-error hover:bg-error/25 text-xs font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">event</span>
              {editingEvent.id ? `Edit Event: ${editingEvent.title}` : 'Add New Event'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Slug <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingEvent.slug || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Type <span className="text-error">*</span></label>
                  <select
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                    required
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="demo_class">Demo Class</option>
                    <option value="seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Mode</label>
                  <select
                    value={editingEvent.mode}
                    onChange={(e) => setEditingEvent({ ...editingEvent, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Event Date & Time <span className="text-error">*</span></label>
                <input
                  type="datetime-local"
                  value={editingEvent.event_date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingEvent.image_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingEvent.display_order || 0}
                    onChange={(e) => setEditingEvent({ ...editingEvent, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingEvent.registration_open}
                      onChange={(e) => setEditingEvent({ ...editingEvent, registration_open: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Registration Open
                  </label>
                </div>
                <div className="pt-4">
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingEvent.id ? 'Save Changes' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsSection;