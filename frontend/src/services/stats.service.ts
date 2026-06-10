import api from './api';
import { GlobalStats, RaffleStats } from '../types';

export const statsService = {
  getGlobal: () => api.get<GlobalStats>('/stats/global').then((r) => r.data),
  getByRaffle: (raffleId: string) =>
    api.get<RaffleStats>(`/stats/raffle/${raffleId}`).then((r) => r.data),
};
