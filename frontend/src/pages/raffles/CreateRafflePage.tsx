import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { rafflesService } from '../../services/raffles.service';
import { useAuth } from '../../store/AuthContext';

const createRaffleSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().optional(),
  totalNumbers: z.coerce.number().int().min(2, 'Mínimo 2 números').max(1000),
  ticketCost: z.coerce.number().int().min(1, 'Mínimo 1 ponto'),
  prizeAmount: z.coerce.number().int().min(1, 'Mínimo 1 ponto'),
  drawDate: z.string().min(1, 'Informe a data do sorteio'),
});
type CreateRaffleForm = z.infer<typeof createRaffleSchema>;

export default function CreateRafflePage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateRaffleForm>({
    resolver: zodResolver(createRaffleSchema),
    defaultValues: { totalNumbers: 100, ticketCost: 10, prizeAmount: 800 },
  });

  const totalNumbers = watch('totalNumbers') ?? 100;
  const ticketCost = watch('ticketCost') ?? 10;
  const prizeAmount = watch('prizeAmount') ?? 800;
  const maxRevenue = totalNumbers * ticketCost;

  async function onSubmit(data: CreateRaffleForm) {
    setLoading(true);
    setError('');
    try {
      const raffle = await rafflesService.create(data);
      navigate(`/raffles/${raffle.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar rifa');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar nova rifa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input {...register('title')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Ex: Rifa do Notebook" />
          {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
          <textarea {...register('description')} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="Descreva o prêmio..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total de números</label>
            <input {...register('totalNumbers')} type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            {errors.totalNumbers && <p className="text-danger text-xs mt-1">{errors.totalNumbers.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custo por ticket (pts)</label>
            <input {...register('ticketCost')} type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            {errors.ticketCost && <p className="text-danger text-xs mt-1">{errors.ticketCost.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prêmio (pts)</label>
            <input {...register('prizeAmount')} type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            {errors.prizeAmount && <p className="text-danger text-xs mt-1">{errors.prizeAmount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do sorteio</label>
            <input {...register('drawDate')} type="datetime-local" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            {errors.drawDate && <p className="text-danger text-xs mt-1">{errors.drawDate.message}</p>}
          </div>
        </div>

        {/* Preview probabilístico */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
          <p className="font-medium text-blue-800 mb-2">Resumo da rifa</p>
          <p className="text-blue-700">📊 Receita máxima: <strong>{maxRevenue} pts</strong> ({totalNumbers} tickets × {ticketCost} pts)</p>
          <p className="text-blue-700">🏆 Prêmio: <strong>{prizeAmount} pts</strong></p>
          <p className="text-blue-700">📉 Cada comprador tem: <strong>{totalNumbers > 0 ? (1 / totalNumbers * 100).toFixed(2) : 0}%</strong> de chance com 1 ticket</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-danger text-sm">{error}</div>}

        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Criando...' : 'Criar rifa'}
        </button>
      </form>
    </div>
  );
}
