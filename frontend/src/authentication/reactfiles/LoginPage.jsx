import React, { useState } from 'react';
import { useAuth } from '../reactfiles/Auth.jsx';
import { useNavigate, Link } from 'react-router-dom';
import '../styleauth/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/profile'); // Redirect to profile on successful login
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Log In</h2>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="auth-button" type="submit">
          {loading ? 'Logging In...' : 'Log In'}
        </button>
        <div className="auth-switch">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};
