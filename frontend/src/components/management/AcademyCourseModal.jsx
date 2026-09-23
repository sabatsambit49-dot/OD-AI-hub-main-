import React, { useState, useEffect } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';

const AcademyCourseModal = ({ isOpen, onClose, course, categories, onSaved, setToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    group_label: '',
    target_audience: '',
    duration_value: 8,
    duration_unit: 'weeks',
    mode: 'online',
    price: 0,
    discount_price: '',
    is_free: false,
    batch_size: 30,
    short_description: '',
    full_description: '',
    highlights: [''],
    prerequisites: '',
    certificate_included: true,
    image_url: '',
    is_featured: false,
    status: 'published',
    display_order: 0,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || course.name || '',
        slug: course.slug || '',
        category_id: course.category_id || (categories[0]?.id || ''),
        group_label: course.group_label || '',
        target_audience: course.target_audience || '',
        duration_value: course.duration_value || 8,
        duration_unit: course.duration_unit || 'weeks',
        mode: course.mode || 'online',
        price: course.price !== undefined ? course.price : 0,
        discount_price: course.discount_price !== null && course.discount_price !== undefined ? course.discount_price : '',
        is_free: Boolean(course.is_free),
        batch_size: course.batch_size || 30,
        short_description: course.short_description || course.description || '',
        full_description: course.full_description || '',
        highlights: course.highlights?.length ? course.highlights : [''],
        prerequisites: course.prerequisites || '',
        certificate_included: course.certificate_included !== false,
        image_url: course.image_url || '',
        is_featured: Boolean(course.is_featured),
        status: course.status || 'draft',
        display_order: course.display_order || 0,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category_id: categories[0]?.id || '',
        group_label: '',
        target_audience: '',
        duration_value: 8,
        duration_unit: 'weeks',
        mode: 'online',
        price: 4999,
        discount_price: 3999,
        is_free: false,
        batch_size: 30,
        short_description: '',
        full_description: '',
        highlights: [''],
        prerequisites: 'Basic computer literacy and enthusiasm to learn.',
        certificate_included: true,
        image_url: '',
        is_featured: false,
        status: 'published',
        display_order: 0,
      });
    }
    setErrors({});
  }, [course, categories, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const updates = { title: val };
    if (!course) {
      updates.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleHighlightChange = (index, value) => {
    const next = [...formData.highlights];
    next[index] = value;
    setFormData(prev => ({ ...prev, highlights: next }));
  };

  const addHighlight = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index) => {
    const next = formData.highlights.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, highlights: next.length ? next : [''] }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
    if (!formData.target_audience.trim()) errs.target_audience = 'Target audience is required (who the course is for)';
    if (!formData.duration_value || Number(formData.duration_value) <= 0) {
      errs.duration_value = 'Duration must be a positive number';
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      errs.price = 'Price cannot be negative';
    }
    if (formData.discount_price !== '' && formData.discount_price !== null) {
      const discNum = Number(formData.discount_price);
      if (isNaN(discNum) || discNum < 0) {
        errs.discount_price = 'Discount price cannot be negative';
      } else if (discNum >= priceNum && priceNum > 0) {
        errs.discount_price = 'Discount price must be strictly below regular price';
      }
    }
    if (formData.batch_size !== '' && Number(formData.batch_size) < 1) {
      errs.batch_size = 'Batch size / seats must be at least 1';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        duration_value: Number(formData.duration_value),
        price: formData.is_free ? 0 : Number(formData.price),
        discount_price: formData.is_free || formData.discount_price === '' ? null : Number(formData.discount_price),
        batch_size: formData.batch_size ? Number(formData.batch_size) : null,
        display_order: Number(formData.display_order),
        highlights: formData.highlights.filter(h => h.trim().length > 0),
      };

      if (course) {
        await academyAdminApi.updateCourse(course.id, payload);
        setToast({ message: 'Course updated successfully', type: 'success' });
      } else {
        await academyAdminApi.createCourse(payload);
        setToast({ message: 'Course created successfully', type: 'success' });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to save course';
      setToast({ message: typeof msg === 'string' ? msg : JSON.stringify(msg), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full border border-outline-variant/30 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-high/40 rounded-t-2xl">
          <h2 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_stories</span>
            {course ? 'Edit Academy Course' : 'Create New Academy Course'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm font-body">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. AI Explorers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. ai-explorers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            </div>
          </div>

          {/* Row 2: Category & Group Label */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                Academy Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                Group Label (Chip Filter)
              </label>
              <input
                type="text"
                value={formData.group_label}
                onChange={(e) => setFormData({ ...formData, group_label: e.target.value })}
                placeholder="e.g. Class 5-7, B.Tech, BCA, MCA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Row 3: Target Audience (WHO the course is for) */}
          <div>
            <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
              Target Audience (WHO the course is for) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder="e.g. Class 5 to 7 students curious about computers"
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            {errors.target_audience && <p className="text-red-500 text-xs mt-1">{errors.target_audience}</p>}
          </div>

          {/* Row 4: Duration & Mode & Batch Size */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                Duration Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.duration_value}
                onChange={(e) => setFormData({ ...formData, duration_value: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              />
              {errors.duration_value && <p className="text-red-500 text-xs mt-1">{errors.duration_value}</p>}
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Duration Unit</label>
              <select
                value={formData.duration_unit}
                onChange={(e) => setFormData({ ...formData, duration_unit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              >
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="hours">Hours</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Delivery Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Batch Size / Seats</label>
              <input
                type="number"
                min="1"
                value={formData.batch_size}
                onChange={(e) => setFormData({ ...formData, batch_size: e.target.value })}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              />
              {errors.batch_size && <p className="text-red-500 text-xs mt-1">{errors.batch_size}</p>}
            </div>
          </div>

          {/* Row 5: Pricing (Price & Discount Price & Is Free) */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label text-sm font-bold text-on-surface">Course Pricing & Discount</span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                />
                Mark as Free Course
              </label>
            </div>

            {!formData.is_free && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                    Regular Price (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">
                    Discount Price (Optional, must be &lt; Regular Price)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="e.g. 3999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
                  />
                  {errors.discount_price && <p className="text-red-500 text-xs mt-1">{errors.discount_price}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Descriptions */}
          <div>
            <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Short Description</label>
            <textarea
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief 1-2 sentence overview displayed on course cards."
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Full Description</label>
            <textarea
              rows={3}
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="In-depth syllabus overview, learning outcomes, and module descriptions."
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
            />
          </div>

          {/* Row 7: Highlights / Syllabus bullet points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-label text-xs font-semibold text-on-surface">Highlights / Key Syllabus Topics</label>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                + Add Highlight
              </button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleHighlightChange(i, e.target.value)}
                    placeholder={`Highlight #${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none text-xs"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(i)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Row 8: Prerequisites & Status & Display Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none font-semibold"
              >
                <option value="draft">Draft (Hidden from public site)</option>
                <option value="published">Published (Visible on site)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface">
                <input
                  type="checkbox"
                  checked={formData.certificate_included}
                  onChange={(e) => setFormData({ ...formData, certificate_included: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                />
                Certificate Included
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-600">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-outline-variant text-amber-600 focus:ring-amber-600 w-4 h-4"
                />
                Mark as Featured
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : course ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademyCourseModal;
