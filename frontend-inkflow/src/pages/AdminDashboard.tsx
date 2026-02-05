import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tenantService } from "../services/tenants/tenantService";
import {
  Store,
  Users,
  DollarSign,
  Plus,
  X,
  Save,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalActiveCustomers: 0,
    totalRevenue: 0,
  });
  // Estados para o Modal

  // 1. Estado expandido para incluir os dados do Dono
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newStore, setNewStore] = useState({
    storeName: "",
    slug: "",
    ownerEmail: "",
    ownerFullName: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // Promise.all dispara as duas requisições ao mesmo tempo
        const [storesData, statsData] = await Promise.all([
          tenantService.getAll(),
          tenantService.getStats(),
        ]);

        setStores(storesData);
        setStats(statsData);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);
  async function loadStores() {
    try {
      setLoading(true);
      const data = await tenantService.getAll();
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault();

    if (newStore.password !== newStore.confirmPassword) {
      return toast.error("As senhas não coincidem!");
    }

    setIsCreating(true);

    const promise = tenantService.create(newStore);

    toast.promise(promise, {
      loading: "Provisionando infraestrutura da loja...",
      success: () => {
        setIsModalOpen(false);
        setNewStore({
          storeName: "",
          slug: "",
          ownerEmail: "",
          ownerFullName: "",
          password: "",
          confirmPassword: "",
        });

        // Chamamos a função que carrega a lista e as estatísticas novamente
        // Isso garante que o card "Total de Lojas" suba o número na hora!
        loadDashboardData();

        return "Loja e Dono criados com sucesso!";
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (err: any) => {
        return err.response?.data?.message || "Erro ao criar estabelecimento.";
      },
      finally: () => {
        setIsCreating(false);
      },
    });
  }

  // 1. Defina a função fora do useEffect
  async function loadDashboardData() {
    try {
      setLoading(true);
      const [storesData, statsData] = await Promise.all([
        tenantService.getAll(),
        tenantService.getStats(),
      ]);
      setStores(storesData);
      setStats(statsData);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Chame ela no carregamento inicial
  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Header com Ação - Flex-col no mobile, row no desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Painel Master
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Gerencie todos os estabelecimentos da rede.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)} // Abre o Modal
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 w-full sm:w-auto"
        >
          <Plus size={20} /> NOVA LOJA
        </button>
      </div>

      {/* Cards de Resumo - Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total de Lojas"
          value={stats.totalStores.toString()} // Pega do novo endpoint
          icon={<Store className="text-indigo-600" />}
        />
        <StatCard
          title="Clientes Ativos"
          value={stats.totalActiveCustomers.toLocaleString("pt-BR")} // Ex: 1.240
          icon={<Users className="text-emerald-600" />}
        />
        <StatCard
          title="Faturamento Total"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(stats.totalRevenue)} // Ex: R$ 12.450,00
          icon={<DollarSign className="text-amber-600" />}
        />
      </div>

      {/* Tabela de Lojas com Scroll Horizontal */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">
            Estabelecimentos Recentes
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
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
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando lojas...</span>
                    </div>
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
                      {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          store.isActive // Verifica o booleano diretamente
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {store.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/lojas/${store.id}`)}
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
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleCreateStore} className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Provisionar Nova Unidade
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Configure a loja e o acesso administrativo inicial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SEÇÃO DA LOJA */}
                <div className="space-y-4">
                  <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Store size={14} /> Dados do Estabelecimento
                  </h3>
                  <div>
                    <input
                      required
                      placeholder="Nome da Loja (ex: Burguer King)"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold"
                      value={newStore.storeName}
                      onChange={(e) =>
                        setNewStore({ ...newStore, storeName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <input
                      required
                      placeholder="slug-da-url"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-mono text-sm"
                      value={newStore.slug}
                      onChange={(e) => {
                        const val = e.target.value
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-");
                        setNewStore({ ...newStore, slug: val });
                      }}
                    />
                    <p className="text-[9px] text-slate-400 mt-1 ml-2 italic">
                      Link final: https://inkflow.com/
                      {newStore.slug || "sua-loja"}
                    </p>
                  </div>
                </div>

                {/* SEÇÃO DO DONO */}
                <div className="space-y-4">
                  <h3 className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Acesso do Proprietário
                  </h3>
                  <input
                    required
                    placeholder="Nome Completo"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                    value={newStore.ownerFullName}
                    onChange={(e) =>
                      setNewStore({
                        ...newStore,
                        ownerFullName: e.target.value,
                      })
                    }
                  />
                  <input
                    required
                    type="email"
                    placeholder="E-mail de Login"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                    value={newStore.ownerEmail}
                    onChange={(e) =>
                      setNewStore({ ...newStore, ownerEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* SENHAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <input
                  required
                  type="password"
                  placeholder="Senha Temporária"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none font-bold"
                  value={newStore.password}
                  onChange={(e) =>
                    setNewStore({ ...newStore, password: e.target.value })
                  }
                />
                <input
                  required
                  type="password"
                  placeholder="Confirmar Senha"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 outline-none font-bold"
                  value={newStore.confirmPassword}
                  onChange={(e) =>
                    setNewStore({
                      ...newStore,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <button
                disabled={isCreating}
                className="w-full mt-8 bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
              >
                {isCreating ? (
                  "PROCESSANDO..."
                ) : (
                  <>
                    <Save size={20} /> FINALIZAR PROVISIONAMENTO
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-5">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl md:text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest leading-none mb-1">
          {title}
        </p>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}
