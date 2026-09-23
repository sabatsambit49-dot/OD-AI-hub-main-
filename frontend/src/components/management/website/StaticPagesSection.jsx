import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const StaticPagesSection = ({ isEditor, isAdmin, setToast }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await websiteAdminApi.getStaticPages();
      setPages(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch static pages', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = () => {
    setEditingPage({
      slug: '',
      title: '',
      body_blocks: [],
    });
  };

  const handleEdit = (page) => {
    setEditingPage({ ...page });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteStaticPage(id);
      setToast({ message: 'Page deleted', type: 'success' });
      fetchPages();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete page', type: 'error' });
    }
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        slug: editingPage.slug,
        title: editingPage.title,
        body_blocks: editingPage.body_blocks,
      };
      if (editingPage.id) {
        await websiteAdminApi.updateStaticPage(editingPage.id, data);
      } else {
        await websiteAdminApi.createStaticPage(data);
      }
      setToast({ message: editingPage.id ? 'Page updated successfully' : 'Page created successfully', type: 'success' });
      setEditingPage(null);
      fetchPages();
    } catch (err) {
      console.error(err);
      setToast({ message: editingPage.id ? 'Failed to update page' : 'Failed to create page', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = () => {
    const newBlock = { type: 'paragraph', content: '' };
    setEditingPage({ ...editingPage, body_blocks: [...(editingPage.body_blocks || []), newBlock] });
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...editingPage.body_blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setEditingPage({ ...editingPage, body_blocks: newBlocks });
  };

  const handleRemoveBlock = (index) => {
    const newBlocks = editingPage.body_blocks.filter((_, i) => i !== index);
    setEditingPage({ ...editingPage, body_blocks: newBlocks });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Static Pages</h2>
          <p className="text-xs text-on-surface-variant">
            Manage content for /about, /careers, /contact, /privacy-policy, /refund-policy, /terms.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Page
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading pages...</div>
      ) : pages.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">description</span>
          <p className="font-semibold">No pages found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Page" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold text-base text-on-surface">{page.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">
                    {page.slug}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {page.body_blocks?.length} content blocks
                </p>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
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

      {/* Create/Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              {editingPage.id ? `Edit Page: ${editingPage.title}` : 'Add New Static Page'}
            </h3>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Slug <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingPage.slug || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  placeholder="e.g., about, privacy-policy"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingPage.title || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content Blocks</label>
                <div className="space-y-3">
                  {(editingPage.body_blocks || []).map((block, index) => (
                    <div key={index} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex gap-3">
                      <select
                        value={block.type}
                        onChange={(e) => handleBlockChange(index, 'type', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none w-32"
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="heading">Heading</option>
                        <option value="image">Image</option>
                        <option value="list">Bullet List</option>
                      </select>
                      <div className="flex-1">
                        {block.type === 'paragraph' && (
                          <textarea
                            value={block.content || ''}
                            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                            placeholder="Paragraph text..."
                          />
                        )}
                        {block.type === 'heading' && (
                          <input
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                            placeholder="Heading text..."
                          />
                        )}
                        {block.type === 'image' && (
                          <input
                            type="url"
                            value={block.content || ''}
                            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                            placeholder="Image URL..."
                          />
                        )}
                        {block.type === 'list' && (
                          <textarea
                            value={block.content || ''}
                            onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none font-mono text-xs"
                            placeholder="Item 1\nItem 2\nItem 3"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(index)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Remove block"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddBlock}
                    className="w-full py-2 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span> Add Content Block
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingPage.id ? 'Save Changes' : 'Create Page')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaticPagesSection;