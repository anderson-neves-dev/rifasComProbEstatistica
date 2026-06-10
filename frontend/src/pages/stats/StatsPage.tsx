import { useEffect, useState } from 'react';
import { statsService } from '../../services/stats.service';
import { GlobalStats } from '../../types';
import StatCard from '../../components/shared/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.getGlobal().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-16">Carregando estatísticas...</div>;
  if (!stats) return null;

  // Monta dados para o histograma de frequência dos números sorteados
  const frequencyMap: Record<number, number> = {};
  stats.winningNumbers.forEach((n) => { frequencyMap[n] = (frequencyMap[n] ?? 0) + 1; });
  const chartData = Object.entries(frequencyMap).map(([num, freq]) => ({ numero: num, frequencia: freq }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Central Estatística</h2>
        <p className="text-gray-500 mt-1">Análise dos números sorteados em todas as rifas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de sorteios" value={stats.totalDraws} color="blue" />
        <StatCard label="Total de rifas" value={stats.totalRaffles} color="purple" />
        <StatCard label="Total de tickets" value={stats.totalTickets} color="green" />
        <StatCard label="Números analisados" value={stats.winningNumbers.length} color="amber" />
      </div>

      {stats.totalDraws === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400">Nenhum sorteio realizado ainda. Crie e sorteie uma rifa para ver as estatísticas!</p>
        </div>
      ) : (
        <>
          {/* Medidas estatísticas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medidas dos números sorteados</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Média</p>
                <p className="text-3xl font-bold text-blue-800 mt-1">{stats.mean}</p>
                <p className="text-xs text-blue-500 mt-1">Soma ÷ quantidade</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Mediana</p>
                <p className="text-3xl font-bold text-purple-800 mt-1">{stats.median}</p>
                <p className="text-xs text-purple-500 mt-1">Valor central (ordenado)</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Moda</p>
                <p className="text-3xl font-bold text-amber-800 mt-1">{stats.mode.join(', ')}</p>
                <p className="text-xs text-amber-500 mt-1">Mais frequente(s)</p>
              </div>
            </div>
          </div>

          {/* Explicações das fórmulas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Como são calculadas</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-blue-600 font-mono font-bold">x̄</span>
                <div>
                  <strong>Média:</strong> Soma de todos os números sorteados dividida pela quantidade de sorteios.
                  <code className="block text-xs bg-gray-100 px-2 py-1 rounded mt-1">x̄ = ({stats.winningNumbers.join(' + ')}) ÷ {stats.winningNumbers.length} = {stats.mean}</code>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-purple-600 font-mono font-bold">Md</span>
                <div>
                  <strong>Mediana:</strong> Valor central após ordenar os números. Se há quantidade par, é a média dos dois centrais.
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-amber-600 font-mono font-bold">Mo</span>
                <div>
                  <strong>Moda:</strong> Número(s) que aparece(m) com maior frequência nos sorteios.
                </div>
              </div>
            </div>
          </div>

          {/* Histograma */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequência dos números sorteados</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="numero" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="frequencia" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
