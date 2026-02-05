import { X, LayoutDashboard, Store, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
interface SidebarProps {
  onClose?: () => void;
}

// 2. Aplique a interface no componente
export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  // Dentro da Sidebar.tsx, você pode separar por categorias se quiser crescer mais depois
  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Visão Geral",
      path: "/admin/dashboard",
    },
    {
      icon: <Store size={20} />,
      label: "Gestão de Unidades", // Nome mais profissional para "Lojas"
      path: "/admin/lojas",
    },
    {
      icon: <Settings size={20} />,
      label: "Plataforma",
      path: "/admin/configuracoes",
    },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
      {/* Header da Sidebar com botão fechar (visível apenas no mobile) */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <h2 className="text-xl font-black text-white italic tracking-tighter">
          InkFlow<span className="text-indigo-500">.</span>
        </h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose} // Fecha a sidebar ao clicar em um link no mobile
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              location.pathname === item.path
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}
