import api from "../api"; 

export interface GlobalConfig {
  id: number;
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  smtpHost: string;
  smtpPort: number;
  smtpUserName: string;
  smtpPassword?: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  webhookSecret: string;
  lastUpdatedAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
}

const adminConfigService = {
  // Busca todas as configurações (Singleton Id=1)
  getConfig: async (): Promise<GlobalConfig> => {
    const response = await api.get("/admin/config");
    return response.data;
  },

  // Atualiza Modo Manutenção
  updateMaintenance: async (isEnabled: boolean, message: string) => {
    const response = await api.put("/admin/config/maintenance", {
      isEnabled,
      message,
    });
    return response.data;
  },

  // Atualiza SMTP
  updateSmtp: async (data: { host: string; port: number; user: string; pass: string }) => {
    const response = await api.put("/admin/config/smtp", data);
    return response.data;
  },

  // Atualiza Pagamentos (Stripe)
  updatePayment: async (data: { publicKey: string; secretKey: string; webhookSecret: string }) => {
    const response = await api.put("/admin/config/payment", data);
    return response.data;
  },

  // --- Gestão de Admins ---
  
  getAdmins: async (): Promise<AdminUser[]> => {
    const response = await api.get("/admin/config/admins");
    return response.data;
  },

  promoteToAdmin: async (email: string) => {
    const response = await api.post("/admin/config/admins/promote", { email });
    return response.data;
  },

  removeAdmin: async (id: string) => {
    const response = await api.delete(`/admin/config/admins/${id}`);
    return response.data;
  }
};

export default adminConfigService;