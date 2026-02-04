/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tenantService } from "../services/tenants/tenantService";
import { Save, ArrowLeft } from "lucide-react";

export default function EditStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados do formulário
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    async function loadStore() {
      try {
        const store = await tenantService.getById(id!);
        setName(store.name);
        setStatus(store.status);
      } catch (err) {
        alert("Erro ao carregar loja");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await tenantService.update(id!, { name, status });
      alert("Loja atualizada com sucesso!");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Carregando dados da loja...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
        <ArrowLeft size={20} /> VOLTAR
      </button>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Editar Estabelecimento</h1>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">Nome do Estabelecimento</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-semibold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">Status da Conta</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-semibold transition-all appearance-none"
            >
              <option value="active">Ativo (Acesso Liberado)</option>
              <option value="inactive">Inativo (Bloqueado)</option>
            </select>
          </div>

          <button 
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
        </form>
      </div>
    </div>
  );
}