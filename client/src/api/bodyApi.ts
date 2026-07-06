import httpClient from './httpClient';
import { BodyCompositionEntry } from '../types';

export const bodyApi = {
  getEntries: (): Promise<{ data: BodyCompositionEntry[] }> => httpClient.get('/body-composition'),
  getLatestEntry: (): Promise<{ data: BodyCompositionEntry }> => httpClient.get('/body-composition/latest'),
  createEntry: (data: Partial<BodyCompositionEntry>): Promise<{ data: BodyCompositionEntry }> => httpClient.post('/body-composition', data),
  updateEntry: (id: string, data: Partial<BodyCompositionEntry>): Promise<{ data: BodyCompositionEntry }> => httpClient.put(`/body-composition/${id}`, data),
  deleteEntry: (id: string): Promise<void> => httpClient.delete(`/body-composition/${id}`),
};
