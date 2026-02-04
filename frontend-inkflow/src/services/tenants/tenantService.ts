/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export const tenantService = {
  // Rota: api/admin/tenants/verify/{slug}
  verifySlug: async (slug: string) => {
    try {
      const response = await api.get(`/admin/tenants/verify/${slug}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Estabelecimento não encontrado.";
      throw new Error(message);
    }
  },

  // Rota: api/admin/tenants
  getAll: async () => {
    const response = await api.get('/admin/tenants');
    return response.data;
  },

  // Rota: api/admin/tenants/{id}
  getById: async (id: string) => {
    const response = await api.get(`/admin/tenants/${id}`);
    return response.data;
  },

  // Rota: api/admin/tenants/{id}
  update: async (id: string, data: any) => {
    const response = await api.put(`/admin/tenants/${id}`, data);
    return response.data;
  },

  // Rota: api/admin/tenants/{id}/toggle-status
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/admin/tenants/${id}/toggle-status`);
    return response.data;
  }
};