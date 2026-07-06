import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { trainingApi } from '../api/trainingApi';
import { TrainingType } from '../types';

const AdminPage = () => {
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm<TrainingType>();
  const [editingType, setEditingType] = useState<TrainingType | null>(null);

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  const fetchTrainingTypes = async () => {
    setIsLoading(true);
    try {
      const { data } = await trainingApi.getTrainingTypes();
      setTrainingTypes(data);
    } catch (err) {
      setError('Failed to fetch training types');
    } finally {
      setIsLoading(false);
    }
  };

  const onTypeSubmit = async (data: TrainingType) => {
    try {
      if (editingType) {
        await trainingApi.updateTrainingType(editingType.id, data);
      } else {
        await trainingApi.createTrainingType(data);
      }
      fetchTrainingTypes();
      reset();
      setEditingType(null);
    } catch (err) {
      setError(`Failed to ${editingType ? 'update' : 'create'} training type`);
    }
  };
  
  const handleEdit = (type: TrainingType) => {
    setEditingType(type);
    reset(type);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      try {
        await trainingApi.deleteTrainingType(id);
        fetchTrainingTypes();
      } catch (err) {
        setError('Failed to delete training type. It might be in use.');
      }
    }
  };

  const cancelEdit = () => {
    setEditingType(null);
    reset();
  };

  if (isLoading) return <div>Loading training types...</div>;

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{editingType ? 'Edit' : 'Create'} Training Type</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onTypeSubmit)}>
            <input {...register('name')} placeholder="Name" className="form-control mb-2" required />
            <input {...register('slug')} placeholder="Slug (e.g., rowing-machine)" className="form-control mb-2" required />
            <button type="submit" className="btn btn-primary">{editingType ? 'Update' : 'Create'}</button>
            {editingType && <button type="button" className="btn btn-secondary ml-2" onClick={cancelEdit}>Cancel</button>}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Manage Training Types</h3></div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainingTypes.map(type => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{type.slug}</td>
                  <td>{type.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn btn-sm btn-info mr-2" onClick={() => handleEdit(type)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(type.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
