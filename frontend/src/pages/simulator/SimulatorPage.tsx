import { useState } from 'react';
import { runMonteCarloSimulation } from '../../utils/probability';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

const simulationOptions = [100, 1000, 10000] as const;
type SimCount = typeof simulationOptions[number];

export default function SimulatorPage() {
  const [totalNumbers, setTotalNumbers] = useState(100);
  const [userTickets, setUserTickets] = useState(5);
  const [totalTicketsSold, setTotalTicketsSold] = useState(50);
  const [simCount, setSimCount] = useState<SimCount>(1000);
  const [result, setResult] = useState<{
    observedProbability: number;
    convergenceData: { simulation: number; probability: number }[];
  } | null>(null);
  const [running, setRunning] = useState(false);

  const theoreticalProbability = totalTicketsSold > 0
    ? parseFloat(((userTickets / totalTicketsSold) * 100).toFixed(2))
    : 0;

  function runSimulation() {
    setRunning(true);
    // setTimeout para o browser renderizar o estado de loading antes do cálculo pesado
    setTimeout(() => {
      const simulationResult = runMonteCarloSimulation(userTickets, totalNumbers, totalTicketsSold, simCount);
      setResult(simulationResult);
      setRunning(false);
    }, 50);
  }

  const convergenceDiff = result
    ? Math.abs(result.observedProbability - theoreticalProbability).toFixed(2)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Simulador Monte Carlo</h2>
        <p className="text-gray-500 mt-1">Simule sorteios e compare a probabilidade teórica com a observada</p>
      </div>

      {/* Configuração */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Configurar cenário</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total de números da rifa</label>
            <input
              type="number"
              value={totalNumbers}
              onChange={(e) => setTotalNumbers(Math.max(2, parseInt(e.target.value) || 2))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tickets do usuário</label>
            <input
              type="number"
              value={userTickets}
              onChange={(e) => setUserTickets(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total de tickets vendidos</label>
            <input
              type="number"
              value={totalTicketsSold}
              onChange={(e) => setTotalTicketsSold(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de simulações</label>
          <div className="flex gap-2">
            {simulationOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSimCount(opt)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  simCount === opt ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>

        {/* Probabilidade teórica em tempo real */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>P(vitória) teórica</strong> = {userTickets} tickets ÷ {totalTicketsSold} vendidos ={' '}
            <strong>{theoreticalProbability}%</strong>
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={running}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {running ? `Simulando ${simCount.toLocaleString('pt-BR')} sorteios...` : `▶ Simular ${simCount.toLocaleString('pt-BR')} sorteios`}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-blue-600 uppercase">P teórica</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{theoreticalProbability}%</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-green-600 uppercase">P observada</p>
              <p className="text-3xl font-bold text-green-800 mt-1">{result.observedProbability}%</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
              <p className="text-xs font-medium text-purple-600 uppercase">Diferença</p>
              <p className="text-3xl font-bold text-purple-800 mt-1">{convergenceDiff}%</p>
              <p className="text-xs text-purple-500 mt-1">|teórica − observada|</p>
            </div>
          </div>

          {/* Gráfico de convergência (Lei dos Grandes Números) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-1">Convergência — Lei dos Grandes Números</h3>
            <p className="text-sm text-gray-500 mb-4">
              Observe como a probabilidade observada converge para a teórica à medida que aumentam as simulações.
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={result.convergenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="simulation" tick={{ fontSize: 11 }} label={{ value: 'Simulações', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`]} />
                <ReferenceLine y={theoreticalProbability} stroke="#2563EB" strokeDasharray="5 3" label={{ value: `Teórica: ${theoreticalProbability}%`, position: 'right', fontSize: 10, fill: '#2563EB' }} />
                <Line type="monotone" dataKey="probability" stroke="#14B8A6" strokeWidth={2} dot={false} name="P observada" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">O que este gráfico demonstra?</p>
            <p>
              O <strong>Método de Monte Carlo</strong> repete o sorteio {simCount.toLocaleString('pt-BR')} vezes aleatoriamente.
              Pela <strong>Lei dos Grandes Números</strong>, quanto mais simulações, mais a probabilidade observada
              se aproxima da teórica ({theoreticalProbability}%). A diferença atual é de apenas {convergenceDiff}%.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
