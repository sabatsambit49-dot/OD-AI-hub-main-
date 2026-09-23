import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

const AddCollegeModal = ({ isOpen, onClose, onSuccess, allCourses }) => {
  const { isEditor } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    courses_offered: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', city: '', courses_offered: [] });
      setError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        courses_offered: checked
          ? [...prev.courses_offered, value]
          : prev.courses_offered.filter(c => c !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('College name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { addCollege } = await import('../../api/courseMatrixApi');
      await addCollege(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add college');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New College" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-label">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            College Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter college name"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city (optional)"
            className="w-full bg-surface text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-label font-bold text-on-surface mb-3">
            Courses Offered
          </label>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 max-h-60 overflow-y-auto">
            {allCourses.length === 0 ? (
              <p className="text-on-surface-variant text-sm text-center py-4">No courses available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allCourses.map(course => (
                  <label key={course} className="flex items-center gap-2 cursor-pointer text-on-surface text-sm font-body hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      name="courses_offered"
                      value={course}
                      checked={formData.courses_offered.includes(course)}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary border-outline rounded focus:ring-primary accent-primary"
                    />
                    <span>{course}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
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
            {loading ? 'Adding...' : 'Add College'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCollegeModal;