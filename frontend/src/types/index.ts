export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  createdAt: string;
  totalTickets?: number;
  totalWins?: number;
  totalParticipations?: number;
  successRate?: number;
}

export type RaffleStatus = 'OPEN' | 'DRAWN' | 'CANCELLED';

export interface Raffle {
  id: string;
  title: string;
  description?: string;
  totalNumbers: number;
  ticketCost: number;
  prizeAmount: number;
  drawDate: string;
  status: RaffleStatus;
  creatorId: string;
  creator: User;
  createdAt: string;
  totalTicketsSold: number;
  userTickets: number;
  winProbability: number;
  expectedValue: number;
  availableNumbers: number;
}

export interface Ticket {
  id: string;
  raffleId: string;
  userId: string;
  selectedNumber: number;
  raffle?: Raffle;
  user?: User;
  createdAt: string;
}

export interface Draw {
  id: string;
  raffleId: string;
  winningNumber: number;
  winnerId: string | null;
  raffle: Raffle;
  winner: User | null;
  drawDate: string;
}

export interface GlobalStats {
  totalDraws: number;
  totalRaffles: number;
  totalTickets: number;
  winningNumbers: number[];
  mean: number;
  median: number;
  mode: number[];
}

export interface RaffleStats {
  raffle: Raffle;
  draw: Draw | null;
  totalTicketsSold: number;
  availableNumbers: number;
  soldNumbers: number[];
  mean: number;
  median: number;
  mode: number[];
  absoluteFrequency: number;
  relativeFrequency: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
