import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rafflesService } from '../../services/raffles.service';
import { ticketsService } from '../../services/tickets.service';
import { drawsService } from '../../services/draws.service';
import { useAuth } from '../../store/AuthContext';
import { usersService } from '../../services/users.service';
import { Raffle, Ticket, Draw } from '../../types';
import ProbabilityBar from '../../components/shared/ProbabilityBar';
import { Coins, Trophy, AlertCircle } from 'lucide-react';

export default function RaffleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadData() {
    if (!id) return;
    try {
      const [raffleData, ticketsData] = await Promise.all([
        rafflesService.getOne(id),
        ticketsService.getByRaffle(id),
      ]);
      setRaffle(raffleData);
      setTickets(ticketsData);

      if (raffleData.status === 'DRAWN') {
        const drawData = await drawsService.getByRaffle(id).catch(() => null);
        setDraw(drawData);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [id]);

  async function handleBuyTicket() {
    if (!selectedNumber || !id) return;
    setBuying(true);
    setError('');
    setSuccess('');
    try {
      await ticketsService.buy(id, selectedNumber);
      const updatedProfile = await usersService.getMe();
      updateUser(updatedProfile);
      setSuccess(`Número ${selectedNumber} comprado com sucesso!`);
      setSelectedNumber(null);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao comprar ticket');
    } finally {
      setBuying(false);
    }
  }

  async function handleExecuteDraw() {
    if (!id) return;
    setDrawing(true);
    setError('');
    try {
      const drawResult = await drawsService.execute(id);
      setDraw(drawResult);
      const updatedProfile = await usersService.getMe();
      updateUser(updatedProfile);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao executar sorteio');
    } finally {
      setDrawing(false);
    }
  }

  if (loading) return <div className="text-center text-gray-400 py-16">Carregando...</div>;
  if (!raffle) return <div className="text-center text-gray-400 py-16">Rifa não encontrada</div>;

  const soldNumbers = new Set(tickets.map((t) => t.selectedNumber));
  const userNumbers = new Set(tickets.filter((t) => t.userId === user?.id).map((t) => t.selectedNumber));

  // Verifica criador pelos dois campos para garantir
  const isCreator = raffle.creatorId === user?.id || raffle.creator?.id === user?.id;
  const isOpen = raffle.status === 'OPEN';

  const drawDateFormatted = new Date(raffle.drawDate).toLocaleDateString('pt-BR');
  const drawTimeFormatted = new Date(raffle.drawDate).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Cabeçalho */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{raffle.title}</h2>
            {raffle.description && <p className="text-gray-500 mt-1">{raffle.description}</p>}
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              raffle.status === 'OPEN' ? 'bg-green-100 text-green-700' :
              raffle.status === 'DRAWN' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
            }`}>
              {raffle.status === 'OPEN' ? 'Aberta' : raffle.status === 'DRAWN' ? 'Sorteada' : 'Cancelada'}
            </span>
            {/* Botão de editar — só aparece para o criador em rifas abertas */}
            {isCreator && isOpen && (
              <Link
                to={`/raffles/${raffle.id}/edit`}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                ✏️ Editar
              </Link>
            )}
          </div>
        </div>

        {/* 4 cards de info incluindo data/hora do sorteio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600">Custo</p>
            <p className="font-bold text-blue-800">{raffle.ticketCost} pts</p>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600">Prêmio</p>
            <p className="font-bold text-green-800">{raffle.prizeAmount} pts</p>
          </div>
          <div className="text-center bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-600">Vendidos</p>
            <p className="font-bold text-purple-800">{raffle.totalTicketsSold}/{raffle.totalNumbers}</p>
          </div>
          <div className="text-center bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-amber-600">Sorteio em</p>
            <p className="font-bold text-amber-800 text-sm">{drawDateFormatted}</p>
            <p className="text-xs text-amber-700">{drawTimeFormatted}</p>
          </div>
        </div>
      </div>

      {/* Resultado do sorteio */}
      {draw && (
        <div className={`rounded-xl border p-6 text-center ${draw.winnerId ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <Trophy size={32} className={`mx-auto mb-2 ${draw.winnerId ? 'text-green-500' : 'text-gray-400'}`} />
          <p className="text-lg font-bold">Número sorteado: {draw.winningNumber}</p>
          {draw.winner ? (
            <p className="text-green-700 mt-1">
              🏆 Vencedor: <strong>{draw.winner.name}</strong> — +{raffle.prizeAmount} pontos!
            </p>
          ) : (
            <p className="text-gray-500 mt-1">Nenhum ticket com este número. Sem vencedor.</p>
          )}
        </div>
      )}

      {/* Probabilidade do usuário */}
      {raffle.userTickets > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 className="font-semibold text-gray-800">Sua probabilidade</h3>
          <ProbabilityBar probability={raffle.winProbability} label={`${raffle.userTickets} ticket(s) seu(s)`} />
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-600">
              Valor Esperado líquido:{' '}
              <strong className={raffle.expectedValue >= 0 ? 'text-green-600' : 'text-red-500'}>
                {raffle.expectedValue > 0 ? '+' : ''}{raffle.expectedValue} pts
              </strong>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              E(X) = {raffle.prizeAmount} × {raffle.totalTicketsSold > 0 ? (raffle.userTickets / raffle.totalTicketsSold).toFixed(4) : '0'} − {raffle.ticketCost}
            </p>
          </div>
        </div>
      )}

      {/* Grade de números */}
      {isOpen && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Escolha um número</h3>
          <div className="grid grid-cols-10 gap-1.5 mb-4">
            {Array.from({ length: raffle.totalNumbers }, (_, i) => i + 1).map((num) => {
              const isSold = soldNumbers.has(num);
              const isUserNum = userNumbers.has(num);
              const isSelected = selectedNumber === num;

              return (
                <button
                  key={num}
                  onClick={() => !isSold && setSelectedNumber(isSelected ? null : num)}
                  disabled={isSold}
                  className={`aspect-square rounded text-xs font-medium transition-all ${
                    isUserNum ? 'bg-primary text-white' :
                    isSold ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                    isSelected ? 'bg-secondary text-white ring-2 ring-secondary' :
                    'bg-gray-100 hover:bg-blue-100 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary inline-block" /> Seus</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Vendidos</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary inline-block" /> Selecionado</span>
          </div>

          {selectedNumber && (
            <div className="bg-blue-50 rounded-lg p-3 mb-3 text-sm">
              <p className="text-blue-700">
                Número <strong>{selectedNumber}</strong> selecionado —
                custo: <strong>{raffle.ticketCost} pts</strong> (você tem {user?.points} pts)
              </p>
            </div>
          )}

          {error && <div className="bg-red-50 rounded-lg px-4 py-3 text-danger text-sm mb-3">{error}</div>}
          {success && <div className="bg-green-50 rounded-lg px-4 py-3 text-green-700 text-sm mb-3">{success}</div>}

          <button
            onClick={handleBuyTicket}
            disabled={!selectedNumber || buying}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <Coins size={16} />
            {buying ? 'Comprando...' : `Comprar número ${selectedNumber ?? '—'}`}
          </button>
        </div>
      )}

      {/* Botão de sorteio — só aparece para o criador em rifas abertas */}
      {isCreator && isOpen && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">Executar sorteio</p>
              <p className="text-sm text-amber-700 mt-1">
                Um número aleatório entre 1 e {raffle.totalNumbers} será sorteado.
                O vencedor receberá <strong>{raffle.prizeAmount} pontos</strong> automaticamente.
              </p>
              {error && <p className="text-danger text-sm mt-2">{error}</p>}
              <button
                onClick={handleExecuteDraw}
                disabled={drawing}
                className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {drawing ? 'Sorteando...' : '🎲 Executar sorteio agora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
