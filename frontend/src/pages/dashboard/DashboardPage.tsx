import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { usersService } from '../../services/users.service';
import { rafflesService } from '../../services/raffles.service';
import { Raffle, User } from '../../types';
import StatCard from '../../components/shared/StatCard';
import RaffleCard from '../../components/shared/RaffleCard';
import { PlusCircle, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [openRaffles, setOpenRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, allRaffles] = await Promise.all([
          usersService.getMe(),
          rafflesService.getAll(),
        ]);
        setProfile(profileData);
        updateUser(profileData);
        setOpenRaffles(allRaffles.filter((r) => r.status === 'OPEN').slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-400">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-500 mt-1">Bem-vindo ao ProbBet — sua plataforma de probabilidade</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Seus pontos" value={profile?.points ?? 0} color="blue" description="pontos virtuais" />
        <StatCard label="Participações" value={profile?.totalParticipations ?? 0} color="purple" description="rifas diferentes" />
        <StatCard label="Vitórias" value={profile?.totalWins ?? 0} color="green" description="sorteios ganhos" />
        <StatCard
          label="Taxa de sucesso"
          value={`${profile?.successRate ?? 0}%`}
          color="amber"
          description="vitórias / participações"
        />
      </div>

      {/* Rifas abertas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Rifas abertas</h3>
          <Link to="/raffles" className="text-sm text-primary font-medium hover:underline">
            Ver todas →
          </Link>
        </div>

        {openRaffles.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-400 mb-3">Nenhuma rifa aberta no momento</p>
            <Link
              to="/raffles/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <PlusCircle size={16} /> Criar a primeira rifa
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {openRaffles.map((raffle) => <RaffleCard key={raffle.id} raffle={raffle} />)}
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/raffles/new', label: 'Criar Rifa', icon: '🎰', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { to: '/stats', label: 'Estatísticas', icon: '📊', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { to: '/ranking', label: 'Ranking', icon: '🏆', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { to: '/simulator', label: 'Simulador', icon: '🔬', color: 'bg-green-50 text-green-700 border-green-200' },
        ].map(({ to, label, icon, color }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-shadow hover:shadow-sm ${color}`}
          >
            <span className="text-2xl">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
