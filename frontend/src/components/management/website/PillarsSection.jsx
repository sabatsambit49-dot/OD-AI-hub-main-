import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const PillarsSection = ({ isEditor, isAdmin, setToast }) => {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPillar, setEditingPillar] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPillars = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getPillars();
      setPillars(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch pillars', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  const handleEditClick = (pillar) => {
    setEditingPillar({ ...pillar });
  };

  const handleSavePillar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        slug: editingPillar.slug,
        name: editingPillar.name,
        tagline: editingPillar.tagline,
        description: editingPillar.description,
        accent_color: editingPillar.accent_color,
        icon: editingPillar.icon,
        hero_image_url: editingPillar.hero_image_url,
        display_order: Number(editingPillar.display_order),
        status: editingPillar.status,
      };
      if (editingPillar.id) {
        await websiteAdminApi.updatePillar(editingPillar.id, data);
      } else {
        await websiteAdminApi.createPillar(data);
      }
      setToast({ message: editingPillar.id ? 'Pillar updated successfully' : 'Pillar created successfully', type: 'success' });
      setEditingPillar(null);
      fetchPillars();
    } catch (err) {
      console.error(err);
      setToast({ message: editingPillar.id ? 'Failed to update pillar' : 'Failed to create pillar', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deletePillar(id);
      setToast({ message: 'Pillar deleted', type: 'success' });
      fetchPillars();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete pillar', type: 'error' });
    }
  };

  const handleCreate = () => {
    setEditingPillar({
      slug: '',
      name: '',
      tagline: '',
      description: '',
      accent_color: '#0082ff',
      icon: '',
      hero_image_url: '',
      display_order: pillars.length + 1,
      status: 'draft',
    });
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

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Website Pillars</h2>
          <p className="text-xs text-on-surface-variant">
            Manage the top-level pillars (Technologies, Innovation Lab, Startups, For Business, For Institutions, Events, Success Stories).
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Pillar
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading pillars...</div>
      ) : pillars.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">category</span>
          <p className="font-semibold">No pillars found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Pillar" to create the first pillar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: pillar.accent_color }}
              />

              <div>
                <div className="flex items-center gap-3 mb-3 pt-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-headline font-extrabold text-white text-base shadow-xs"
                    style={{ backgroundColor: pillar.accent_color }}
                  >
                    {pillar.icon || pillar.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">{pillar.name}</h3>
                    <p className="text-xs font-semibold" style={{ color: pillar.accent_color }}>
                      {pillar.tagline || 'Pillar'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {pillar.display_order}
                  </span>
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Slug: {pillar.slug}
                  </span>
                  {getStatusBadge(pillar.status)}
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(pillar)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(pillar.id, pillar.name)}
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

      {/* Create/Edit Pillar Modal */}
      {editingPillar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">category</span>
              {editingPillar.id ? `Edit Pillar: ${editingPillar.name}` : 'Add New Pillar'}
            </h3>

            <form onSubmit={handleSavePillar} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Slug <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingPillar.slug || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g., technologies"
                  required
                />
                <p className="text-xs text-on-surface-variant/70 mt-1">Lowercase, hyphenated, SEO-friendly (e.g., technologies, innovation-lab)</p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingPillar.name || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingPillar.tagline || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingPillar.description || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Accent Color (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingPillar.accent_color || '#0082ff'}
                      onChange={(e) => setEditingPillar({ ...editingPillar, accent_color: e.target.value })}
                      className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingPillar.accent_color || '#0082ff'}
                      onChange={(e) => setEditingPillar({ ...editingPillar, accent_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Icon</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={editingPillar.icon || ''}
                    onChange={(e) => setEditingPillar({ ...editingPillar, icon: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Image URL</label>
                <input
                  type="url"
                  value={editingPillar.hero_image_url || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, hero_image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="https://example.com/hero.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingPillar.display_order || 0}
                    onChange={(e) => setEditingPillar({ ...editingPillar, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingPillar.status}
                    onChange={(e) => setEditingPillar({ ...editingPillar, status: e.target.value })}
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
                  onClick={() => setEditingPillar(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingPillar.id ? 'Save Changes' : 'Create Pillar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillarsSection;