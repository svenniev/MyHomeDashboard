import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    nickname: '',
    heightCm: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { heightCm, ...rest } = formData;
      const dataToSubmit = {
        ...rest,
        ...(heightCm && { heightCm: parseFloat(heightCm) }),
      };
      await register(dataToSubmit);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to register');
    }
  };

  return (
    <div className="register-box" style={{ margin: 'auto', marginTop: '5%' }}>
      <div className="card">
        <div className="card-body register-card-body">
          <p className="login-box-msg">Register a new membership</p>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input name="email" placeholder="Email" onChange={handleChange} className="form-control mb-3" required type="email" />
            <input name="password" placeholder="Password" onChange={handleChange} className="form-control mb-3" required type="password" />
            <input name="firstName" placeholder="First Name" onChange={handleChange} className="form-control mb-3" required />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} className="form-control mb-3" />
            <input name="nickname" placeholder="Nickname" onChange={handleChange} className="form-control mb-3" />
            <input name="heightCm" placeholder="Height (cm)" onChange={handleChange} className="form-control mb-3" type="number" />
            <input name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} className="form-control mb-3" type="date" />
            <button type="submit" className="btn btn-primary btn-block">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
