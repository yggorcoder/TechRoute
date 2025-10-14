import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authServie from '../services/authService.jsx';
import FormField from './FormField.jsx';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'technician',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await authServie.register(formData);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to register user.';
      setError(errorMsg);
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Create an Account</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <FormField
          label="Username"
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />

        <FormField
          label="Email address"
          type="email"
          id="email"
          name="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <FormField
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <div className="form-floating mb-3">
          <select className="form-select" id="role" name="role" value={formData.role} onChange={handleInputChange}>
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
          </select>
          <label htmlFor="role">Role</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={!!success}>
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;
