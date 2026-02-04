/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'SuperAdmin' | 'Owner' | 'Customer';
}

export interface AuthContextData {
  tenant: string | null;
  setTenantSlug: (slug: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;               
  setUser: (user: User | null) => void;
  loading: boolean;                
  logout: () => void;              
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<string | null>(() => {
    return localStorage.getItem('@InkFlow:tenant-slug');
  });

  // Inicializamos o usuário lendo o localStorage direto no useState
  const [user, setUser] = useState<User | null>(() => {
    const storagedUser = localStorage.getItem('@InkFlow:user');
    return storagedUser ? JSON.parse(storagedUser) : null;
  });

  // Inicializamos a autenticação baseada na existência do token
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storagedToken = localStorage.getItem('@InkFlow:token');
    return !!storagedToken;
  });

  const [loading, setLoading] = useState(false); // Já pode começar como false

  const setTenantSlug = (slug: string) => {
    localStorage.setItem('@InkFlow:tenant-slug', slug);
    setTenant(slug);
  };

  const logout = () => {
    localStorage.removeItem('@InkFlow:token');
    localStorage.removeItem('@InkFlow:user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        tenant, 
        setTenantSlug, 
        isAuthenticated, 
        setIsAuthenticated,
        user,        
        setUser,     
        loading,     
        logout       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}