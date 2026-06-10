import api from './api';
import { Ticket } from '../types';

export const ticketsService = {
  buy: (raffleId: string, selectedNumber: number) =>
    api.post<Ticket>('/tickets', { raffleId, selectedNumber }).then((r) => r.data),
  getMyTickets: () => api.get<Ticket[]>('/tickets/my').then((r) => r.data),
  getByRaffle: (raffleId: string) =>
    api.get<Ticket[]>(`/tickets/raffle/${raffleId}`).then((r) => r.data),
};
