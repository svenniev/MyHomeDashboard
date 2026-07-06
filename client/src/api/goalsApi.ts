import httpClient from './httpClient';
import { Goal, GoalValueUpdate } from '../types';

export const goalsApi = {
  getGoals: (): Promise<{ data: Goal[] }> => httpClient.get('/goals'),
  createGoal: (data: Partial<Goal>): Promise<{ data: Goal }> => httpClient.post('/goals', data),
  updateGoal: (id: string, data: Partial<Goal>): Promise<{ data: Goal }> => httpClient.put(`/goals/${id}`, data),
  deleteGoal: (id: string): Promise<void> => httpClient.delete(`/goals/${id}`),
  addValueUpdate: (goalId: string, data: { value: number, note?: string }): Promise<{ data: Goal }> => httpClient.post(`/goals/${goalId}/value-updates`, data),
};
