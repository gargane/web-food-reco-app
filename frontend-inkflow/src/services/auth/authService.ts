import api from '../api';
import { z } from 'zod';

// Schema de validação para o formulário
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const authService = {
  login: async (data: LoginData) => {
    // 1. Valida antes de enviar
    const validatedData = loginSchema.parse(data);
    
    // 2. Chama a API (O x-tenant-slug vai automático pelo interceptor)
    const response = await api.post('/auth/login', validatedData);
    
    return response.data; // Esperado: { token: string, user: { ... } }
  },
};