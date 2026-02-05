import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { ImpersonateBanner } from "../components/ImpersonateBanner";
import { useAuth } from "../hooks/useAuth";
export function StoreLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { label: "Pedidos", icon: <ShoppingBag size={20} />, path: "/pedidos" },
    {
      label: "Produtos",
      icon: <UtensilsCrossed size={20} />,
      path: "/produtos",
    },
    { label: "Clientes", icon: <Users size={20} />, path: "/clientes" },
    {
      label: "Configurações",
      icon: <Settings size={20} />,
      path: "/configuracoes",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar do Lojista */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-600">
            InkFlow{" "}
            <span className="text-gray-400 font-light text-sm">Loja</span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Banner de Impersonate aparece aqui se for o caso */}
        <ImpersonateBanner />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
