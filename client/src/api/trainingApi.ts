import httpClient from './httpClient';
import { TrainingLog, TrainingType } from '../types';

export const trainingApi = {
  // Training Logs
  getLogs: (): Promise<{ data: TrainingLog[] }> => httpClient.get('/training-logs'),
  createLog: (data: Partial<TrainingLog>): Promise<{ data: TrainingLog }> => httpClient.post('/training-logs', data),
  updateLog: (id: string, data: Partial<TrainingLog>): Promise<{ data: TrainingLog }> => httpClient.put(`/training-logs/${id}`, data),
  deleteLog: (id: string): Promise<void> => httpClient.delete(`/training-logs/${id}`),

  // Training Types
  getTrainingTypes: (): Promise<{ data: TrainingType[] }> => httpClient.get('/training-types'),
  createTrainingType: (data: Partial<TrainingType>): Promise<{ data: TrainingType }> => httpClient.post('/training-types', data),
  updateTrainingType: (id: string, data: Partial<TrainingType>): Promise<{ data: TrainingType }> => httpClient.put(`/training-types/${id}`, data),
  deleteTrainingType: (id: string): Promise<void> => httpClient.delete(`/training-types/${id}`),
};
