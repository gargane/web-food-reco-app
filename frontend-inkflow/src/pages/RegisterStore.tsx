import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registerService } from '../services/auth/registerService';

export default function RegisterStore() {
  const { plano } = useParams<{ plano: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    storeSlug: '',
    ownerName: '', // Se o seu IdentityUser tiver Nome
    email: '',
    password: '',
    planoId: plano || 'basic'
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Chama seu endpoint [HttpPost("register-owner")]
      await registerService.createStore(formData);
      
      alert("Estrutura criada! Agora vamos para o pagamento.");
      
      // Aqui você redirecionaria para o Checkout (Stripe/Mercado Pago)
      // Por enquanto, voltamos para o acesso
      navigate('/acessar');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar estabelecimento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full grid md:grid-cols-5 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Lado Esquerdo: Info do Plano */}
        <div className="md:col-span-2 bg-indigo-600 p-8 text-white flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Plano Selecionado</span>
          <h3 className="text-3xl font-black mt-2 mb-6 capitalize">{plano}</h3>
          <ul className="space-y-3 text-sm opacity-90 font-medium">
            <li>✓ Checkout QR Code</li>
            <li>✓ Painel Administrativo</li>
            <li>✓ Suporte 24h</li>
          </ul>
          <button 
            onClick={() => navigate('/conhecer')}
            className="mt-8 text-xs font-bold underline opacity-70 hover:opacity-100"
          >
            Alterar plano
          </button>
        </div>

        {/* Lado Direito: Formulário */}
        <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-4">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Configurar minha loja</h2>
          
          <div className="space-y-3">
            <input 
              required
              placeholder="Nome do seu Bar/Restaurante" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600"
              onChange={e => setFormData({...formData, storeName: e.target.value})}
            />
            <input 
              required
              placeholder="link-da-loja (slug)" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-mono text-sm"
              onChange={e => setFormData({...formData, storeSlug: e.target.value})}
            />
          </div>

          <div className="h-px bg-slate-100 my-4"></div>

          <div className="space-y-3">
            <input 
              required
              type="email"
              placeholder="Seu melhor e-mail" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required
              type="password"
              placeholder="Crie uma senha forte" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "CRIANDO AMBIENTE..." : "CONTRATAR E ACESSAR"}
          </button>
        </form>
      </div>
    </div>
  );
}