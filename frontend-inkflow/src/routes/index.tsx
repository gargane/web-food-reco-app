import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectTenant from "../pages/SelectTenant";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import RegisterStore from "../pages/RegisterStore";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLojas from "../pages/AdminLojas"; // Importe a nova página
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import EditStore from "../pages/EditStore";
import { Dashboard } from "../pages/Dashboard"; // A página que criaremos para o lojista
import { StoreLayout } from "../layouts/StoreLayout";
import AdminConfig from "../pages/AdminConfig";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rotas Públicas */}
        <Route path="/" element={<SelectTenant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conhecer" element={<LandingPage />} />
        <Route path="/contratar/:plano" element={<RegisterStore />} />
        <Route path="/cardapio/:slug" element={<div>Página do Cardápio</div>} />
        {/* ... outras rotas públicas */}

        {/* 2. Rotas do SUPER ADMIN (Gestão da Plataforma) */}
        <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/lojas" element={<AdminLojas />} />
            <Route path="/admin/lojas/:id" element={<EditStore />} />
            <Route path="/admin/configuracoes" element={<AdminConfig />} /> 
          </Route>
        </Route>

        {/* 3. Rotas do DONO DA LOJA (Onde o Impersonate vai cair) */}
        {/* Aqui permitimos Owner e SuperAdmin (caso o Admin queira acessar diretamente) */}
        <Route element={<ProtectedRoute allowedRoles={["Owner", "SuperAdmin"]} />}>
          <Route element={<StoreLayout />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<div>Tela de Pedidos</div>} />
            <Route path="/produtos" element={<div>Tela de Produtos</div>} />
          </Route>
        </Route>

        {/* 4. Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}