import React, { useState } from 'react';
import { useAuth } from '../reactfiles/Auth.jsx';
import { useNavigate, Link } from 'react-router-dom';
import '../styleauth/auth.css'; 

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/profile'); // Redirect to profile on successful sign-up
    } catch (err) {
      setError('Failed to create an account. The email may already be in use.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
        </div>
        <button disabled={loading} className="auth-button" type="submit">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
};
