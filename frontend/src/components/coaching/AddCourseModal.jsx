import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

const AddCourseModal = ({ isOpen, onClose, onSuccess, coachingId, initialData }) => {
  const { isEditor } = useAuth();
  const [formData, setFormData] = useState({
    course_name: '',
    price: '',
    description: '',
    syllabus_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          course_name: initialData.course_name || '',
          price: initialData.price !== undefined ? initialData.price : '',
          description: initialData.description || '',
          syllabus_url: initialData.syllabus_url || ''
        });
      } else {
        setFormData({ course_name: '', price: '', description: '', syllabus_url: '' });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_name.trim()) {
      setError('Course name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { addCourse, updateCourse } = await import('../../api/coachingApi');
      const payload = {
        course_name: formData.course_name,
        price: formData.price ? parseFloat(formData.price) : undefined,
        description: formData.description || undefined,
        syllabus_url: formData.syllabus_url || undefined
      };
      if (initialData) {
        await updateCourse(coachingId, initialData.id, payload);
      } else {
        await addCourse(coachingId, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Course' : 'Add New Course'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            Course Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            placeholder="Enter course name"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price (optional)"
            min="0"
            step="0.01"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            rows={3}
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            Syllabus URL
          </label>
          <input
            type="url"
            name="syllabus_url"
            value={formData.syllabus_url}
            onChange={handleChange}
            placeholder="https://example.com/syllabus.pdf"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <p className="text-xs text-on-surface-variant mt-1">Link to syllabus PDF or webpage</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-label font-semibold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isEditor}
            className="px-5 py-2.5 rounded-xl font-label font-semibold text-on-primary bg-primary hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Course')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCourseModal;