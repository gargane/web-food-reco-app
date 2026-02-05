import { useEffect, useState, useCallback } from "react";
import adminConfigService, { type AdminUser } from "../services/adminConfig/adminConfigService";
import { toast } from "sonner";
import { Trash2, UserPlus, ShieldCheck } from "lucide-react";

export function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAdmins = useCallback(async () => {
    try {
      const data = await adminConfigService.getAdmins();
      setAdmins(data);
    } catch (error) {
      toast.error("Erro ao carregar administradores.");
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handlePromote = async () => {
    if (!newAdminEmail) {
      toast.error("Digite um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminConfigService.promoteToAdmin(newAdminEmail);
      toast.success("Usuário promovido a SuperAdmin!");
      setNewAdminEmail("");
      loadAdmins();
    } catch (error: any) {
      toast.error(error.response?.data || "Erro ao promover usuário. Verifique se o e-mail existe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remover acesso administrativo deste usuário?")) return;
    
    try {
      await adminConfigService.removeAdmin(id);
      toast.success("Acesso administrativo removido.");
      loadAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao remover administrador.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
          <UserPlus size={16} /> Adicionar Novo Administrador
        </h3>
        <div className="flex gap-2">
          <input 
            type="email"
            placeholder="E-mail do usuário cadastrado"
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newAdminEmail}
            onChange={e => setNewAdminEmail(e.target.value)}
          />
          <button 
            onClick={handlePromote}
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processando..." : "Promover"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          * O usuário já deve ter uma conta criada no sistema para ser promovido.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-600" /> Admins Ativos
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {admins.length === 0 ? (
            <p className="p-8 text-center text-slate-400">Nenhum administrador encontrado.</p>
          ) : (
            admins.map(admin => (
              <div key={admin.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-800">{admin.fullName || 'Sem Nome'}</p>
                  <p className="text-sm text-slate-500">{admin.email}</p>
                  {!admin.emailConfirmed && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      E-mail não confirmado
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleRemove(admin.id)} 
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Remover Permissão"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}