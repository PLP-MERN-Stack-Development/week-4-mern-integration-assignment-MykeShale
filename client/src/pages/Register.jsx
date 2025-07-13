import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  // 🎯 STATE - Remember form data and loading state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🎯 HOOKS - Get register function and navigation
  const { register } = useAuth();
  const navigate = useNavigate();

  // 🎯 EVENT HANDLER - Update form when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🎯 FORM VALIDATION - Check if passwords match
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    //  EMAIL VALIDATION - Check if email looks valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // 🎯 FORM SUBMIT - Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 🎯 REMOVE CONFIRM PASSWORD - Server doesn't need it
      const { confirmPassword, ...registerData } = formData;
      
      // 🎯 TRY TO REGISTER
      const result = await register(registerData);
      
      if (result.success) {
        // ✅ Registration successful - go to home page
        navigate('/');
      } else {
        // ❌ Registration failed - show error
        setError(result.error);
      }
    } catch (err) {
      // ❌ Something went wrong
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 RENDER - What the user sees
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p>Join our community and start blogging!</p>
        
        {/*  ERROR MESSAGE */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* 🎯 REGISTRATION FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary register-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/*  LINK TO LOGIN PAGE */}
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;