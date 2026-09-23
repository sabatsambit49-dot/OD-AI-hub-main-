import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { institutionApi } from '../../api/institutionApi';
import api from '../../api/client';

const EventInfoFormModal = ({ isOpen, onClose, entityType = 'event', onSuccess }) => {
  const [institutions, setInstitutions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsts = async () => {
      try {
        const data = await institutionApi.getInstitutions();
        setInstitutions(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen && entityType === 'event') fetchInsts();
  }, [isOpen, entityType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (entityType === 'event') {
        const payload = {
          name: formData.name,
          event_date: new Date(formData.event_date).toISOString(),
          description: formData.description || '',
          institution_id: formData.institution_id ? parseInt(formData.institution_id) : null,
        };
        await api.post('/events/with-institution', payload);
      } else {
        const payload = {
          title: formData.title,
          tag: formData.tag || 'General',
          body: formData.body || '',
        };
        await api.post('/information', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entityType === 'event' ? "Create Institution Event" : "Publish Information Post"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-error/10 text-error text-sm font-body">{error}</div>}

        {entityType === 'event' ? (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Event Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Annual Tech Symposium 2026..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Select Institution (Optional)</label>
              <select
                value={formData.institution_id || ''}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              >
                <option value="">Global Event / None</option>
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Event Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.event_date || ''}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Post Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Fall 2026 Admissions Open Announcement..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Tag / Category</label>
              <input
                type="text"
                required
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Announcement, Circular, Policy..."
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-label font-semibold text-on-surface mb-1">Body Content</label>
              <textarea
                required
                value={formData.body || ''}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows="4"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </>
        )}

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant font-label text-sm font-semibold hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventInfoFormModal;
