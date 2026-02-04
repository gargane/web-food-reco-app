/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tenantService } from "../services/tenants/tenantService";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner"; // Usando o Sonner

export default function EditStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true); // Mudado de status para boolean

  useEffect(() => {
    async function loadStore() {
      try {
        const store = await tenantService.getById(id!);
        setName(store.name);
        setIsActive(store.isActive); // Pega o booleano vindo da API
      } catch (err) {
        toast.error("Erro ao carregar loja");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [id, navigate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // O objeto deve bater com o UpdateTenantDto do C#
    const updateData = { 
      name: name, 
      isActive: isActive 
    };

    try {
      await tenantService.update(id!, updateData);
      toast.success("Estabelecimento atualizado com sucesso!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> VOLTAR
      </button>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Editar Estabelecimento</h1>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Nome da Unidade</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Status de Operação</label>
            <select 
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all appearance-none cursor-pointer"
            >
              <option value="true">🟢 ATIVO (Acesso Liberado)</option>
              <option value="false">🔴 INATIVO (Bloqueado)</option>
            </select>
          </div>

          <button 
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-200"
          >
            {saving ? "PROCESSANDO..." : <><Save size={20} /> SALVAR ALTERAÇÕES</>}
          </button>
        </form>
      </div>
    </div>
  );
}