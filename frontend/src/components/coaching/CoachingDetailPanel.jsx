import React, { useState, useEffect } from 'react';
import { BookOpen, IndianRupee, FileText, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AddCourseModal from './AddCourseModal';

const CoachingDetailPanel = ({ coaching, onClose, onRefresh }) => {
  const { isEditor, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { fetchCoachingDetail } = await import('../../api/coachingApi');
        const data = await fetchCoachingDetail(coaching.id);
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [coaching.id, onRefresh]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const { deleteCourse } = await import('../../api/coachingApi');
      await deleteCourse(coaching.id, courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
      alert('Failed to delete course');
    }
  };

  const handleCourseSaved = () => {
    setCourseModalOpen(false);
    setEditingCourse(null);
    // Trigger refresh by re-fetching
    const { fetchCoachingDetail } = require('../../api/coachingApi');
    fetchCoachingDetail(coaching.id).then(data => setCourses(data.courses || []));
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-lg overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-6 bg-surface-container-low/60 border-b border-outline-variant/30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-on-surface">{coaching.name}</h3>
            <div className="flex items-center gap-3 mt-1 text-on-surface-variant text-sm font-label">
              {coaching.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {coaching.city}
                </span>
              )}
              {coaching.address && <span>{coaching.address}</span>}
              {coaching.phone && <span className="flex items-center gap-1">{coaching.phone}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditor && (
            <button
              onClick={handleAddCourse}
              className="bg-primary text-on-primary px-4 py-2 rounded-xl font-label font-semibold flex items-center gap-2 hover:bg-primary-container transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="divide-y divide-outline-variant/20">
        {loading ? (
          <div className="p-12 text-center text-primary">
            <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            <p className="mt-2 font-label">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h4 className="font-headline text-lg font-semibold text-on-surface-variant mb-2">No Courses Yet</h4>
            <p className="text-on-surface-variant/60 font-body">
              {isEditor ? 'Click "Add Course" to add the first course.' : 'This coaching center has no courses listed yet.'}
            </p>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="p-6 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-headline font-semibold text-on-surface text-lg mb-2">{course.course_name}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-label text-on-surface-variant">
                    {course.price !== null && course.price !== undefined && (
                      <span className="flex items-center gap-1.5 font-semibold text-primary">
                        <IndianRupee className="w-4 h-4" />
                        {course.price.toLocaleString('en-IN')}
                      </span>
                    )}
                    {course.description && (
                      <span className="flex items-center gap-1.5 max-w-xs truncate">
                        <FileText className="w-4 h-4" />
                        {course.description}
                      </span>
                    )}
                    {course.syllabus_url && (
                      <a
                        href={course.syllabus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-primary hover:underline font-semibold"
                      >
                        <FileText className="w-4 h-4" />
                        View Syllabus
                      </a>
                    )}
                  </div>
                </div>
                {(isEditor || isAdmin) && (
                  <div className="flex items-center gap-2">
                    {isEditor && (
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {courseModalOpen && (
        <AddCourseModal
          isOpen={courseModalOpen}
          onClose={() => {
            setCourseModalOpen(false);
            setEditingCourse(null);
          }}
          onSuccess={handleCourseSaved}
          coachingId={coaching.id}
          initialData={editingCourse}
        />
      )}
    </div>
  );
};

export default CoachingDetailPanel;