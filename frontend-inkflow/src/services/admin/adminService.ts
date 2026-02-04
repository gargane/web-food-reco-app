import api from '../api'; // Supondo que você tem um axios configurado

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export const adminService = {
  // Lista todas as lojas para o Admin Master
  getAllTenants: async (): Promise<Tenant[]> => {
    const response = await api.get<Tenant[]>('/master/tenants', {
      headers: {
        'x-tenant-slug': 'admin' // Garante que o middleware aceite a rota master
      }
    });
    return response.data;
  },

  // Ativa ou Desativa uma loja
  toggleTenantStatus: async (id: string): Promise<void> => {
    await api.post(`/master/toggle-status/${id}`, {}, {
      headers: { 'x-tenant-slug': 'admin' }
    });
  },

  // Cria uma nova loja e o respectivo dono manualmente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createStoreFull: async (data: any) => {
    const response = await api.post('/master/create-store', data, {
      headers: { 'x-tenant-slug': 'admin' }
    });
    return response.data;
  }
};