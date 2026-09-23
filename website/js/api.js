// Public API client for OD AI HUB Website
const API_BASE = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8000'))
  ? 'http://localhost:8000/api/v1'
  : '/api/v1';

window.odApi = {
  // Fetch active categories
  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/academy/categories`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load categories:', err);
      return [];
    }
  },

  // Fetch published courses for category slug
  getCategoryCourses: async (categorySlug) => {
    try {
      const res = await fetch(`${API_BASE}/academy/categories/${encodeURIComponent(categorySlug)}/courses`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`Failed to load courses for ${categorySlug}:`, err);
      return [];
    }
  },

  // Fetch published course detail by slug
  getCourseDetail: async (courseSlug) => {
    try {
      const res = await fetch(`${API_BASE}/academy/courses/${encodeURIComponent(courseSlug)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`Failed to load course ${courseSlug}:`, err);
      return null;
    }
  },

  // Fetch animated counters
  getStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load stats:', err);
      return [];
    }
  },

  // Fetch student testimonials
  getTestimonials: async () => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      return [];
    }
  },

  // Fetch FAQs
  getFaqs: async () => {
    try {
      const res = await fetch(`${API_BASE}/faqs`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      return [];
    }
  },

  // Submit visitor enquiry
  submitEnquiry: async (data) => {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.detail || `Submission failed (HTTP ${res.status})`);
    }
    return await res.json();
  }
};
