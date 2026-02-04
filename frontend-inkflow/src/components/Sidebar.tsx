import { LayoutDashboard, Store, Users, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col p-6 text-white border-r border-slate-800">
      <div className="mb-10">
        <h2 className="text-2xl font-black tracking-tighter">
          InkFlow<span className="text-indigo-500">.</span>
        </h2>
        <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">
          {user?.role}
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="w-full flex items-center gap-3 p-3 bg-indigo-600 rounded-xl font-bold transition-all"
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
          <Store size={20} /> Lojas (Tenants)
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
          <Users size={20} /> Usuários Master
        </button>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
            {user?.email ? user.email[0].toUpperCase() : "?"}
          </div>
          <div className="truncate">
            <p className="text-sm font-bold truncate">{user?.email}</p>
            <p className="text-[10px] text-slate-500">Online</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition-all"
        >
          <LogOut size={20} /> Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
