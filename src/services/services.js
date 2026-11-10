import api, { API_BASE_URL } from './api.js';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const instagramService = {
  connect: async () => {
    try {
      const res = await api.get('/instagram/connect?json=true');
      if (res.data?.data?.authUrl) {
        window.location.href = res.data.data.authUrl;
        return;
      }
    } catch (err) {
      console.warn('API connect request failed, falling back to direct URL', err);
    }
    const token = localStorage.getItem('reelflow_token');
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    window.location.href = `${API_BASE_URL}/api/instagram/connect${query}`;
  },
  getAccount: () => api.get('/instagram/account'),
  getConfigStatus: () => api.get('/instagram/config-status'),
  verifyToken: () => api.get('/instagram/verify'),
  getReadiness: () => api.get('/instagram/readiness'),
  testConnection: () => api.post('/instagram/test-connection'),
  disconnect: () => api.post('/instagram/disconnect'),
};

export const postsService = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  updatePost: (id, data) => api.patch(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  schedulePost: (id, data) => api.post(`/posts/${id}/schedule`, data),
  bulkSchedule: (data) => api.post('/posts/bulk-schedule', data),
  cancelPost: (id) => api.post(`/posts/${id}/cancel`),
  reschedulePost: (id, data) => api.post(`/posts/${id}/reschedule`, data),
  retryPost: (id) => api.post(`/posts/${id}/retry`),
};

export const uploadService = {
  getSignature: () => api.post('/uploads/signature'),
  completeUpload: (data) => api.post('/uploads/complete', data),
};

export const publishingService = {
  getHistory: (params) => api.get('/publishing/history', { params }),
  getStatus: () => api.get('/publishing/status'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};
