import httpClient from './httpClient';
import { ApplicationUser } from '../types';

export const usersApi = {
  getProfile: (): Promise<{ data: ApplicationUser }> => httpClient.get('/users/me'),
  updateProfile: (data: Partial<ApplicationUser>): Promise<{ data: ApplicationUser }> => httpClient.put('/users/me', data),
};
