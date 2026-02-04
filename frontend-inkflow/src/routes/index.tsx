import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectTenant from "../pages/SelectTenant";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import RegisterStore from "../pages/RegisterStore";
import AdminDashboard from "../pages/AdminDashboard";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import EditStore from "../pages/EditStore";

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

        <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/lojas/:id" element={<EditStore />} />{" "}
            {/* Nova Rota */}
          </Route>
        </Route>

        {/* 3. Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
