import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: ('SuperAdmin' | 'Owner' | 'Customer')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não logado, manda para o LOGIN (que é sua rota real)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se a role do usuário está na lista de permissões
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/" replace />;
  }

  // IMPORTANTE: Retornamos Outlet para que as rotas filhas (Layout e Dashboard) apareçam
  return <Outlet />;
}