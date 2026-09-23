import React, { useState, useEffect } from 'react';
import { websiteAdminApi } from '../../../api/websiteAdminApi';

const TeamMembersSection = ({ isEditor, isAdmin, setToast }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await websiteAdminApi.getTeamMembers(params);
      setMembers(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch team members', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filterStatus, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleCreate = () => {
    setEditingMember({
      name: '',
      role: '',
      photo_url: '',
      bio: '',
      display_order: members.length + 1,
      status: 'draft',
    });
  };

  const handleEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await websiteAdminApi.deleteTeamMember(id);
      setToast({ message: 'Team member deleted', type: 'success' });
      fetchMembers();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete team member', type: 'error' });
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: editingMember.name,
        role: editingMember.role,
        photo_url: editingMember.photo_url,
        bio: editingMember.bio,
        display_order: Number(editingMember.display_order),
        status: editingMember.status,
      };
      if (editingMember.id) {
        await websiteAdminApi.updateTeamMember(editingMember.id, data);
      } else {
        await websiteAdminApi.createTeamMember(data);
      }
      setToast({ message: editingMember.id ? 'Team member updated successfully' : 'Team member created successfully', type: 'success' });
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      setToast({ message: editingMember.id ? 'Failed to update team member' : 'Failed to create team member', type: 'error' });
    } finally {
      setSaving(false);
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
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Team Members</h2>
          <p className="text-xs text-on-surface-variant">
            Manage team members for the /our-team page.
          </p>
        </div>
        {isEditor && (
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Member
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
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-on-surface-variant font-semibold mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-variant">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/60">person</span>
          <p className="font-semibold">No team members found</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">Click "Add Member" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      member.name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">{member.name}</h3>
                    <p className="text-xs text-on-surface-variant">{member.role}</p>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {member.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2">
                  <span className="bg-surface-container px-2 py-1 rounded-md">
                    Order: {member.display_order}
                  </span>
                  {getStatusBadge(member.status)}
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-outline-variant/20 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
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

      {/* Create/Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              {editingMember.id ? `Edit Member: ${editingMember.name}` : 'Add New Team Member'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs font-body">
              <div>
                <label className="block font-semibold mb-1">Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo URL</label>
                <input
                  type="url"
                  value={editingMember.photo_url || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, photo_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingMember.display_order || 0}
                    onChange={(e) => setEditingMember({ ...editingMember, display_order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  />
                </div>
                <div className="pt-4">
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingMember.id ? 'Save Changes' : 'Create Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersSection;