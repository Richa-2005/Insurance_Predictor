import React, { useState, useEffect } from 'react';
import { useAuth } from '../reactfiles/Auth.jsx';
import { useNavigate } from 'react-router-dom';
import { getIdToken } from 'firebase/auth';
import '../styleauth/profile.css';

// --- Sub-Component: Graph (Copied from MedicalPage for reuse) ---
// Ideally, refactor this into its own component file later
const RangeComparisonGraph = ({ userPrice, analysis }) => {
  if (!analysis) {
    return <p className="graph-summary">Comparison data not available for this entry.</p>;
  }
  const { min_premium, avg_premium, max_premium, age_range } = analysis;

  // Added check for undefined/null premiums and range being zero
  if (min_premium == null || max_premium == null || avg_premium == null) {
      return <p className="graph-summary">Incomplete comparison data for age group {age_range}.</p>;
  }
  const range = max_premium - min_premium;
  if (range === 0) {
      // Handle edge case where min and max are the same
      return (
          <div className="comparison-graph history-graph">
              <p className="graph-summary">
                  Only one data point found for ages {age_range}. Your estimate: ₹{userPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})} vs Average: ₹{avg_premium.toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
          </div>
      );
  }


  let userPercent = ((userPrice - min_premium) / range) * 100;
  let avgPercent = ((avg_premium - min_premium) / range) * 100;

  userPercent = Math.max(0, Math.min(100, userPercent));
  avgPercent = Math.max(0, Math.min(100, avgPercent));

  return (
    <div className="comparison-graph history-graph"> {/* Added class for specific styling */}
      <div className="graph-label-container">
        <div className="graph-label user-label" style={{ left: `${userPercent}%` }}>
          Your Est: ₹{userPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}
        </div>
        <div className="graph-label avg-label" style={{ left: `${avgPercent}%` }}>
          Avg: ₹{avg_premium.toLocaleString('en-IN', {maximumFractionDigits: 0})}
        </div>
      </div>
      <div className="graph-track">
        <div className="user-marker" style={{ left: `${userPercent}%` }}></div>
        <div className="average-marker" style={{ left: `${avgPercent}%` }}></div>
      </div>
      <div className="graph-min-max-labels">
        <span>Min: ₹{min_premium.toLocaleString('en-IN')}</span>
        <span>Max: ₹{max_premium.toLocaleString('en-IN')}</span>
      </div>
      <p className="graph-summary">
        Comparison for ages {age_range}.
      </p>
    </div>
  );
};


// --- Sub-Component: History Item Card ---
const HistoryItemCard = ({ item }) => {
  const { input, output, analysis, timestamp, predictorType } = item;

  // Format date nicely
  const formattedDate = new Date(timestamp).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="history-item-card">
      <div className="history-item-header">
        <span className="history-item-date">{formattedDate}</span>
        <span className={`history-item-type type-${predictorType}`}>{predictorType}</span>
      </div>
      <div className="history-item-body">
        <div className="history-item-prediction">
          <p className="history-item-label">Estimated Premium:</p>
          <p className="history-item-value">₹{output.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="history-item-graph">
          {analysis ? (
            <RangeComparisonGraph userPrice={output} analysis={analysis} />
          ) : (
            <p className="graph-summary">Comparison graph not available.</p>
          )}
        </div>
      </div>
      <div className="history-item-inputs">
        {/* Added checks for input existence */}
        <p><strong>Inputs Used:</strong>
           {input?.age !== undefined ? ` Age: ${input.age},` : ''}
           {input?.bmi !== undefined ? ` BMI: ${input.bmi},` : ''}
           {input?.numberOfMajorSurgeries !== undefined ? ` Surgeries: ${input.numberOfMajorSurgeries},` : ''}
           {input?.anyTransplants !== undefined ? ` Transplants: ${input.anyTransplants === 1 ? 'Yes' : 'No'}` : ''}
        </p>
      </div>
    </div>
  );
};


// --- Main Profile Page Component ---
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('medical'); // Default tab

  // --- Fetch History on Mount ---
  useEffect(() => {
    const fetchHistory = async () => {
      // Added check to ensure currentUser exists before trying to get token
      if (!currentUser || currentUser.isAnonymous) {
        setError('Please log in to view history.');
        setLoading(false);
        setHistory([]); // Clear history if user isn't properly logged in
        return; // Stop execution if not logged in properly
      }

      setLoading(true);
      setError('');
      try {
        const token = await getIdToken(currentUser);
        const response = await fetch('http://localhost:8000/api/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch history.');
        }

        const data = await response.json();
        setHistory(data);

      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.message);
        setHistory([]); // Clear history on error
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]); // Re-fetch if user changes (e.g., logs out and back in)

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out:", err);
      // Optional: Show an error message to the user
    }
  };

  // Filter history based on the active tab
  const filteredHistory = history.filter(item => item.predictorType === activeTab);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <p className="profile-email">
          <strong>Email:</strong> {currentUser?.email || 'Guest User'}
        </p>

        {/* --- Prediction History Section --- */}
        <div className="profile-history">
          <h3>Your Prediction History</h3>

          {/* --- Tabs --- */}
          <div className="history-tabs">
            <button
              className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical
            </button>
            <button
              className={`tab-button ${activeTab === 'car' ? 'active' : ''}`}
              onClick={() => setActiveTab('car')}
              disabled // Disable until implemented
            >
              Car
            </button>
            <button
              className={`tab-button ${activeTab === 'life' ? 'active' : ''}`}
              onClick={() => setActiveTab('life')}
              disabled // Disable until implemented
            >
              Life
            </button>
          </div>

          {/* --- History List --- */}
          <div className="history-list">
            {loading && <p>Loading history...</p>}
            {error && <p className="auth-error">{error}</p>}
            {!loading && !error && filteredHistory.length === 0 && (
              <p>No predictions saved for the '{activeTab}' category yet.</p>
            )}
            {!loading && !error && filteredHistory.map(item => (
              // Use item.id as key if available from Firestore, otherwise index (less ideal)
              <HistoryItemCard key={item.id || item.timestamp} item={item} />
            ))}
          </div>
        </div>

        <button className="auth-button logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

