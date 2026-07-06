import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { goalsApi } from '../api/goalsApi';
import { Goal } from '../types';

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<Goal>();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data } = await goalsApi.getGoals();
      setGoals(data);
    } catch (err) {
      setError('Failed to fetch goals');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoalSubmit = async (data: Goal) => {
    try {
      await goalsApi.createGoal({
        ...data,
        startValue: Number(data.startValue),
        currentValue: Number(data.currentValue),
        targetValue: Number(data.targetValue),
      });
      fetchGoals();
      reset();
    } catch (err) {
      setError('Failed to create goal');
    }
  };
  
  const calculateProgress = (goal: Goal) => {
    if (goal.targetValue === goal.startValue) return 0;
    const progress = ((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (isLoading) return <div>Loading goals...</div>;

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create New Goal</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onGoalSubmit)}>
            {/* Simple form for now */}
            <input {...register('title')} placeholder="Title" className="form-control mb-2" required />
            <input {...register('startValue')} type="number" placeholder="Start Value" className="form-control mb-2" required />
            <input {...register('currentValue')} type="number" placeholder="Current Value" className="form-control mb-2" required />
            <input {...register('targetValue')} type="number" placeholder="Target Value" className="form-control mb-2" required />
            <select {...register('direction')} className="form-control mb-2">
                <option value="increase">Increase</option>
                <option value="decrease">Decrease</option>
            </select>
            <input {...register('unit')} placeholder="Unit (e.g., kg, %)" className="form-control mb-2" required />
            <input {...register('valueType')} placeholder="Value Type (e.g., weight)" className="form-control mb-2" required />
            <input {...register('startDate')} type="date" className="form-control mb-2" required />
            <button type="submit" className="btn btn-primary">Create Goal</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">My Goals</h3></div>
        <div className="card-body">
          {goals.map(goal => (
            <div key={goal.id}>
              <h5>{goal.title}</h5>
              <p>{goal.currentValue} / {goal.targetValue} {goal.unit}</p>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${calculateProgress(goal)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
