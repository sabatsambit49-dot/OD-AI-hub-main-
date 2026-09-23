import api from './client';

export const websiteAdminApi = {
  // Pillars
  getPillars: async (params = {}) => {
    const res = await api.get('/admin/website/pillars', { params });
    return res.data;
  },
  getPillar: async (id) => {
    const res = await api.get(`/admin/website/pillars/${id}`);
    return res.data;
  },
  createPillar: async (data) => {
    const res = await api.post('/admin/website/pillars', data);
    return res.data;
  },
  updatePillar: async (id, data) => {
    const res = await api.put(`/admin/website/pillars/${id}`, data);
    return res.data;
  },
  deletePillar: async (id) => {
    const res = await api.delete(`/admin/website/pillars/${id}`);
    return res.data;
  },

  // Pillar Sections
  getPillarSections: async (params = {}) => {
    const res = await api.get('/admin/website/pillar-sections', { params });
    return res.data;
  },
  getPillarSection: async (id) => {
    const res = await api.get(`/admin/website/pillar-sections/${id}`);
    return res.data;
  },
  createPillarSection: async (data) => {
    const res = await api.post('/admin/website/pillar-sections', data);
    return res.data;
  },
  updatePillarSection: async (id, data) => {
    const res = await api.put(`/admin/website/pillar-sections/${id}`, data);
    return res.data;
  },
  deletePillarSection: async (id) => {
    const res = await api.delete(`/admin/website/pillar-sections/${id}`);
    return res.data;
  },

  // Offerings
  getOfferings: async (params = {}) => {
    const res = await api.get('/admin/website/offerings', { params });
    return res.data;
  },
  getOffering: async (id) => {
    const res = await api.get(`/admin/website/offerings/${id}`);
    return res.data;
  },
  createOffering: async (data) => {
    const res = await api.post('/admin/website/offerings', data);
    return res.data;
  },
  updateOffering: async (id, data) => {
    const res = await api.put(`/admin/website/offerings/${id}`, data);
    return res.data;
  },
  deleteOffering: async (id) => {
    const res = await api.delete(`/admin/website/offerings/${id}`);
    return res.data;
  },

  // Institution Audiences
  getInstitutionAudiences: async () => {
    const res = await api.get('/admin/website/institution-audiences');
    return res.data;
  },
  getInstitutionAudience: async (id) => {
    const res = await api.get(`/admin/website/institution-audiences/${id}`);
    return res.data;
  },
  createInstitutionAudience: async (data) => {
    const res = await api.post('/admin/website/institution-audiences', data);
    return res.data;
  },
  updateInstitutionAudience: async (id, data) => {
    const res = await api.put(`/admin/website/institution-audiences/${id}`, data);
    return res.data;
  },
  deleteInstitutionAudience: async (id) => {
    const res = await api.delete(`/admin/website/institution-audiences/${id}`);
    return res.data;
  },

  // Events
  getEvents: async (params = {}) => {
    const res = await api.get('/admin/website/events', { params });
    return res.data;
  },
  getEvent: async (id) => {
    const res = await api.get(`/admin/website/events/${id}`);
    return res.data;
  },
  createEvent: async (data) => {
    const res = await api.post('/admin/website/events', data);
    return res.data;
  },
  updateEvent: async (id, data) => {
    const res = await api.put(`/admin/website/events/${id}`, data);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/admin/website/events/${id}`);
    return res.data;
  },

  // Event Registrations
  getEventRegistrations: async (params = {}) => {
    const res = await api.get('/admin/website/event-registrations', { params });
    return res.data;
  },
  downloadEventRegistrationsCsv: async (eventId = null) => {
    const res = await api.get('/admin/website/event-registrations/export/csv', {
      params: eventId ? { event_id: eventId } : {},
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_registrations_${eventId || 'all'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Success Stories
  getSuccessStories: async (params = {}) => {
    const res = await api.get('/admin/website/success-stories', { params });
    return res.data;
  },
  getSuccessStory: async (id) => {
    const res = await api.get(`/admin/website/success-stories/${id}`);
    return res.data;
  },
  createSuccessStory: async (data) => {
    const res = await api.post('/admin/website/success-stories', data);
    return res.data;
  },
  updateSuccessStory: async (id, data) => {
    const res = await api.put(`/admin/website/success-stories/${id}`, data);
    return res.data;
  },
  deleteSuccessStory: async (id) => {
    const res = await api.delete(`/admin/website/success-stories/${id}`);
    return res.data;
  },

  // Blog Posts
  getBlogPosts: async (params = {}) => {
    const res = await api.get('/admin/website/blog-posts', { params });
    return res.data;
  },
  getBlogPost: async (id) => {
    const res = await api.get(`/admin/website/blog-posts/${id}`);
    return res.data;
  },
  createBlogPost: async (data) => {
    const res = await api.post('/admin/website/blog-posts', data);
    return res.data;
  },
  updateBlogPost: async (id, data) => {
    const res = await api.put(`/admin/website/blog-posts/${id}`, data);
    return res.data;
  },
  deleteBlogPost: async (id) => {
    const res = await api.delete(`/admin/website/blog-posts/${id}`);
    return res.data;
  },

  // Certificates
  getCertificates: async () => {
    const res = await api.get('/admin/website/certificates');
    return res.data;
  },
  getCertificate: async (id) => {
    const res = await api.get(`/admin/website/certificates/${id}`);
    return res.data;
  },
  createCertificate: async (data) => {
    const res = await api.post('/admin/website/certificates', data);
    return res.data;
  },
  updateCertificate: async (id, data) => {
    const res = await api.put(`/admin/website/certificates/${id}`, data);
    return res.data;
  },
  deleteCertificate: async (id) => {
    const res = await api.delete(`/admin/website/certificates/${id}`);
    return res.data;
  },

  // Static Pages
  getStaticPages: async () => {
    const res = await api.get('/admin/website/static-pages');
    return res.data;
  },
  getStaticPage: async (id) => {
    const res = await api.get(`/admin/website/static-pages/${id}`);
    return res.data;
  },
  createStaticPage: async (data) => {
    const res = await api.post('/admin/website/static-pages', data);
    return res.data;
  },
  updateStaticPage: async (id, data) => {
    const res = await api.put(`/admin/website/static-pages/${id}`, data);
    return res.data;
  },
  deleteStaticPage: async (id) => {
    const res = await api.delete(`/admin/website/static-pages/${id}`);
    return res.data;
  },

  // Team Members
  getTeamMembers: async (params = {}) => {
    const res = await api.get('/admin/website/team-members', { params });
    return res.data;
  },
  getTeamMember: async (id) => {
    const res = await api.get(`/admin/website/team-members/${id}`);
    return res.data;
  },
  createTeamMember: async (data) => {
    const res = await api.post('/admin/website/team-members', data);
    return res.data;
  },
  updateTeamMember: async (id, data) => {
    const res = await api.put(`/admin/website/team-members/${id}`, data);
    return res.data;
  },
  deleteTeamMember: async (id) => {
    const res = await api.delete(`/admin/website/team-members/${id}`);
    return res.data;
  },

  // Job Listings
  getJobListings: async (params = {}) => {
    const res = await api.get('/admin/website/job-listings', { params });
    return res.data;
  },
  getJobListing: async (id) => {
    const res = await api.get(`/admin/website/job-listings/${id}`);
    return res.data;
  },
  createJobListing: async (data) => {
    const res = await api.post('/admin/website/job-listings', data);
    return res.data;
  },
  updateJobListing: async (id, data) => {
    const res = await api.put(`/admin/website/job-listings/${id}`, data);
    return res.data;
  },
  deleteJobListing: async (id) => {
    const res = await api.delete(`/admin/website/job-listings/${id}`);
    return res.data;
  },

  // Footer Links
  getFooterLinks: async () => {
    const res = await api.get('/admin/website/footer-links');
    return res.data;
  },
  getFooterLink: async (id) => {
    const res = await api.get(`/admin/website/footer-links/${id}`);
    return res.data;
  },
  createFooterLink: async (data) => {
    const res = await api.post('/admin/website/footer-links', data);
    return res.data;
  },
  updateFooterLink: async (id, data) => {
    const res = await api.put(`/admin/website/footer-links/${id}`, data);
    return res.data;
  },
  deleteFooterLink: async (id) => {
    const res = await api.delete(`/admin/website/footer-links/${id}`);
    return res.data;
  },

  // Navbar Items
  getNavbarItems: async () => {
    const res = await api.get('/admin/website/navbar-items');
    return res.data;
  },
  getNavbarItem: async (id) => {
    const res = await api.get(`/admin/website/navbar-items/${id}`);
    return res.data;
  },
  createNavbarItem: async (data) => {
    const res = await api.post('/admin/website/navbar-items', data);
    return res.data;
  },
  updateNavbarItem: async (id, data) => {
    const res = await api.put(`/admin/website/navbar-items/${id}`, data);
    return res.data;
  },
  deleteNavbarItem: async (id) => {
    const res = await api.delete(`/admin/website/navbar-items/${id}`);
    return res.data;
  },
};