import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const SuccessStoriesSection = ({ isEditor, isAdmin, setToast }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStatus === 'published') params.published_only = true;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getSuccessStories(params);
      setStories(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch success stories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [filterCategory, filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStories();
  };

  const handleCreate = () => {
    setEditingStory({
      category: 'student',
      name: '',
      role_or_organization: '',
      photo_url: '',
      quote: '',
      outcome: '',
      is_published: false,
      display_order: stories.length + 1,
    });
  };

  const handleEdit = (story) => {
    setEditingStory({ ...story });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteSuccessStory(id);
      setToast({ message: 'Success story deleted', type: 'success' });
      fetchStories();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete success story', type: 'error' });
    }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        category: editingStory.category,
        name: editingStory.name,
        role_or_organization: editingStory.role_or_organization,
        photo_url: editingStory.photo_url,
        quote: editingStory.quote,
        outcome: editingStory.outcome,
        is_published: editingStory.is_published,
        display_order: Number(editingStory.display_order),
      };
      if (editingStory.id) {
        await websiteAdminApi.updateSuccessStory(editingStory.id, data);
      } else {
        await websiteAdminApi.createSuccessStory(data);
      }
      setToast({ message: editingStory.id ? 'Story updated successfully' : 'Story created successfully', type: 'success' });
      setEditingStory(null);
      fetchStories();
    } catch (err) {
      console.error(err);
      setToast({ message: editingStory.id ? 'Failed to update story' : 'Failed to create story', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      student: 'bg-blue-500/15 text-blue-700',
      startup: 'bg-purple-500/15 text-purple-700',
      business: 'bg-green-500/15 text-green-700',
      institution: 'bg-orange-500/15 text-orange-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[category] || 'bg-gray-500/15 text-gray-700'}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Success Stories</h2>
          <p className="text-xs text-on-surface-variant">
            Manage student, startup, business, and institution success stories.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Story
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Categories</option>
            <option value="student">Student</option>
            <option value="startup">Startup</option>
            <option value="business">Business</option>
            <option value="institution">Institution</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, organization..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading stories...</div>
      ) : stories.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">star</span>
          <p className="font-semibold">No success stories found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Story" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold text-base text-on-surface">{story.name}</h3>
                  {getCategoryBadge(story.category)}
                </div>

                {story.role_or_organization && (
                  <p className="text-xs text-on-surface-variant mb-2">
                    {story.role_or_organization}
                  </p>
                )}

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed italic">
                  "{story.quote}"
                </p>

                {story.outcome && (
                  <p className="text-xs text-on-surface font-medium text-primary mb-3">
                    {story.outcome}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {story.display_order}
                  </span>
                  <span className={`px-2 py-1 rounded-md font-bold ${
                    story.is_published ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'
                  }`}>
                    {story.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(story.id, story.name)}
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

      {/* Create/Edit Story Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">star</span>
              {editingStory.id ? `Edit Story: ${editingStory.name}` : 'Add New Success Story'}
            </h3>

            <form onSubmit={handleSaveStory} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Category <span className="text-error">*</span></label>
                <select
                  value={editingStory.category}
                  onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                >
                  <option value="student">Student</option>
                  <option value="startup">Startup</option>
                  <option value="business">Business</option>
                  <option value="institution">Institution</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingStory.name || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role / Organization</label>
                <input
                  type="text"
                  value={editingStory.role_or_organization || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, role_or_organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo URL</label>
                <input
                  type="url"
                  value={editingStory.photo_url || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, photo_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Quote <span className="text-error">*</span></label>
                <textarea
                  rows={3}
                  value={editingStory.quote || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Outcome (Measurable Result)</label>
                <textarea
                  rows={2}
                  value={editingStory.outcome || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, outcome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingStory.display_order || 0}
                    onChange={(e) => setEditingStory({ ...editingStory, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingStory.is_published}
                      onChange={(e) => setEditingStory({ ...editingStory, is_published: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Published
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingStory.id ? 'Save Changes' : 'Create Story')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesSection;