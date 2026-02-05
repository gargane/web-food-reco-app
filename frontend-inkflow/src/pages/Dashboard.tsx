import { ShoppingCart, TrendingUp, Users, DollarSign } from "lucide-react";

export function Dashboard() {
  const user = JSON.parse(localStorage.getItem("@InkFlow:user") || "{}");

  const cards = [
    { title: "Vendas hoje", value: "R$ 0,00", icon: <DollarSign className="text-green-600" />, bg: "bg-green-100" },
    { title: "Pedidos pendentes", value: "0", icon: <ShoppingCart className="text-amber-600" />, bg: "bg-amber-100" },
    { title: "Novos Clientes", value: "0", icon: <Users className="text-blue-600" />, bg: "bg-blue-100" },
    { title: "Taxa de conversão", value: "0%", icon: <TrendingUp className="text-purple-600" />, bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="text-gray-500">Bem-vindo de volta, gerente da {user.tenantSlug}!</p>
      </header>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder para Gráficos/Tabelas futuras */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center border-dashed">
         <p className="text-gray-400">Gráfico de vendas em tempo real (Em breve)</p>
      </div>
    </div>
  );
}