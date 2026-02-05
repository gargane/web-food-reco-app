import { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Save,
} from "lucide-react";
import adminConfigService, {
  type GlobalConfig,
} from "../services/adminConfig/adminConfigService";
import { AdminManagement } from "../components/AdminManagement"; // O componente que corrigimos antes
import { toast } from "sonner";

export default function AdminConfig() {
  const [activeTab, setActiveTab] = useState("geral");
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const data = await adminConfigService.getConfig();
      setConfig(data);
    } catch (error) {
      toast.error("Erro ao carregar configurações globais.");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">
          Configurações da Plataforma
        </h1>
        <p className="text-slate-500">
          Gerencie os parâmetros críticos e integrações do sistema.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {/* Menu Lateral de Abas */}
        <nav className="w-full md:w-64 space-y-2">
          <TabButton
            active={activeTab === "geral"}
            onClick={() => setActiveTab("geral")}
            icon={<Settings size={18} />}
            label="Modo Manutenção"
          />
          <TabButton
            active={activeTab === "admins"}
            onClick={() => setActiveTab("admins")}
            icon={<ShieldCheck size={18} />}
            label="Gestão de Admins"
          />
          <TabButton
            active={activeTab === "email"}
            onClick={() => setActiveTab("email")}
            icon={<Mail size={18} />}
            label="SMTP / E-mail"
          />
          <TabButton
            active={activeTab === "pagamentos"}
            onClick={() => setActiveTab("pagamentos")}
            icon={<CreditCard size={18} />}
            label="Pagamentos SaaS"
          />
        </nav>

        {/* Conteúdo das Abas */}
        <div className="flex-1 border-l border-slate-100 pl-0 md:pl-6 min-h-[400px]">
          {activeTab === "geral" && (
            <MaintenanceTab config={config!} refresh={loadConfig} />
          )}
          {activeTab === "admins" && <AdminManagement />}
          {activeTab === "email" && (
            <SmtpTab config={config!} refresh={loadConfig} />
          )}
          {activeTab === "pagamentos" && (
            <PaymentTab config={config!} refresh={loadConfig} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Subcomponentes de Aba ---

function MaintenanceTab({
  config,
  refresh,
}: {
  config: GlobalConfig;
  refresh: () => void;
}) {
  const [enabled, setEnabled] = useState(config.isMaintenanceMode);
  const [message, setMessage] = useState(config.maintenanceMessage);

  async function handleSave() {
    try {
      await adminConfigService.updateMaintenance(enabled, message);
      toast.success("Status de manutenção atualizado!");
      refresh();
    } catch (error) {
      toast.error("Erro ao atualizar manutenção.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Modo Manutenção</p>
            <p className="text-sm text-amber-700">
              Quando ativo, apenas SuperAdmins acessam a API.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          className="toggle-checkbox w-6 h-6"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mensagem de Manutenção</label>
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        <Save size={18} /> Salvar Alterações
      </button>
    </div>
  );
}

function SmtpTab({
  config,
  refresh,
}: {
  config: GlobalConfig;
  refresh: () => void;
}) {
  const [form, setForm] = useState({
    host: config.smtpHost,
    port: config.smtpPort,
    user: config.smtpUserName,
    pass: "", // Senha sempre vazia por segurança no carregamento
  });

  async function handleSave() {
    try {
      await adminConfigService.updateSmtp(form);
      toast.success("Configurações de e-mail salvas!");
      refresh();
    } catch (error) {
      toast.error("Erro ao salvar SMTP.");
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-slate-500">
            Host SMTP
          </label>
          <input
            className="w-full p-2 border rounded"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-slate-500">
            Porta
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={form.port}
            onChange={(e) => setForm({ ...form, port: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-slate-500">
          Usuário/E-mail
        </label>
        <input
          className="w-full p-2 border rounded"
          value={form.user}
          onChange={(e) => setForm({ ...form, user: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-slate-500">
          Senha
        </label>
        <input
          type="password"
          placeholder="Digite para alterar"
          className="w-full p-2 border rounded"
          value={form.pass}
          onChange={(e) => setForm({ ...form, pass: e.target.value })}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Salvar SMTP
      </button>
    </div>
  );
}

function PaymentTab({
  config,
  refresh,
}: {
  config: GlobalConfig;
  refresh: () => void;
}) {
  // Mesma lógica do SMTP para os campos StripePublicKey, StripeSecretKey, WebhookSecret
  return (
    <div className="text-slate-500 italic">
      Configure aqui as chaves do Stripe para receber as mensalidades dos
      lojistas.
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon} {label}
    </button>
  );
}
