import api from './api';
import { User } from '../types';

export const usersService = {
  getMe: () => api.get<User>('/users/me').then((r) => r.data),
  getRanking: () => api.get<User[]>('/users/ranking').then((r) => r.data),
};
