import api from './api';
import { Draw } from '../types';

export const drawsService = {
  execute: (raffleId: string) =>
    api.post<Draw>(`/draws/raffle/${raffleId}`).then((r) => r.data),
  getByRaffle: (raffleId: string) =>
    api.get<Draw>(`/draws/raffle/${raffleId}`).then((r) => r.data),
  getAll: () => api.get<Draw[]>('/draws').then((r) => r.data),
};
