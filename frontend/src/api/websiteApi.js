import api from './client';

export const websiteApi = {
  // Pillars
  getPillars: async () => {
    const res = await api.get('/website/pillars');
    return res.data;
  },
  getPillar: async (slug) => {
    const res = await api.get(`/website/pillars/${slug}`);
    return res.data;
  },
  getPillarSections: async (slug) => {
    const res = await api.get(`/website/pillars/${slug}/sections`);
    return res.data;
  },

  // Sections
  getSection: async (sectionSlug) => {
    const res = await api.get(`/website/sections/${sectionSlug}`);
    return res.data;
  },
  getSectionOfferings: async (sectionId) => {
    const res = await api.get(`/website/sections/${sectionId}/offerings`);
    return res.data;
  },

  // Institution Audiences
  getInstitutionAudiences: async () => {
    const res = await api.get('/website/institutions/audiences');
    return res.data;
  },
  getAudienceSections: async (audienceSlug) => {
    const res = await api.get(`/website/institutions/${audienceSlug}/sections`);
    return res.data;
  },

  // Events
  getEvents: async (params = {}) => {
    const res = await api.get('/website/events', { params });
    return res.data;
  },
  getEvent: async (slug) => {
    const res = await api.get(`/website/events/${slug}`);
    return res.data;
  },
  registerForEvent: async (eventId, data) => {
    const res = await api.post(`/website/events/${eventId}/register`, data);
    return res.data;
  },

  // Success Stories
  getSuccessStories: async (params = {}) => {
    const res = await api.get('/website/success-stories', { params });
    return res.data;
  },

  // Blog
  getBlogPosts: async (params = {}) => {
    const res = await api.get('/website/blog', { params });
    return res.data;
  },
  getBlogPost: async (slug) => {
    const res = await api.get(`/website/blog/${slug}`);
    return res.data;
  },

  // Certificates
  verifyCertificate: async (certificateId) => {
    const res = await api.get(`/website/certificates/verify/${certificateId}`);
    return res.data;
  },

  // Static Pages
  getStaticPage: async (slug) => {
    const res = await api.get(`/website/pages/${slug}`);
    return res.data;
  },

  // Team
  getTeamMembers: async () => {
    const res = await api.get('/website/team');
    return res.data;
  },

  // Careers
  getCareers: async () => {
    const res = await api.get('/website/careers');
    return res.data;
  },

  // Footer Links
  getFooterLinks: async () => {
    const res = await api.get('/website/footer-links');
    return res.data;
  },
};