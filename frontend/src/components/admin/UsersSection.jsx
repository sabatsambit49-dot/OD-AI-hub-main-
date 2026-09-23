import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminUserApi } from '../../api/adminUserApi';
import Toast from '../common/Toast';

const UsersSection = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [subTab, setSubTab] = useState('active'); // 'active' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const fetchSessionData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [sessions, users] = await Promise.all([
        adminUserApi.fetchActiveUsers().catch(err => {
          console.error("Failed to fetch active users", err);
          return [];
        }),
        adminUserApi.fetchAllUsersWithStatus().catch(err => {
          console.error("Failed to fetch all users", err);
          return [];
        })
      ]);
      setActiveSessions(sessions || []);
      setAllUsers(users || []);
    } catch (err) {
      console.error(err);
      if (!isSilent) {
        setToast({ message: "Failed to fetch user sessions", type: "error" });
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  // Auto-refresh interval (every 15 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchSessionData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchSessionData]);

  const handleRevokeSession = async (jti, username) => {
    setActionLoading(jti);
    try {
      await adminUserApi.revokeUserSession(jti);
      setToast({ message: `Successfully logged out ${username}`, type: "success" });
      await fetchSessionData(true);
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.detail || "Failed to revoke session", type: "error" });
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleRevokeAllSessions = async (userId, username) => {
    setActionLoading(`all-${userId}`);
    try {
      const res = await adminUserApi.revokeAllUserSessions(userId);
      setToast({ message: res.detail || `Terminated all sessions for ${username}`, type: "success" });
      await fetchSessionData(true);
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.detail || "Failed to revoke all sessions", type: "error" });
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const handleDeleteUserAccount = async (userId, username) => {
    setActionLoading(`delete-${userId}`);
    try {
      await adminUserApi.deleteUserAccount(userId);
      setToast({ message: `User account ${username} removed`, type: "success" });
      await fetchSessionData(true);
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.detail || "Failed to delete user account", type: "error" });
    } finally {
      setActionLoading(null);
      setConfirmModal(null);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString.endsWith('Z') ? isoString : isoString + 'Z');
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString.endsWith('Z') ? isoString : isoString + 'Z');
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const getTimeAgo = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString.endsWith('Z') ? isoString : isoString + 'Z');
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return '';
    }
  };

  // Filtered lists
  const filteredSessions = activeSessions.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.username?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.role?.toLowerCase().includes(q);
  });

  const filteredUsers = allUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const uniqueActiveUserIds = new Set(activeSessions.map(s => s.user_id));

  if (!isAdmin) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined text-4xl text-amber-500 mb-2">lock</span>
        <h2 className="text-xl font-bold text-on-surface">Admin Access Required</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Only users with the <span className="font-semibold text-primary">admin</span> role can monitor logged-in users and manage active sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sensors</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{activeSessions.length}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sessions
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{uniqueActiveUserIds.size}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">
              Online Users
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-on-surface">{allUsers.length}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">
              Registered Accounts
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Live Sync</div>
            <div className="text-sm font-bold text-on-surface mt-0.5">
              {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                autoRefresh
                  ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
              title={autoRefresh ? "Click to pause auto-refresh" : "Click to enable auto-refresh"}
            >
              <span className="material-symbols-outlined text-lg">{autoRefresh ? 'sync' : 'sync_disabled'}</span>
            </button>
            <button
              onClick={() => fetchSessionData(false)}
              disabled={loading}
              className="bg-primary hover:bg-primary-container text-on-primary p-2 rounded-xl shadow-sm transition-all"
              title="Refresh now"
            >
              <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control bar: Sub-tabs and Search */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Sub-tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('active')}
            className={`px-4 py-2 rounded-xl font-label text-sm font-bold flex items-center gap-2 transition-all ${
              subTab === 'active'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">wifi_tethering</span>
            Active Logged-in Users ({activeSessions.length})
          </button>
          <button
            onClick={() => setSubTab('all')}
            className={`px-4 py-2 rounded-xl font-label text-sm font-bold flex items-center gap-2 transition-all ${
              subTab === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">manage_accounts</span>
            All Registered Accounts ({allUsers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            placeholder="Search by username, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface text-on-surface border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-primary">
            <span className="material-symbols-outlined animate-spin text-4xl mb-2">progress_activity</span>
            <p className="text-sm font-semibold text-on-surface-variant">Loading live user sessions...</p>
          </div>
        ) : subTab === 'active' ? (
          filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">person_off</span>
              <h3 className="text-lg font-bold text-on-surface">No Active Sessions Found</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                {searchQuery ? "No sessions match your search query." : "There are currently no active logged-in user sessions."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Logged In</th>
                    <th className="p-4">Session Expiry</th>
                    <th className="p-4">Session ID</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
                  {filteredSessions.map((session) => {
                    const isCurrent = session.is_current_session || (session.username === currentUser?.username);
                    return (
                      <tr key={session.jti} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-base shadow-sm">
                              {session.username ? session.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface flex items-center gap-2">
                                {session.username}
                                {isCurrent && (
                                  <span className="bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-on-surface-variant">{session.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-label text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                              session.role === 'admin'
                                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                                : session.role === 'editor'
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                : 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30'
                            }`}
                          >
                            {session.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Online
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-on-surface">{getTimeAgo(session.created_at)}</div>
                          <div className="text-xs text-on-surface-variant font-mono">
                            {formatDate(session.created_at)} {formatTime(session.created_at)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-on-surface-variant font-mono">
                            {formatDate(session.expires_at)} {formatTime(session.expires_at)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                            {session.jti ? session.jti.substring(0, 8) + '...' : '-'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isCurrent ? (
                            <span className="text-xs font-semibold text-on-surface-variant/70 italic px-2 py-1">
                              Active Session
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmModal({
                                type: 'revoke_single',
                                title: `Remove / Log Out ${session.username}`,
                                message: `Are you sure you want to forcibly log out ${session.username}? Their session will be invalidated immediately.`,
                                onConfirm: () => handleRevokeSession(session.jti, session.username)
                              })}
                              disabled={actionLoading === session.jti}
                              className="inline-flex items-center gap-1.5 bg-error/10 hover:bg-error/20 text-error font-label text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                              title="Force log out this user session"
                            >
                              <span className="material-symbols-outlined text-base">
                                {actionLoading === session.jti ? 'progress_activity' : 'logout'}
                              </span>
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">group_off</span>
              <h3 className="text-lg font-bold text-on-surface">No User Accounts Found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Online Status</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
                  {filteredUsers.map((u) => {
                    const isSelf = u.username === currentUser?.username;
                    return (
                      <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-base shadow-sm">
                              {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface flex items-center gap-2">
                                {u.username}
                                {isSelf && (
                                  <span className="bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-on-surface-variant">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-label text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                                : u.role === 'editor'
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                : 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.is_online ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              Online ({u.active_sessions_count} session{u.active_sessions_count > 1 ? 's' : ''})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant">
                              <span className="w-2 h-2 rounded-full bg-on-surface-variant/40"></span>
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-on-surface-variant font-mono">
                            {formatDate(u.created_at)}
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {u.is_online && !isSelf && (
                            <button
                              onClick={() => setConfirmModal({
                                type: 'revoke_all',
                                title: `Log Out All Sessions for ${u.username}`,
                                message: `This will disconnect all ${u.active_sessions_count} active sessions for ${u.username}.`,
                                onConfirm: () => handleRevokeAllSessions(u.id, u.username)
                              })}
                              disabled={actionLoading === `all-${u.id}`}
                              className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-label text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                              title="Log out all active sessions"
                            >
                              <span className="material-symbols-outlined text-base">logout</span>
                              Disconnect
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              onClick={() => setConfirmModal({
                                type: 'delete_user',
                                title: `Delete Account: ${u.username}`,
                                message: `Are you sure you want to permanently delete the account for ${u.username}? This action cannot be undone.`,
                                onConfirm: () => handleDeleteUserAccount(u.id, u.username)
                              })}
                              disabled={actionLoading === `delete-${u.id}`}
                              className="inline-flex items-center gap-1 bg-error/10 hover:bg-error/20 text-error font-label text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                              title="Delete this user account"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error/15 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{confirmModal.title}</h3>
                <div className="text-xs text-on-surface-variant font-semibold">Admin action confirmation</div>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-label font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl text-sm font-label font-bold bg-error text-on-error hover:bg-error/90 transition-colors shadow-sm"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UsersSection;
