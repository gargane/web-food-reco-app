/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Importe o hook
import { tenantService } from "../services/tenants/tenantService";
import adminConfigService from "../services/adminConfig/adminConfigService";
import { toast } from "sonner";
export default function SelectTenant() {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // PEGUE a função do seu Contexto, não tente criá-la aqui!
  const { setTenantSlug } = useAuth();

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault(); // Mova para a primeira linha
    setError(null);

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) return;

    setLoading(true);

    try {
      // 1. SEMPRE permite que o slug "admin" passe, mesmo em manutenção
      if (cleanSlug === "admin") {
        localStorage.removeItem("@InkFlow:token");
        localStorage.removeItem("@InkFlow:user");
        setTenantSlug("admin");
        window.location.href = "/login";
        return;
      }

      // 2. Para outros slugs, verifica a manutenção
      const config = await adminConfigService.getConfig();
      if (config.isMaintenanceMode) {
        toast.error(
          config.maintenanceMessage || "O sistema está em manutenção.",
        );
        setLoading(false);
        return;
      }

      // 3. Se não está em manutenção, valida o tenant normalmente
      await tenantService.verifySlug(cleanSlug);

      // Limpeza apenas se for um tenant válido
      localStorage.removeItem("@InkFlow:token");
      localStorage.removeItem("@InkFlow:user");

      setTenantSlug(cleanSlug);
      window.location.href = "/login";
    } catch (err: any) {
      setError("Estabelecimento não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decoração sutil de fundo */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-3xl"></div>

        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Autoatendimento Inteligente
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            InkFlow<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Digite o nome do estabelecimento
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ex: bar-do-jorge"
              disabled={loading}
              className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-2xl outline-none transition-all text-lg font-semibold placeholder:text-slate-300
                ${error ? "border-red-400 focus:border-red-500 text-red-900" : "border-slate-100 focus:border-indigo-600 text-slate-800"}`}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 ml-2 font-bold flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full inline-block"></span>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !slug}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center group active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="flex items-center gap-2">
                ACESSAR PAINEL
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>

        {/* --- SEÇÃO DE NOVAS OPÇÕES --- */}
        <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">
              Não possui uma conta?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Opção para o Dono do Restaurante (Vai para Landing Page) */}
            <button
              onClick={() => navigate("/conhecer")} // Direciona para a vitrine/planos
              className="group flex items-center justify-between w-full p-4 bg-indigo-50 border border-indigo-100 rounded-2xl hover:bg-indigo-600 transition-all"
            >
              <div className="text-left">
                <p className="text-indigo-900 group-hover:text-white font-bold text-sm leading-none">
                  Sou proprietário
                </p>
                <p className="text-indigo-400 group-hover:text-indigo-200 text-[11px] mt-1 font-medium italic">
                  Quero contratar o sistema
                </p>
              </div>
              <div className="bg-white group-hover:bg-indigo-500 p-2 rounded-xl transition-colors">
                <svg
                  className="w-4 h-4 text-indigo-600 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>

            {/* Opção para o Cliente (Vai para cadastro de cliente) */}
            <button
              onClick={() => navigate("/cadastrar-cliente")}
              className="flex items-center justify-center w-full py-4 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors border-2 border-transparent hover:border-slate-100 rounded-2xl"
            >
              Sou cliente e quero fazer um pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
