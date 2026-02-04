import axios, { type InternalAxiosRequestConfig } from 'axios'; // Adicionado o 'type' aqui

const api = axios.create({
  baseURL: 'https://localhost:44363/api',
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@InkFlow:token');
    const tenantSlug = localStorage.getItem('@InkFlow:tenant-slug');

    // Se houver um token, ele é enviado no padrão Bearer
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // O segredo do Multitenant: enviamos o slug para a API saber qual loja é
    if (tenantSlug && config.headers) {
      config.headers['x-tenant-slug'] = tenantSlug;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;