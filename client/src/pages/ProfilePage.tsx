import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usersApi } from '../api/usersApi';
import { ApplicationUser } from '../types';
import { useAuth } from '../auth/AuthContext';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationUser>();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ApplicationUser> = async (data) => {
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
        const { heightCm, ...rest } = data;
        const dataToSubmit = {
            ...rest,
            ...(heightCm && { heightCm: parseFloat(heightCm as any) }),
          };
      await usersApi.updateProfile(dataToSubmit);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isAuthLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Profile</h3>
      </div>
      <div className="card-body">
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>First Name</label>
            <input {...register('firstName', { required: true })} className="form-control" />
            {errors.firstName && <span className="text-danger">This field is required</span>}
          </div>
          <div className="mb-3">
            <label>Middle Name</label>
            <input {...register('middleName')} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Last Name</label>
            <input {...register('lastName')} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Nickname</label>
            <input {...register('nickname')} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Height (cm)</label>
            <input type="number" {...register('heightCm')} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Date of Birth</label>
            <input type="date" {...register('dateOfBirth')} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Profile Picture Path</label>
            <input {...register('profilePicturePath')} className="form-control" />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
