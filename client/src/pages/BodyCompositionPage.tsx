import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { bodyApi } from '../api/bodyApi';
import { BodyCompositionEntry } from '../types';

const BodyCompositionPage = () => {
  const [entries, setEntries] = useState<BodyCompositionEntry[]>([]);
  const [latestEntry, setLatestEntry] = useState<BodyCompositionEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<BodyCompositionEntry>();

  useEffect(() => {
    fetchEntries();
    fetchLatestEntry();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data } = await bodyApi.getEntries();
      setEntries(data);
    } catch (err) {
      setError('Failed to fetch body composition entries');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchLatestEntry = async () => {
    try {
      const { data } = await bodyApi.getLatestEntry();
      setLatestEntry(data);
    } catch (err) {
      // It's okay if there's no latest entry yet
    }
  };

  const onEntrySubmit = async (data: BodyCompositionEntry) => {
    try {
      await bodyApi.createEntry({
        ...data,
        measuredAt: new Date(data.measuredAt).toISOString(),
        weightKg: Number(data.weightKg),
        bodyFatPercent: Number(data.bodyFatPercent),
        musclePercent: Number(data.musclePercent),
        visceralFatPercent: Number(data.visceralFatPercent),
      });
      fetchEntries();
      fetchLatestEntry();
      reset();
    } catch (err) {
      setError('Failed to create entry');
    }
  };

  if (isLoading) return <div>Loading body composition data...</div>;

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Latest Metrics</h3></div>
            <div className="card-body">
              {latestEntry ? (
                <ul>
                  <li>Weight: {latestEntry.weightKg} kg</li>
                  <li>Body Fat: {latestEntry.bodyFatPercent}%</li>
                  <li>Muscle: {latestEntry.musclePercent}%</li>
                  <li>Visceral Fat: {latestEntry.visceralFatPercent}%</li>
                  <li>Measured At: {new Date(latestEntry.measuredAt).toLocaleDateString()}</li>
                </ul>
              ) : <p>No entries yet.</p>}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Add New Entry</h3></div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onEntrySubmit)}>
                <input {...register('measuredAt')} type="date" className="form-control mb-2" required />
                <input {...register('weightKg')} type="number" step="0.1" placeholder="Weight (kg)" className="form-control mb-2" />
                <input {...register('bodyFatPercent')} type="number" step="0.1" placeholder="Body Fat %" className="form-control mb-2" />
                <input {...register('musclePercent')} type="number" step="0.1" placeholder="Muscle %" className="form-control mb-2" />
                <input {...register('visceralFatPercent')} type="number" step="0.1" placeholder="Visceral Fat %" className="form-control mb-2" />
                <textarea {...register('notes')} placeholder="Notes" className="form-control mb-2" />
                <button type="submit" className="btn btn-primary">Add Entry</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">History</h3></div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Body Fat (%)</th>
                <th>Muscle (%)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.measuredAt).toLocaleDateString()}</td>
                  <td>{entry.weightKg}</td>
                  <td>{entry.bodyFatPercent}</td>
                  <td>{entry.musclePercent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BodyCompositionPage;
