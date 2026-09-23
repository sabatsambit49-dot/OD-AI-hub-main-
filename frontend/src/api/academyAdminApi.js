import api from './client';

export const academyAdminApi = {
  // Categories
  getCategories: async () => {
    const res = await api.get('/admin/academy/categories');
    return res.data;
  },
  getCategory: async (id) => {
    const res = await api.get(`/admin/academy/categories/${id}`);
    return res.data;
  },
  createCategory: async (data) => {
    const res = await api.post('/admin/academy/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await api.put(`/admin/academy/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/academy/categories/${id}`);
    return res.data;
  },

  // Courses
  getCourses: async (params = {}) => {
    const res = await api.get('/admin/academy/courses', { params });
    return res.data;
  },
  getCourse: async (id) => {
    const res = await api.get(`/admin/academy/courses/${id}`);
    return res.data;
  },
  createCourse: async (data) => {
    const res = await api.post('/admin/academy/courses', data);
    return res.data;
  },
  updateCourse: async (id, data) => {
    const res = await api.put(`/admin/academy/courses/${id}`, data);
    return res.data;
  },
  deleteCourse: async (id) => {
    const res = await api.delete(`/admin/academy/courses/${id}`);
    return res.data;
  },
  duplicateCourse: async (id) => {
    const res = await api.post(`/admin/academy/courses/${id}/duplicate`);
    return res.data;
  },
  setCourseStatus: async (id, status) => {
    const res = await api.patch(`/admin/academy/courses/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  },
  toggleCourseFeatured: async (id) => {
    const res = await api.patch(`/admin/academy/courses/${id}/featured`);
    return res.data;
  },

  // Enquiries
  getEnquiries: async (params = {}) => {
    const res = await api.get('/admin/academy/enquiries', { params });
    return res.data;
  },
  getEnquiry: async (id) => {
    const res = await api.get(`/admin/academy/enquiries/${id}`);
    return res.data;
  },
  updateEnquiryStatus: async (id, status) => {
    const res = await api.patch(`/admin/academy/enquiries/${id}/status`, { status });
    return res.data;
  },
  downloadEnquiriesCsv: async (status = 'all') => {
    const res = await api.get('/admin/academy/enquiries/export/csv', {
      params: status !== 'all' ? { status } : {},
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries_${status}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
