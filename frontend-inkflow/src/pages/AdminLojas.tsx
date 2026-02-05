/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Search, ExternalLink, ShieldAlert, Settings } from "lucide-react"; // Removidos os não usados
import { tenantService } from "../services/tenants/tenantService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. Defina a interface para o TypeScript entender o objeto
interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  plan?: string; // Opcional por enquanto
}

export default function AdminLojas() {
  const navigate = useNavigate();
  // 2. Tipagem do estado: <Tenant[]>
  const [stores, setStores] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      setLoading(true);
      const data = await tenantService.getAll();
      setStores(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Erro ao carregar unidades");
    } finally {
      setLoading(false);
    }
  }

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.slug.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "active") return matchesSearch && store.isActive;
    if (statusFilter === "inactive") return matchesSearch && !store.isActive;
    return matchesSearch;
  });

  async function handleImpersonate(tenantSlug: string) {
    const loadingToast = toast.loading(
      `Assumindo identidade da loja ${tenantSlug}...`,
    );

    try {
      const data = await tenantService.impersonate(tenantSlug);

      // 1. Salva o token do cliente no localStorage (sobrescrevendo o seu temporariamente)
      // Se você usa um context de Auth, o ideal é atualizar o estado lá
      localStorage.setItem("@InkFlow:token", data.token);
      localStorage.setItem("@InkFlow:user", JSON.stringify(data.user));

      toast.success(`Logado como: ${data.user.ownerFullName}`, {
        id: loadingToast,
      });

      // 2. Redireciona para o Dashboard do Cliente (que ainda vamos criar)
      // Por enquanto, vamos mandar para uma rota que represente o painel da loja
      setTimeout(() => {
        window.location.href = "/dashboard"; // Refresh para carregar o novo contexto de tenant
      }, 1000);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Falha ao acessar conta do cliente", { id: loadingToast });
    }
  }

  async function handleCheckAlerts(slug: string) {
    try {
      const data = await tenantService.getDiagnostico(slug);

      if (data.alertas.length === 0) {
        toast.success(
          `Tudo certo com a loja ${data.tenantName}! Nenhuma pendência encontrada.`,
        );
        return;
      }

      // Se preferir algo visualmente forte para múltiplos alertas:
      data.alertas.forEach((alerta: any) => {
        if (alerta.tipo === "erro") toast.error(alerta.msg, { duration: 6000 });
        else if (alerta.tipo === "aviso")
          toast.warning(alerta.msg, { duration: 5000 });
        else toast.info(alerta.msg);
      });
    } catch (error) {
      toast.error("Não foi possível carregar o diagnóstico.");
    }
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestão de Unidades
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Controle operacional de todos os clientes.
          </p>
        </div>

        <div className="flex flex-1 max-w-2xl gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou slug..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos Status</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              Sincronizando dados...
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  Estabelecimento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  Plano
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {store.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{store.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black italic">
                      PREMIUM
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        store.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${store.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                      {store.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleImpersonate(store.slug)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Acessar como dono"
                      >
                        <ExternalLink size={18} />
                      </button>

                      <button
                        onClick={() => navigate(`/admin/lojas/${store.id}`)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Configurações da Loja"
                      >
                        <Settings size={18} />
                      </button>
                      <button
                        onClick={() => handleCheckAlerts(store.slug)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Alertas e Diagnóstico"
                      >
                        <ShieldAlert size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStores.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-400 font-medium"
                  >
                    Nenhuma unidade encontrada com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
