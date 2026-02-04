import { Sidebar } from "../components/Sidebar"; // Ajuste o caminho conforme sua estrutura
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* A Sidebar fixa na esquerda */}
      <Sidebar />

      {/* O conteúdo da página à direita */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
}