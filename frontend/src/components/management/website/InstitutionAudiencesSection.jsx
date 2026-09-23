import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const InstitutionAudiencesSection = ({ isEditor, isAdmin, setToast }) => {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAudience, setEditingAudience] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAudiences = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getInstitutionAudiences();
      setAudiences(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch institution audiences', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudiences();
  }, []);

  const handleCreate = () => {
    setEditingAudience({
      slug: '',
      title: '',
      description: '',
      image_url: '',
      display_order: audiences.length + 1,
      is_active: true,
    });
  };

  const handleEdit = (audience) => {
    setEditingAudience({ ...audience });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteInstitutionAudience(id);
      setToast({ message: 'Audience deleted', type: 'success' });
      fetchAudiences();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete audience', type: 'error' });
    }
  };

  const handleSaveAudience = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        slug: editingAudience.slug,
        title: editingAudience.title,
        description: editingAudience.description,
        image_url: editingAudience.image_url,
        display_order: Number(editingAudience.display_order),
        is_active: editingAudience.is_active,
      };
      if (editingAudience.id) {
        await websiteAdminApi.updateInstitutionAudience(editingAudience.id, data);
      } else {
        await websiteAdminApi.createInstitutionAudience(data);
      }
      setToast({ message: editingAudience.id ? 'Audience updated successfully' : 'Audience created successfully', type: 'success' });
      setEditingAudience(null);
      fetchAudiences();
    } catch (err) {
      console.error(err);
      setToast({ message: editingAudience.id ? 'Failed to update audience' : 'Failed to create audience', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Institution Audiences</h2>
          <p className="text-xs text-on-surface-variant">
            Manage Colleges and Schools audiences for the /for-institutions page.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Audience
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading audiences...</div>
      ) : audiences.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">groups</span>
          <p className="font-semibold">No audiences found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Audience" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                    {audience.title?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">{audience.title}</h3>
                    <p className="text-xs text-on-surface-variant">Slug: {audience.slug}</p>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {audience.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {audience.display_order}
                  </span>
                  <span className={`px-2 py-1 rounded-md font-bold ${
                    audience.is_active ? 'bg-emerald-500/15 text-emerald-700' : 'bg-gray-500/15 text-gray-700'
                  }`}>
                    {audience.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(audience)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(audience.id, audience.title)}
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

      {/* Create/Edit Audience Modal */}
      {editingAudience && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups</span>
              {editingAudience.id ? `Edit Audience: ${editingAudience.title}` : 'Add New Institution Audience'}
            </h3>

            <form onSubmit={handleSaveAudience} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Slug <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingAudience.slug || ''}
                  onChange={(e) => setEditingAudience({ ...editingAudience, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g., colleges"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingAudience.title || ''}
                  onChange={(e) => setEditingAudience({ ...editingAudience, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAudience.description || ''}
                  onChange={(e) => setEditingAudience({ ...editingAudience, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingAudience.image_url || ''}
                  onChange={(e) => setEditingAudience({ ...editingAudience, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingAudience.display_order || 0}
                    onChange={(e) => setEditingAudience({ ...editingAudience, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingAudience.is_active}
                      onChange={(e) => setEditingAudience({ ...editingAudience, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingAudience(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingAudience.id ? 'Save Changes' : 'Create Audience')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionAudiencesSection;