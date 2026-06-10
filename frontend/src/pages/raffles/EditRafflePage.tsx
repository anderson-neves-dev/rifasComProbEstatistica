import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { rafflesService } from '../../services/raffles.service';
import { useAuth } from '../../store/AuthContext';
import { Raffle } from '../../types';

const editSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().optional(),
  drawDate: z.string().min(1, 'Informe a data do sorteio'),
});
type EditForm = z.infer<typeof editSchema>;

export default function EditRafflePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loadingRaffle, setLoadingRaffle] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  });

  // Primeiro carrega a rifa independente do user
  useEffect(() => {
    if (!id) return;
    rafflesService.getOne(id)
      .then((data) => {
        setRaffle(data);
        const localDate = new Date(data.drawDate).toISOString().slice(0, 16);
        reset({
          title: data.title,
          description: data.description ?? '',
          drawDate: localDate,
        });
      })
      .catch(() => navigate('/raffles'))
      .finally(() => setLoadingRaffle(false));
  }, [id]);

  // Só verifica permissão depois que AMBOS estão carregados
  useEffect(() => {
    if (loadingRaffle || !raffle || !user) return;

    const isCreator = raffle.creatorId === user.id || raffle.creator?.id === user.id;
    const isOpen = raffle.status === 'OPEN';

    if (!isCreator || !isOpen) {
      navigate(`/raffles/${id}`);
    }
  }, [loadingRaffle, raffle, user]);

  async function onSubmit(data: EditForm) {
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await rafflesService.update(id, data);
      navigate(`/raffles/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao atualizar rifa');
    } finally {
      setSaving(false);
    }
  }

  if (loadingRaffle || !raffle) {
    return <div className="text-center text-gray-400 py-16">Carregando...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar rifa</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do sorteio</label>
          <input
            {...register('drawDate')}
            type="datetime-local"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {errors.drawDate && <p className="text-danger text-xs mt-1">{errors.drawDate.message}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-danger text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/raffles/${id}`)}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
