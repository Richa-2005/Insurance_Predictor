import React from 'react';
import { useAuth } from '../reactfiles/Auth.jsx';
import { useNavigate } from 'react-router-dom';
import '../styleauth/profile.css';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <p className="profile-email">
          <strong>Email:</strong> {currentUser?.email || 'Guest User'}
        </p> 
        <div className="profile-history">
          <h3>Your Prediction History</h3>
          <p>This feature is coming soon! Your saved predictions will appear here.</p>
        </div>
        <button className="auth-button logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

