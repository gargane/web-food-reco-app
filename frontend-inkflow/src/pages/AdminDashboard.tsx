import { useState, useEffect } from "react";
import { Store, Users, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tenantService } from "../services/tenants/tenantService";
// Tipagem básica para sua loja
interface StoreData {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  // Aqui futuramente você fará o fetch para sua API Master
useEffect(() => {
  async function loadStores() {
    try {
      const data = await tenantService.getAll();
      setStores(data);
    } catch (err) {
      console.error("Erro ao carregar lojas", err);
    } finally {
      setLoading(false);
    }
  }
  loadStores();
}, []);
  return (
    <div className="space-y-8 p-4">
      {/* Header com Ação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Painel Master
          </h1>
          <p className="text-slate-500 font-medium">
            Gerencie todos os estabelecimentos da rede.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <Plus size={20} /> NOVA LOJA
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Lojas"
          value={stores.length.toString()}
          icon={<Store className="text-indigo-600" />}
        />
        <StatCard
          title="Clientes Ativos"
          value="1.240"
          icon={<Users className="text-emerald-600" />}
        />
        <StatCard
          title="Faturamento Total"
          value="R$ 12.450"
          icon={<DollarSign className="text-amber-600" />}
        />
      </div>

      {/* Tabela de Lojas */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">
            Estabelecimentos Recentes
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Identificador (Slug)</th>
                <th className="px-6 py-4">Data de Cadastro</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Carregando lojas...
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr
                    key={store.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                      {store.slug}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {store.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase">
                        {store.status}
                      </span>
                    </td>
                    // Dentro do map das lojas no AdminDashboard.tsx
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/lojas/${store.id}`)} // Navega para a edição
                        className="bg-slate-100 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente de Card Interno
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-none mb-1">
          {title}
        </p>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}
