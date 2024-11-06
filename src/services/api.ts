import axios from 'axios';

// Use the deployed API URL in production, fallback to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  token: string;
}

export const auth = {
  async register(data: { email: string; password: string; name: string }) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/user');
    return response.data;
  },
};

export const contacts = {
  async getAll() {
    const response = await api.get('/contacts');
    return response.data;
  },

  async create(contact: any) {
    const response = await api.post('/contacts', contact);
    return response.data;
  },

  async update(id: string, contact: any) {
    const response = await api.put(`/contacts/${id}`, contact);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/contacts/${id}`);
  },
};

export default {
  auth,
  contacts,
};