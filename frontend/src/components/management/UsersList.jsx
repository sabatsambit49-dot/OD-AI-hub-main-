import React, { useEffect, useState } from 'react';
import { adminUserApi } from '../../api/adminUserApi';

const UsersList = ({ setToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminUserApi.fetchActiveUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setToast && setToast({ message: err.response?.data?.detail || 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async (jti) => {
    try {
      await adminUserApi.revokeUserSession(jti);
      setToast && setToast({ message: 'User session revoked', type: 'success' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setToast && setToast({ message: err.response?.data?.detail || 'Failed to revoke session', type: 'error' });
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-primary">Loading active users...</div>;
  }

  if (users.length === 0) {
    return <div className="p-6 text-center text-on-surface-variant">No active user sessions.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-wider">
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4">Login Time</th>
            <th className="p-4">Expires At</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20 font-body text-sm">
          {users.map((u) => (
            <tr key={u.jti} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="p-4 font-semibold text-on-surface">{u.username}</td>
              <td className="p-4 text-on-surface-variant">{u.email}</td>
              <td className="p-4 text-on-surface-variant">{new Date(u.created_at).toLocaleString()}</td>
              <td className="p-4 text-on-surface-variant">{new Date(u.expires_at).toLocaleString()}</td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleLogout(u.jti)}
                  className="px-3 py-1 bg-error text-on-error rounded-md hover:bg-error-dark transition-colors"
                >
                  Logout
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
