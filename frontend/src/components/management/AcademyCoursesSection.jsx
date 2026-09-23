import React, { useState, useEffect } from 'react';
import { academyAdminApi } from '../../api/academyAdminApi';
import AcademyCourseModal from './AcademyCourseModal';

const AcademyCoursesSection = ({ isAdmin, isEditor, setToast }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [sortBy, setSortBy] = useState('display_order');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await academyAdminApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        sort_by: sortBy,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedMode) params.mode = selectedMode;

      const data = await academyAdminApi.getCourses(params);
      setCourses(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch courses', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedStatus, selectedMode, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleDuplicate = async (courseId) => {
    try {
      await academyAdminApi.duplicateCourse(courseId);
      setToast({ message: 'Course duplicated as Draft', type: 'success' });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to duplicate course', type: 'error' });
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      await academyAdminApi.setCourseStatus(courseId, newStatus);
      setToast({ message: `Course status changed to ${newStatus}`, type: 'success' });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Status update failed', type: 'error' });
    }
  };

  const handleToggleFeatured = async (courseId) => {
    try {
      await academyAdminApi.toggleCourseFeatured(courseId);
      setToast({ message: 'Featured status updated', type: 'success' });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to toggle featured status', type: 'error' });
    }
  };

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await academyAdminApi.deleteCourse(courseId);
      setToast({ message: 'Course deleted', type: 'success' });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete course', type: 'error' });
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
      {/* Top Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title, audience, group..."
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

        {/* Action Button */}
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Course
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="display_order">Display Order</option>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Course List / Cards */}
      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">menu_book</span>
          <p className="font-semibold">No courses found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const cat = categories.find((c) => c.id === course.category_id);
            const accent = cat?.accent_color || '#0082ff';

            return (
              <div
                key={course.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Accent Top Border Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: accent }}
                />

                <div>
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: accent }}
                    >
                      {cat?.name || 'Academy'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {course.is_featured && (
                        <span className="text-amber-500 font-bold text-sm" title="Featured Course">
                          ★
                        </span>
                      )}
                      {getStatusBadge(course.status)}
                    </div>
                  </div>

                  {/* Course Title & Group */}
                  <h3 className="font-headline font-bold text-base text-on-surface mb-1">
                    {course.title || course.name}
                  </h3>

                  {course.group_label && (
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-surface-container text-on-surface-variant mb-2">
                      {course.group_label}
                    </span>
                  )}

                  {/* Target Audience */}
                  <p className="text-xs text-on-surface-variant mb-3">
                    <strong className="text-on-surface">For:</strong> {course.target_audience}
                  </p>

                  {/* Duration & Mode Badges */}
                  <div className="flex flex-wrap gap-1.5 text-xs font-medium text-on-surface-variant mb-3">
                    <span className="bg-surface-container-high px-2 py-1 rounded-md">
                      ⏱ {course.duration_value} {course.duration_unit}
                    </span>
                    <span className="bg-surface-container-high px-2 py-1 rounded-md capitalize">
                      📍 {course.mode}
                    </span>
                    {course.batch_size && (
                      <span className="bg-surface-container-high px-2 py-1 rounded-md">
                        👥 {course.batch_size} seats
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-headline font-extrabold text-lg text-primary">
                      {course.price_display}
                    </span>
                    {course.discount_display && (
                      <span className="text-xs text-on-surface-variant line-through">
                        {course.price_display}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                {isEditor && (
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(course)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold transition-colors"
                        title="Edit Course"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDuplicate(course.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-semibold transition-colors"
                        title="Duplicate as Draft"
                      >
                        Duplicate
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(course.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          course.is_featured ? 'text-amber-500 hover:text-amber-600' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        title={course.is_featured ? 'Unmark Featured' : 'Mark as Featured'}
                      >
                        ★
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {course.status !== 'published' && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'published')}
                          className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 font-bold"
                          title="Publish Course"
                        >
                          Publish
                        </button>
                      )}
                      {course.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(course.id, 'draft')}
                          className="px-2 py-1 rounded-md bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 font-bold"
                          title="Unpublish (Set to Draft)"
                        >
                          Unpublish
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(course.id, course.title || course.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Course"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      <AcademyCourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        course={editingCourse}
        categories={categories}
        onSaved={fetchCourses}
        setToast={setToast}
      />
    </div>
  );
};

export default AcademyCoursesSection;
