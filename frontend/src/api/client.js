import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 45000, // 45 seconds to accommodate free tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edutrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle Cold Starts, Server Sleeping, and Automatic Retries
const MAX_RETRIES = 3;

api.interceptors.response.use(
  (response) => {
    // Notify application that backend is responsive
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('backend-healthy'));
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Check if error is network error, timeout, or server cold-start status code (502, 503, 504)
    const isNetworkError = !error.response;
    const isColdStartStatus = error.response && [502, 503, 504].includes(error.response.status);
    const isTimeout = error.code === 'ECONNABORTED';

    if (config && (isNetworkError || isColdStartStatus || isTimeout)) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;

        // Dispatch waking up event to trigger UI banner if needed
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('backend-waking-up', {
              detail: { retryCount: config._retryCount, url: config.url },
            })
          );
        }

        // Wait before retrying (2s exponential backoff)
        const delay = config._retryCount * 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        return api(config);
      }
    }

    // Handle 401 Unauthorized (e.g., session revoked by admin or expired)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-revoked'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;

