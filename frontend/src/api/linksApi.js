import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

// We can also use an axios instance with interceptors, but this is a simple direct call
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edutrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const linksApi = {
  processLink: async (url) => {
    const response = await api.post('/process-link', { url });
    return response.data;
  },
};
