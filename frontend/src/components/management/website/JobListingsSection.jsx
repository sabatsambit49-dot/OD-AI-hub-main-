import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const JobListingsSection = ({ isEditor, isAdmin, setToast }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus === 'open') params.is_open = true;
      else if (filterStatus === 'closed') params.is_open = false;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getJobListings(params);
      setJobs(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch job listings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleCreate = () => {
    setEditingJob({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      description: '',
      is_open: true,
      display_order: jobs.length + 1,
    });
  };

  const handleEdit = (job) => {
    setEditingJob({ ...job });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteJobListing(id);
      setToast({ message: 'Job listing deleted', type: 'success' });
      fetchJobs();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete job listing', type: 'error' });
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title: editingJob.title,
        department: editingJob.department,
        location: editingJob.location,
        type: editingJob.type,
        description: editingJob.description,
        is_open: editingJob.is_open,
        display_order: Number(editingJob.display_order),
      };
      if (editingJob.id) {
        await websiteAdminApi.updateJobListing(editingJob.id, data);
      } else {
        await websiteAdminApi.createJobListing(data);
      }
      setToast({ message: editingJob.id ? 'Job listing updated successfully' : 'Job listing created successfully', type: 'success' });
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      setToast({ message: editingJob.id ? 'Failed to update job listing' : 'Failed to create job listing', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      'full-time': 'bg-blue-500/15 text-blue-700',
      'part-time': 'bg-purple-500/15 text-purple-700',
      contract: 'bg-green-500/15 text-green-700',
      internship: 'bg-orange-500/15 text-orange-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[type] || 'bg-gray-500/15 text-gray-700'}`}>
        {type.replace('-', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Job Listings</h2>
          <p className="text-xs text-on-surface-variant">
            Manage job openings for the /careers page.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs font-medium">
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, department..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading job listings...</div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">work</span>
          <p className="font-semibold">No job listings found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Job" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold text-base text-on-surface">{job.title}</h3>
                  {getTypeBadge(job.type)}
                </div>

                {job.department && (
                  <p className="text-xs text-on-surface-variant mb-2">
                    Department: {job.department}
                  </p>
                )}

                {job.location && (
                  <p className="text-xs text-on-surface-variant mb-2">
                    Location: {job.location}
                  </p>
                )}

                {job.description && (
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                    {job.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {job.display_order}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    job.is_open ? 'bg-emerald-500/15 text-emerald-700' : 'bg-gray-500/15 text-gray-700'
                  }`}>
                    {job.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
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

      {/* Create/Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">work</span>
              {editingJob.id ? `Edit Job: ${editingJob.title}` : 'Add New Job Listing'}
            </h3>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingJob.title || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={editingJob.department || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingJob.is_open}
                      onChange={(e) => setEditingJob({ ...editingJob, is_open: e.target.checked })}
                      className="w-4 h-4 rounded text-primary"
                    />
                    Open Position
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingJob.display_order || 0}
                    onChange={(e) => setEditingJob({ ...editingJob, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingJob.id ? 'Save Changes' : 'Create Job')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingsSection;