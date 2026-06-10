import api from './api';
import { Raffle } from '../types';

export const rafflesService = {
  getAll: () => api.get<Raffle[]>('/raffles').then((r) => r.data),

  getOne: (id: string) => api.get<Raffle>(`/raffles/${id}`).then((r) => r.data),

  create: (data: {
    title: string;
    description?: string;
    totalNumbers: number;
    ticketCost: number;
    prizeAmount: number;
    drawDate: string;
  }) => api.post<Raffle>('/raffles', data).then((r) => r.data),

  update: (id: string, data: { title?: string; description?: string; drawDate?: string }) =>
    api.patch<Raffle>(`/raffles/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/raffles/${id}`),
};
