import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const OfferingsSection = ({ isEditor, isAdmin, setToast }) => {
  const [offerings, setOfferings] = useState([]);
  const [sections, setSections] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOffering, setEditingOffering] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterPillar, setFilterPillar] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPillars = async () => {
    try {
      const data = await websiteAdminApi.getPillars();
      setPillars(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSections = async () => {
    try {
      const data = await websiteAdminApi.getPillarSections({ pillar_id: filterPillar || undefined });
      setSections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterSection) params.section_id = filterSection;
      if (filterStatus) params.status = filterStatus;
      if (filterFeatured) params.featured_only = filterFeatured === 'true';
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getOfferings(params);
      setOfferings(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch offerings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  useEffect(() => {
    fetchSections();
  }, [filterPillar]);

  useEffect(() => {
    fetchOfferings();
  }, [filterSection, filterStatus, filterFeatured, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOfferings();
  };

  const handleCreate = () => {
    setEditingOffering({
      pillar_section_id: filterSection || (sections[0]?.id || ''),
      title: '',
      short_description: '',
      full_description: '',
      highlights: [],
      image_url: '',
      is_featured: false,
      display_order: offerings.length + 1,
      status: 'draft',
    });
  };

  const handleEdit = (offering) => {
    setEditingOffering({ ...offering, highlights: offering.highlights || [] });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteOffering(id);
      setToast({ message: 'Offering deleted', type: 'success' });
      fetchOfferings();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete offering', type: 'error' });
    }
  };

  const handleSaveOffering = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        pillar_section_id: Number(editingOffering.pillar_section_id),
        title: editingOffering.title,
        short_description: editingOffering.short_description,
        full_description: editingOffering.full_description,
        highlights: editingOffering.highlights,
        image_url: editingOffering.image_url,
        is_featured: editingOffering.is_featured,
        display_order: Number(editingOffering.display_order),
        status: editingOffering.status,
      };
      if (editingOffering.id) {
        await websiteAdminApi.updateOffering(editingOffering.id, data);
      } else {
        await websiteAdminApi.createOffering(data);
      }
      setToast({ message: editingOffering.id ? 'Offering updated successfully' : 'Offering created successfully', type: 'success' });
      setEditingOffering(null);
      fetchOfferings();
    } catch (err) {
      console.error(err);
      setToast({ message: editingOffering.id ? 'Failed to update offering' : 'Failed to create offering', type: 'error' });
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

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Offerings</h2>
          <p className="text-xs text-on-surface-variant">
            Manage the cards/offerings inside pillar sections.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Offering
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Pillar</label>
          <select
            value={filterPillar}
            onChange={(e) => setFilterPillar(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Pillars</option>
            {pillars.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Section</label>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Featured</label>
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading offerings...</div>
      ) : offerings.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">inventory_2</span>
          <p className="font-semibold">No offerings found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offerings.map((offering) => {
            const section = sections.find((s) => s.id === offering.pillar_section_id);
            const pillar = pillars.find((p) => p.id === section?.pillar_id);
            const accent = section?.accent_color || pillar?.accent_color || '#0082ff';

            return (
              <div
                key={offering.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: accent }}
                />

                <div>
                  <div className="flex items-center justify-between mb-3 pt-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: accent }}
                    >
                      {section?.title || 'Offering'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {offering.is_featured && (
                        <span className="text-amber-500 font-bold text-sm" title="Featured">★</span>
                      )}
                      {getStatusBadge(offering.status)}
                    </div>
                  </div>

                  <h3 className="font-headline font-bold text-base text-on-surface mb-1">
                    {offering.title}
                  </h3>

                  {offering.short_description && (
                    <p className="text-xs text-on-surface-variant mb-3">
                      {offering.short_description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 text-xs font-medium text-on-surface-variant mb-3">
                    <span className="bg-surface-container-high px-2 py-1 rounded-md">
                      Section: {section?.title || 'Unknown'}
                    </span>
                    {offering.is_featured && (
                      <span className="bg-amber-500/15 text-amber-700 px-2 py-1 rounded-md">★ Featured</span>
                    )}
                  </div>
                </div>

                {isEditor && (
                  <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(offering)}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(offering.id, offering.title)}
                        className="px-3 py-1.5 rounded-lg bg-error/15 text-error hover:bg-error/25 text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Offering Modal */}
      {editingOffering && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              {editingOffering.id ? `Edit Offering: ${editingOffering.title}` : 'Add New Offering'}
            </h3>

            <form onSubmit={handleSaveOffering} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Section <span className="text-error">*</span></label>
                <select
                  value={editingOffering.pillar_section_id || ''}
                  onChange={(e) => setEditingOffering({ ...editingOffering, pillar_section_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                >
                  <option value="">Select Section...</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingOffering.title || ''}
                  onChange={(e) => setEditingOffering({ ...editingOffering, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Short Description</label>
                  <input
                    type="text"
                    value={editingOffering.short_description || ''}
                    onChange={(e) => setEditingOffering({ ...editingOffering, short_description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingOffering.image_url || ''}
                    onChange={(e) => setEditingOffering({ ...editingOffering, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={editingOffering.full_description || ''}
                  onChange={(e) => setEditingOffering({ ...editingOffering, full_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Highlights (one per line)</label>
                <textarea
                  rows={4}
                  value={(editingOffering.highlights || []).join('\n')}
                  onChange={(e) => setEditingOffering({ ...editingOffering, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none font-mono text-xs"
                  placeholder="Highlight 1\nHighlight 2\nHighlight 3"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingOffering.display_order || 0}
                    onChange={(e) => setEditingOffering({ ...editingOffering, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingOffering.is_featured}
                      onChange={(e) => setEditingOffering({ ...editingOffering, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Featured
                  </label>
                </div>
                <div className="pt-4">
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingOffering.status}
                    onChange={(e) => setEditingOffering({ ...editingOffering, status: e.target.value })}
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
                  onClick={() => setEditingOffering(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingOffering.id ? 'Save Changes' : 'Create Offering')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferingsSection;