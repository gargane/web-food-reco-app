import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService, loginSchema } from "../services/auth/authService";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Chamada única do Hook dentro do componente
  const {
    user,
    tenant,
    setIsAuthenticated,
    setUser,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  // Redirecionamento automático se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      const destination =
        user.role === "SuperAdmin" ? "/admin/dashboard" : "/dashboard";
      navigate(destination);
    }
  }, [user, authLoading, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Validação com Zod (Certifique-se que o loginSchema está importado)
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      // Pega a primeira mensagem de erro da lista de issues
      const firstError = validation.error.issues[0].message;
      setError(firstError);
      setLoading(false);
      return;
    }

    try {
      // 2. Chamada ao serviço usando os dados validados
      const { token, user: loggedUser } = await authService.login(
        validation.data,
      );

      // 3. Persistência
      localStorage.setItem("@InkFlow:token", token);
      localStorage.setItem("@InkFlow:user", JSON.stringify(loggedUser));

      // 4. Atualização do Contexto Global
      setUser(loggedUser);
      setIsAuthenticated(true);

      // 5. Redirecionamento Baseado na Role
      console.log("Login realizado com sucesso!", loggedUser);

      if (loggedUser.role === "SuperAdmin") {
        console.log("Redirecionando para o dashboard admin...");
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro no login:", err);

      // 1. Tenta pegar a mensagem do Middleware (objeto) ou do Identity (string)
      const apiResponse = err.response?.data;

      let message = "E-mail ou senha incorretos.";

      if (typeof apiResponse === "object" && apiResponse !== null) {
        // Se for o nosso objeto de manutenção { message, maintenance }
        message = apiResponse.message || "Sistema em manutenção.";
      } else if (typeof apiResponse === "string") {
        // Se for uma string simples vinda da API
        message = apiResponse;
      }

      setError(message);
      toast.error(message); // Recomendo usar o toast também para feedback visual
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
            Login Administrativo
          </p>

          <h2 className="text-3xl font-black text-slate-900 truncate">
            {tenant ? tenant.toUpperCase() : "INKFLOW"}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              E-mail
            </label>
            <input
              type="email"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Senha
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={2.5} />
                ) : (
                  <Eye size={20} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "CARREGANDO..." : "ENTRAR NO PAINEL"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-8 text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors"
        >
          ← Trocar estabelecimento
        </button>
      </div>
    </div>
  );
}
