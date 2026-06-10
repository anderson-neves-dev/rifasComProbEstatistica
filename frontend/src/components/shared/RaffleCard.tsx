import { Link } from 'react-router-dom';
import { Raffle } from '../../types';
import ProbabilityBar from './ProbabilityBar';
import { Coins, Calendar, Users } from 'lucide-react';

const statusLabel: Record<string, { text: string; className: string }> = {
  OPEN: { text: 'Aberta', className: 'bg-green-100 text-green-700' },
  DRAWN: { text: 'Sorteada', className: 'bg-gray-100 text-gray-600' },
  CANCELLED: { text: 'Cancelada', className: 'bg-red-100 text-red-700' },
};

export default function RaffleCard({ raffle }: { raffle: Raffle }) {
  const statusInfo = statusLabel[raffle.status] ?? statusLabel.OPEN;
  const soldPercentage = (raffle.totalTicketsSold / raffle.totalNumbers) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">{raffle.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      {raffle.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{raffle.description}</p>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <Coins size={12} className="text-accent" />
          <span>{raffle.ticketCost} pts/ticket</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Users size={12} />
          <span>{raffle.totalTicketsSold}/{raffle.totalNumbers}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar size={12} />
          <span>{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Barra de vendas */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Tickets vendidos</span>
          <span>{soldPercentage.toFixed(0)}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${soldPercentage}%` }} />
        </div>
      </div>

      {raffle.userTickets > 0 && (
        <div className="mb-3">
          <ProbabilityBar probability={raffle.winProbability} label="Sua probabilidade" />
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-sm font-medium text-green-600">
          🏆 Prêmio: {raffle.prizeAmount} pts
        </span>
        <Link
          to={`/raffles/${raffle.id}`}
          className="text-sm text-primary font-medium hover:underline"
        >
          {raffle.status === 'OPEN' ? 'Participar →' : 'Ver resultado →'}
        </Link>
      </div>
    </div>
  );
}
