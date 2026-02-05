import { LogOut, ShieldAlert } from "lucide-react";

export function ImpersonateBanner() {
  const user = JSON.parse(localStorage.getItem("@InkFlow:user") || "{}");
  
  // Se o usuário não tem o campo de impersonate (podemos adicionar isso no retorno da API depois)
  // ou se você simplesmente quiser checar se ele é um Owner vindo de um redirect
  if (user.role !== "Owner") return null;

  const handleExit = () => {
    // Para voltar, precisamos deslogar e logar de novo como SuperAdmin
    // Ou você pode salvar o token de admin em outra chave como "@InkFlow:adminToken" antes de trocar
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <ShieldAlert size={20} />
        <span className="font-medium">
          Você está visualizando a loja: <strong>{user.tenantSlug}</strong>
        </span>
      </div>
      <button 
        onClick={handleExit}
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition"
      >
        <LogOut size={16} /> Sair do modo visualização
      </button>
    </div>
  );
}