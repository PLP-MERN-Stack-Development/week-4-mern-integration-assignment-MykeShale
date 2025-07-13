import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  // 🎯 STATE - This is like a memory box for our component
  // useState is a React hook that lets us remember things
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🎯 HOOKS - These are like tools we get from React
  const { login } = useAuth(); // Get login function from our auth system
  const navigate = useNavigate(); // This helps us move to different pages

  // 🎯 EVENT HANDLER - This runs when user types in the form
  const handleChange = (e) => {
    // e.target.name = which input field (email or password)
    // e.target.value = what the user typed
    setFormData({
      ...formData, // Keep the old values
      [e.target.name]: e.target.value // Update the specific field
    });
  };

  // �� FORM SUBMIT - This runs when user clicks "Login"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true); // Show loading spinner
    setError(''); // Clear any old errors

    try {
      // �� TRY TO LOGIN
      const result = await login(formData);
      
      if (result.success) {
        // ✅ Login successful - go to home page
        navigate('/');
      } else {
        // ❌ Login failed - show error
        setError(result.error);
      }
    } catch (err) {
      // ❌ Something went wrong
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // 🎯 RENDER - This is what the user sees
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p>Sign in to your account</p>
        
        {/* �� ERROR MESSAGE */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* 🎯 LOGIN FORM */}
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* 🎯 LINK TO REGISTER PAGE */}
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 