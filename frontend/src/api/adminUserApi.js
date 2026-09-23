import api from './client';

export const adminUserApi = {
  fetchActiveUsers: async () => {
    const response = await api.get('/admin/users/active');
    return response.data;
  },
  revokeUserSession: async (jti) => {
    const response = await api.post('/admin/users/revoke', { jti });
    return response.data;
  },
  revokeAllUserSessions: async (userId) => {
    const response = await api.post(`/admin/users/revoke-all/${userId}`);
    return response.data;
  },
  fetchAllUsersWithStatus: async () => {
    const response = await api.get('/admin/users/all');
    return response.data;
  },
  deleteUserAccount: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
};
