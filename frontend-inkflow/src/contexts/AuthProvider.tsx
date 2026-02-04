/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Inicialização correta com 'setTenant' disponível
  const [tenant, setTenant] = useState<string | null>(() => {
    return localStorage.getItem("@InkFlow:tenant-slug");
  });

  const [user, setUser] = useState<User | null>(() => {
    const storagedUser = localStorage.getItem("@InkFlow:user");
    return storagedUser ? JSON.parse(storagedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("@InkFlow:token");
  });

  const [loading, setLoading] = useState(false);

  // 2. Função que atualiza o Storage E o Estado ao mesmo tempo
  const setTenantSlug = (slug: string) => {
    const cleanSlug = slug.trim().toLowerCase();
    localStorage.setItem("@InkFlow:tenant-slug", cleanSlug);
    setTenant(cleanSlug);

    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    localStorage.removeItem("@InkFlow:token");
    localStorage.removeItem("@InkFlow:user");
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
