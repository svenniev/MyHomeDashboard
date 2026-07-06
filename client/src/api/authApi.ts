import httpClient from './httpClient';
import { ApplicationUser } from '../types';

export const authApi = {
  getMe: (): Promise<{ data: ApplicationUser | null }> => httpClient.get('/auth/me'),
  login: (credentials: any): Promise<{ data: ApplicationUser }> => httpClient.post('/auth/login', credentials),
  register: (data: any): Promise<{ data: ApplicationUser }> => httpClient.post('/auth/register', data),
  logout: (): Promise<any> => httpClient.post('/auth/logout'),
};
