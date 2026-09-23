import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const EventRegistrationsSection = ({ isEditor, isAdmin, setToast }) => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    try {
      const data = await websiteAdminApi.getEvents({ status: 'published' });
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterEvent) params.event_id = filterEvent;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getEventRegistrations(params);
      setRegistrations(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch event registrations', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [filterEvent, filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleExportCsv = async () => {
    try {
      await websiteAdminApi.downloadEventRegistrationsCsv(filterEvent || null);
      setToast({ message: 'CSV download started', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to download CSV', type: 'error' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'registered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">Registered</span>;
      case 'attended':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">Attended</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-700 border border-red-500/30">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Event Registrations</h2>
          <p className="text-xs text-on-surface-variant">
            View and export event registrations. Read-only list.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Event</label>
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title} ({e.type})</option>
            ))}
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
            <option value="registered">Registered</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">event_note</span>
          <p className="font-semibold">No registrations found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Event</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-on-surface-variant">{reg.id}</td>
                  <td className="p-4 font-semibold text-on-surface">
                    {reg.event_title || 'Unknown'} ({reg.event_type || ''})
                  </td>
                  <td className="p-4 text-on-surface">{reg.name}</td>
                  <td className="p-4 text-on-surface-variant">{reg.email || '-'}</td>
                  <td className="p-4 text-on-surface-variant">{reg.organization || '-'}</td>
                  <td className="p-4">{getStatusBadge(reg.status)}</td>
                  <td className="p-4 text-on-surface-variant text-xs">
                    {reg.created_at ? new Date(reg.created_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationsSection;