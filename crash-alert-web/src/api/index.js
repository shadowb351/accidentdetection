import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const emergencyApi = {
  report: (data) => api.post('/emergency', data),
  cancel: (id) => api.post(`/emergency/${id}/cancel`),
  getStatus: (id) => api.get(`/emergency/${id}`)
};

export const profileApi = {
  get: (userId) => api.get(`/profile/${userId}`),
  update: (userId, data) => api.put(`/profile/${userId}`, data),
  generateQr: (userId) => api.post(`/profile/${userId}/qr-code`)
};

export const mapApi = {
  getMarkers: (bbox, zoom) => api.get('/map/markers', { params: { bbox, zoom } }),
  getOfflineTiles: (bbox, zoomLevels) => api.get('/map/offline-tiles', { params: { bbox, zoomLevels } })
};

export const adminApi = {
  getAlerts: (params) => api.get('/admin/alerts', { params }),
  getAmbulances: () => api.get('/admin/ambulances'),
  getHospitals: () => api.get('/admin/hospitals'),
  getAnalytics: (timeRange) => api.get('/admin/analytics', { params: { timeRange } })
};

export const voiceApi = {
  processAudio: (userId, audioData) => api.post(`/voice/${userId}/process`, { audioData })
};