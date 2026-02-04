import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const planos = [
    { id: 'basic', nome: 'Iniciante', preco: '99', features: ['Até 500 pedidos/mês', 'Cardápio Digital QR Code', 'Suporte via Chat'] },
    { id: 'pro', nome: 'Professional', preco: '199', features: ['Pedidos ilimitados', 'Gestão de Estoque', 'Relatórios Avançados', 'Multi-usuários'], destaque: true },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-50">
        <div className="text-2xl font-black text-indigo-600 italic">InkFlow.</div>
        <button onClick={() => navigate('/acessar')} className="font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          Já sou cliente
        </button>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-black leading-tight tracking-tighter">
          Seu bar no <span className="text-indigo-600">piloto automático.</span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
          Elimine erros de pedidos e aumente seu faturamento com nossa plataforma de autoatendimento via QR Code.
        </p>
        <div className="mt-10">
          <a href="#planos" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
            VER PLANOS E PREÇOS
          </a>
        </div>
      </header>

      {/* Pricing Section */}
      <section id="planos" className="bg-slate-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black">Planos que crescem com você</h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {planos.map((plano) => (
            <div key={plano.id} className={`bg-white p-10 rounded-[2.5rem] shadow-sm border-2 transition-all hover:shadow-xl ${plano.destaque ? 'border-indigo-600' : 'border-white'}`}>
              {plano.destaque && <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Mais Popular</span>}
              <h3 className="text-2xl font-black mt-4">{plano.nome}</h3>
              <div className="my-6">
                <span className="text-5xl font-black text-slate-900">R$ {plano.preco}</span>
                <span className="text-slate-400 font-bold">/mês</span>
              </div>
              <ul className="space-y-4 mb-10">
                {plano.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate(`/contratar/${plano.id}`)}
                className={`w-full py-4 rounded-2xl font-black transition-all ${plano.destaque ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                COMEÇAR AGORA
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}