/**
 * API Client - Centralized service for all backend API calls
 * Handles requests to the Lux Door Backend API running on http://localhost:3001
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }

  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3001`;
  }

  return 'http://localhost:3001';
};

const API_BASE_URL = resolveApiBaseUrl();

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Please login');
    }
    if (error.response?.status === 403) {
      console.error('Forbidden - You do not have permission');
    }
    return Promise.reject(error);
  }
);

// ============ PRODUCTS API ============

export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    categoryId?: string;
    categoryIds?: string;
    search?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'default' | 'price-asc' | 'price-desc';
  }) => {
    try {
      const response = await apiClient.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  create: async (data: unknown) => {
    try {
      const response = await apiClient.post('/api/products', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  update: async (id: string, data: unknown) => {
    try {
      const response = await apiClient.put(`/api/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    }
  },
};

// ============ LEADS API ============

export const leadsAPI = {
  create: async (data: { name: string; phone: string; message: string; source?: 'website' | 'telegram' | 'phone' | 'other' }) => {
    try {
      const response = await apiClient.post('/api/leads', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  },

  getAll: async (params?: { status?: string; skip?: number; take?: number }) => {
    try {
      const response = await apiClient.get('/api/leads', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await apiClient.patch(`/api/leads/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Failed to update lead ${id}:`, error);
      throw error;
    }
  },
};

// ============ COMMENTS API ============

export const commentsAPI = {
  getByProduct: async (productId: string) => {
    try {
      const response = await apiClient.get('/api/comments', {
        params: { productId },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch comments for product ${productId}:`, error);
      throw error;
    }
  },

  create: async (data: { productId: string; authorName: string; text: string; rating: number }) => {
    try {
      const response = await apiClient.post('/api/comments', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiClient.delete(`/api/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete comment ${id}:`, error);
      throw error;
    }
  },
};

// ============ CATEGORIES API ============

export const categoriesAPI = {
  getAll: async (params?: { includeDeleted?: boolean }) => {
    try {
      const response = await apiClient.get('/api/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },
};

// ============ ADMIN API ============

export const adminAPI = {
  getUsers: async () => {
    try {
      const response = await apiClient.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  createUser: async (data: { username: string; password: string; role: string }) => {
    try {
      const response = await apiClient.post('/api/admin/users', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  // ✅ multipart/form-data o'rniga base64
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    try {
      // Faylni base64 ga o'tkazish
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/admin/upload', {
        base64,
        folder: 'products',
      });

      return response.data.data;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  },
};

export default apiClient;