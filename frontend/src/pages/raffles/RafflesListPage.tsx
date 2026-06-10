import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { rafflesService } from '../../services/raffles.service';
import { Raffle, RaffleStatus } from '../../types';
import RaffleCard from '../../components/shared/RaffleCard';
import { PlusCircle } from 'lucide-react';

const filterOptions: { label: string; value: RaffleStatus | 'ALL' }[] = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Abertas', value: 'OPEN' },
  { label: 'Sorteadas', value: 'DRAWN' },
];

export default function RafflesListPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filter, setFilter] = useState<RaffleStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rafflesService.getAll().then(setRaffles).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? raffles : raffles.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rifas</h2>
        <Link
          to="/raffles/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} /> Nova Rifa
        </Link>
      </div>

      <div className="flex gap-2">
        {filterOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === value ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">Carregando rifas...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400">Nenhuma rifa encontrada</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((raffle) => <RaffleCard key={raffle.id} raffle={raffle} />)}
        </div>
      )}
    </div>
  );
}
