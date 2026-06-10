import { useEffect, useState } from 'react';
import { usersService } from '../../services/users.service';
import { useAuth } from '../../store/AuthContext';
import { User } from '../../types';
import { Trophy, Medal } from 'lucide-react';

export default function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersService.getRanking().then(setRanking).finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ranking</h2>
        <p className="text-gray-500 mt-1">Ordenado por número de vitórias</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">Carregando ranking...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Jogador</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pontos</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Vitórias</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Participações</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Taxa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ranking.map((u, index) => (
                <tr key={u.id} className={`transition-colors ${u.id === user?.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-lg">{medals[index] ?? `${index + 1}º`}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        {u.id === user?.id && <p className="text-xs text-primary">você</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">{u.points}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-medium">
                      {u.totalWins ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">{u.totalParticipations ?? 0}</td>
                  <td className="px-4 py-4 text-center text-gray-600">{u.successRate ?? 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
