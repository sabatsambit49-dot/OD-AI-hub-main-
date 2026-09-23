import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const FooterLinksSection = ({ isEditor, isAdmin, setToast }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterGroup, setFilterGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getFooterLinks();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch footer links', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = () => {
    setEditingLink({
      group_label: 'Quick Links',
      label: '',
      url: '',
      display_order: links.length + 1,
      is_active: true,
    });
  };

  const handleEdit = (link) => {
    setEditingLink({ ...link });
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete "${label}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteFooterLink(id);
      setToast({ message: 'Footer link deleted', type: 'success' });
      fetchLinks();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete footer link', type: 'error' });
    }
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        group_label: editingLink.group_label,
        label: editingLink.label,
        url: editingLink.url,
        display_order: Number(editingLink.display_order),
        is_active: editingLink.is_active,
      };
      if (editingLink.id) {
        await websiteAdminApi.updateFooterLink(editingLink.id, data);
      } else {
        await websiteAdminApi.createFooterLink(data);
      }
      setToast({ message: editingLink.id ? 'Footer link updated successfully' : 'Footer link created successfully', type: 'success' });
      setEditingLink(null);
      fetchLinks();
    } catch (err) {
      console.error(err);
      setToast({ message: editingLink.id ? 'Failed to update footer link' : 'Failed to create footer link', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const groups = ['Quick Links', 'Support', 'Legal', 'Connect', 'Resources', 'Company'];

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Footer Links</h2>
          <p className="text-xs text-on-surface-variant">
            Manage footer navigation links for the website.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Link
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Group</label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by label..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading footer links...</div>
      ) : links.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">link</span>
          <p className="font-semibold">No footer links found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Link" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">
                    {link.group_label}
                  </span>
                  <h3 className="font-headline font-bold text-base text-on-surface">{link.label}</h3>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 break-all">
                  {link.url}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {link.display_order}
                  </span>
                  <span className={`px-2 py-1 rounded-md font-bold ${
                    link.is_active ? 'bg-emerald-500/15 text-emerald-700' : 'bg-gray-500/15 text-gray-700'
                  }`}>
                    {link.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(link.id, link.label)}
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

      {/* Create/Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">link</span>
              {editingLink.id ? `Edit Link: ${editingLink.label}` : 'Add New Footer Link'}
            </h3>

            <form onSubmit={handleSaveLink} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Group <span className="text-error">*</span></label>
                <select
                  value={editingLink.group_label}
                  onChange={(e) => setEditingLink({ ...editingLink, group_label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Label <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingLink.label || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL <span className="text-error">*</span></label>
                <input
                  type="url"
                  value={editingLink.url || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingLink.display_order || 0}
                    onChange={(e) => setEditingLink({ ...editingLink, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingLink.is_active}
                      onChange={(e) => setEditingLink({ ...editingLink, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingLink.id ? 'Save Changes' : 'Create Link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterLinksSection;