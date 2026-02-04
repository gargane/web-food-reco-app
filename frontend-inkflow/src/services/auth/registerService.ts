import api from '../api';
import { z } from 'zod';

export const registerStoreSchema = z.object({
  storeName: z.string().min(3, "Nome da loja muito curto"),
  storeSlug: z.string().min(3, "O link deve ter 3 letras ou mais").regex(/^[a-z0-9-]+$/, "Use apenas letras, números e hífens"),
  ownerName: z.string().min(3, "Nome completo obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type RegisterStoreData = z.infer<typeof registerStoreSchema>;

export const registerService = {
  createStore: async (data: RegisterStoreData) => {
    const response = await api.post('/auth/register-store', data);
    return response.data;
  }
};