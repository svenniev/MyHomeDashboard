import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { trainingApi } from '../api/trainingApi';
import { TrainingLog, TrainingType } from '../types';

const TrainingPage = () => {
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<TrainingLog>();

  useEffect(() => {
    fetchLogs();
    fetchTrainingTypes();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await trainingApi.getLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch training logs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrainingTypes = async () => {
    try {
      // Assuming you have an endpoint for training types
      const { data } = await trainingApi.getTrainingTypes();
      setTrainingTypes(data);
    } catch (err) {
      console.error("Could not fetch training types");
    }
  };
  
  const onLogSubmit = async (data: any) => {
    try {
      await trainingApi.createLog({
        ...data,
        startedAt: new Date(data.startedAt).toISOString(),
        durationSeconds: Number(data.durationSeconds) || null,
        caloriesConsumed: Number(data.caloriesConsumed) || null,
        summaryJson: JSON.parse(data.summaryJson || '{}'),
      });
      fetchLogs();
      reset();
    } catch (err) {
      setError('Failed to create training log. Make sure summary is valid JSON.');
    }
  };

  if (isLoading) return <div>Loading training logs...</div>;

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      
      <div className="card">
        <div className="card-header"><h3 className="card-title">Add Manual Log</h3></div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onLogSubmit)}>
            <select {...register('trainingTypeId')} className="form-control mb-2" required>
              <option value="">Select Training Type</option>
              {trainingTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input {...register('startedAt')} type="datetime-local" className="form-control mb-2" required />
            <input {...register('durationSeconds')} type="number" placeholder="Duration (seconds)" className="form-control mb-2" />
            <input {...register('caloriesConsumed')} type="number" placeholder="Calories" className="form-control mb-2" />
            <textarea {...register('summaryJson')} placeholder='Summary JSON, e.g., {"distanceMeters": 5000}' className="form-control mb-2" />
            <button type="submit" className="btn btn-primary">Add Log</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Recent Training</h3></div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Duration (s)</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{trainingTypes.find(t => t.id === log.trainingTypeId)?.name || 'Unknown'}</td>
                  <td>{new Date(log.startedAt).toLocaleString()}</td>
                  <td>{log.durationSeconds}</td>
                  <td><pre>{JSON.stringify(log.summaryJson, null, 2)}</pre></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
