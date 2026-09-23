import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const PillarSectionsSection = ({ isEditor, isAdmin, setToast }) => {
  const [sections, setSections] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterPillar, setFilterPillar] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPillars = async () => {
    try {
      const data = await websiteAdminApi.getPillars();
      setPillars(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAudiences = async () => {
    try {
      const data = await websiteAdminApi.getInstitutionAudiences();
      setAudiences(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterPillar) params.pillar_id = filterPillar;
      if (filterAudience) params.audience_id = filterAudience;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getPillarSections(params);
      setSections(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch pillar sections', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPillars();
    fetchAudiences();
  }, []);

  useEffect(() => {
    fetchSections();
  }, [filterPillar, filterAudience, filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSections();
  };

  const handleCreate = () => {
    setEditingSection({
      pillar_id: filterPillar || (pillars[0]?.id || ''),
      audience_id: filterAudience || '',
      slug: '',
      title: '',
      description: '',
      accent_color: '#0082ff',
      icon: '',
      image_url: '',
      display_order: 1,
      status: 'draft',
    });
  };

  const handleEdit = (section) => {
    setEditingSection({ ...section });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deletePillarSection(id);
      setToast({ message: 'Section deleted', type: 'success' });
      fetchSections();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete section', type: 'error' });
    }
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        pillar_id: Number(editingSection.pillar_id),
        audience_id: editingSection.audience_id ? Number(editingSection.audience_id) : null,
        slug: editingSection.slug,
        title: editingSection.title,
        description: editingSection.description,
        accent_color: editingSection.accent_color,
        icon: editingSection.icon,
        image_url: editingSection.image_url,
        display_order: Number(editingSection.display_order),
        status: editingSection.status,
      };
      if (editingSection.id) {
        await websiteAdminApi.updatePillarSection(editingSection.id, data);
      } else {
        await websiteAdminApi.createPillarSection(data);
      }
      setToast({ message: editingSection.id ? 'Section updated successfully' : 'Section created successfully', type: 'success' });
      setEditingSection(null);
      fetchSections();
    } catch (err) {
      console.error(err);
      setToast({ message: editingSection.id ? 'Failed to update section' : 'Failed to create section', type: 'error' });
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
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Pillar Sections</h2>
          <p className="text-xs text-on-surface-variant">
            Manage sub-sections under each pillar (filterable by pillar and audience).
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Section
          </button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sections by title, description..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm focus:border-primary outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          Search
        </button>
      </form>

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
          <label className="block text-on-surface-variant font-semibold mb-1">Audience</label>
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Audiences</option>
            {audiences.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
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
          <label className="block text-on-surface-variant font-semibold mb-1">Sort By</label>
          <select
            value="display_order"
            onChange={() => {}}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="display_order">Display Order</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading sections...</div>
      ) : sections.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">folder</span>
          <p className="font-semibold">No sections found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((section) => {
            const pillar = pillars.find((p) => p.id === section.pillar_id);
            const audience = audiences.find((a) => a.id === section.audience_id);
            const accent = section.accent_color || pillar?.accent_color || '#0082ff';

            return (
              <div
                key={section.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: accent }}
                />

                <div>
                  <div className="flex items-center gap-3 mb-3 pt-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-headline font-extrabold text-white text-base shadow-xs"
                      style={{ backgroundColor: accent }}
                    >
                      {section.icon || pillar?.icon || section.title?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-on-surface">{section.title}</h3>
                      <p className="text-xs font-semibold" style={{ color: accent }}>
                        {section.slug}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    {section.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                    <span className="bg-surface-container px-2 py-1 rounded-md">
                      Pillar: {pillar?.name || 'Unknown'}
                    </span>
                    {audience && (
                      <span className="bg-surface-container px-2 py-1 rounded-md">
                        Audience: {audience.title}
                      </span>
                    )}
                    <span className="bg-surface-container px-2 py-1 rounded-md">
                      Order: {section.display_order}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md font-bold ${
                        section.status === 'published' ? 'bg-emerald-500/15 text-emerald-700' : section.status === 'draft' ? 'bg-amber-500/15 text-amber-700' : 'bg-gray-500/15 text-gray-700'
                      }`}
                    >
                      {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                    </span>
                  </div>
                </div>

                {isEditor && (
                  <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(section.id, section.title)}
                        className="px-4 py-1.5 rounded-lg bg-error/15 text-error hover:bg-error/25 text-xs font-semibold transition-colors"
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

      {/* Create/Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder</span>
              {editingSection.id ? `Edit Section: ${editingSection.title}` : 'Add New Pillar Section'}
            </h3>

            <form onSubmit={handleSaveSection} className="space-y-4 text-xs font-body">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Pillar <span className="text-error">*</span></label>
                  <select
                    value={editingSection.pillar_id || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, pillar_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                    required
                  >
                    <option value="">Select Pillar...</option>
                    {pillars.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Audience (Optional)</label>
                  <select
                    value={editingSection.audience_id || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, audience_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  >
                    <option value="">None (Global)</option>
                    {audiences.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Slug <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingSection.slug || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g., ai-solutions"
                  required
                />
                <p className="text-xs text-on-surface-variant/70 mt-1">Lowercase, hyphenated, SEO-friendly</p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingSection.title || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingSection.description || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Accent Color (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingSection.accent_color || '#0082ff'}
                      onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                      className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSection.accent_color || '#0082ff'}
                      onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Icon</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={editingSection.icon || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, icon: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingSection.image_url || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingSection.display_order || 0}
                    onChange={(e) => setEditingSection({ ...editingSection, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingSection.status}
                    onChange={(e) => setEditingSection({ ...editingSection, status: e.target.value })}
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
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingSection.id ? 'Save Changes' : 'Create Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillarSectionsSection;