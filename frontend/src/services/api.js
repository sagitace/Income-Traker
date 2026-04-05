import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

export const incomeService = {
  getAll: () => api.get('/income'),
  getOne: (id) => api.get(`/income/${id}`),
  create: (data) => api.post('/income', data),
  update: (id, data) => api.put(`/income/${id}`, data),
  delete: (id) => api.delete(`/income/${id}`),
};

export const settingsService = {
  get: () => api.get('/settings/ipon'),
  update: (data) => api.put('/settings/ipon', data),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getMonthly: (year, month) => api.get(`/dashboard/monthly/${year}/${month}`),
  getYearly: (year) => api.get(`/dashboard/yearly/${year}`),
};

export default api;
