import React, { useState, useEffect } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';

const AcademyCategoriesSection = ({ isEditor, isAdmin, setToast }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await academyAdminApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch categories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (cat) => {
    setEditingCategory({ ...cat });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await academyAdminApi.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        tagline: editingCategory.tagline,
        description: editingCategory.description,
        accent_color: editingCategory.accent_color,
        icon_letter: editingCategory.icon_letter,
        image_url: editingCategory.image_url,
        display_order: Number(editingCategory.display_order),
        is_active: Boolean(editingCategory.is_active),
      });
      setToast({ message: 'Category updated successfully', type: 'success' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update category', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">OD AI Academy Categories</h2>
          <p className="text-xs text-on-surface-variant">
            Manage the 6 foundational program pillars, accent colors, taglines, and display order.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: cat.accent_color }}
              />

              <div>
                <div className="flex items-center gap-3 mb-3 pt-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-headline font-extrabold text-white text-base shadow-sm"
                    style={{ backgroundColor: cat.accent_color }}
                  >
                    {cat.icon_letter}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">{cat.name}</h3>
                    <p className="text-xs font-semibold" style={{ color: cat.accent_color }}>
                      {cat.tagline || 'Learn and lead'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {cat.display_order}
                  </span>
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Slug: #{cat.slug}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md font-bold ${
                      cat.is_active ? 'bg-emerald-500/15 text-emerald-700' : 'bg-gray-500/15 text-gray-700'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit Category
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">category</span>
              Edit Category: {editingCategory.name}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingCategory.tagline || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Accent Color (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingCategory.accent_color || '#0082ff'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, accent_color: e.target.value })}
                      className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingCategory.accent_color || '#0082ff'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, accent_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Icon Letter</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={editingCategory.icon_letter || 'A'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon_letter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCategory.display_order || 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(editingCategory.is_active)}
                      onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Active on Website
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyCategoriesSection;
