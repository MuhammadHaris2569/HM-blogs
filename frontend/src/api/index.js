import api from './axios';

export const blogApi = {
  getAll: (params) => api.get('/blogs', { params }),
  getMine: (params) => api.get('/blogs/me/all', { params }),
  getAllAdmin: (params) => api.get('/blogs/admin/all', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  getTrending: () => api.get('/blogs/trending'),
  create: (formData) => api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  toggleBookmark: (id) => api.post(`/blogs/${id}/bookmark`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const tagApi = {
  getAll: () => api.get('/tags'),
  create: (name) => api.post('/tags', { name }),
  remove: (id) => api.delete(`/tags/${id}`),
};

export const commentApi = {
  getByBlog: (blogId) => api.get(`/comments/${blogId}`),
  getAllAdmin: (params) => api.get('/comments/admin/all', { params }),
  create: (blogId, data) => api.post(`/comments/${blogId}`, data),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  remove: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`),
};

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (formData) => api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/users/change-password', data),
  getBookmarks: () => api.get('/users/bookmarks'),
  getHistory: () => api.get('/users/history'),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  remove: (id) => api.delete(`/users/${id}`),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const newsletterApi = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
};
