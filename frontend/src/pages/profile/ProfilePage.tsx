import { useEffect, useState } from 'react';
import { usersService } from '../../services/users.service';
import { useAuth } from '../../store/AuthContext';
import { User } from '../../types';
import StatCard from '../../components/shared/StatCard';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersService.getMe().then((data) => {
      setProfile(data);
      updateUser(data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-16">Carregando...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Perfil</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Pontos" value={profile?.points ?? 0} color="blue" description="pontos virtuais" />
          <StatCard label="Vitórias" value={profile?.totalWins ?? 0} color="green" />
          <StatCard label="Participações" value={profile?.totalParticipations ?? 0} color="purple" description="rifas distintas" />
          <StatCard label="Taxa de sucesso" value={`${profile?.successRate ?? 0}%`} color="amber" description="vitórias/participações" />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 text-sm text-blue-800">
        <p className="font-semibold mb-2">Como funcionam os pontos?</p>
        <ul className="space-y-1 text-blue-700">
          <li>✅ Cadastro: <strong>+100 pontos</strong> (iniciais)</li>
          <li>🎟️ Comprar ticket: <strong>−custo do ticket</strong></li>
          <li>🏆 Ganhar sorteio: <strong>+prêmio da rifa</strong></li>
        </ul>
      </div>
    </div>
  );
}
