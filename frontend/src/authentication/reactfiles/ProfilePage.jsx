import React, { useState, useEffect } from 'react';
import { useAuth } from '../reactfiles/Auth.jsx';
import { useNavigate } from 'react-router-dom';
import { getIdToken } from 'firebase/auth';
import '../styleauth/profile.css';

// --- Sub-Component: Graph (UPDATED for Static Labels) ---
const RangeComparisonGraph = ({ userPrice, analysis }) => {
    // ... (keep the existing logic for calculating percentages etc.) ...
     if (!analysis) {
        return <p className="graph-summary">Comparison data not available for this entry.</p>;
    }
    const { min_premium, avg_premium, max_premium, age_range } = analysis;

    if (min_premium == null || max_premium == null || avg_premium == null ) {
        return <p className="graph-summary">Incomplete comparison data for age group {age_range}.</p>;
    }
     const range = max_premium - min_premium;
     if (range === 0) {
        // Handle case with only one data point or min equals max
         return (
            <div className="comparison-graph history-graph">
                 <div className="static-graph-labels">
                    <span className="static-label user">Your Est: ₹{userPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                    <span className="static-label avg">Avg: ₹{avg_premium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                 </div>
                <p className="graph-summary">
                    Only one data point found for ages {age_range}. Average: ₹{avg_premium.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
             </div>
         );
    }

    let userPercent = ((userPrice - min_premium) / range) * 100;
    let avgPercent = ((avg_premium - min_premium) / range) * 100;

    userPercent = Math.max(0, Math.min(100, userPercent));
    avgPercent = Math.max(0, Math.min(100, avgPercent));


    return (
        <div className="comparison-graph history-graph">
            {/* --- NEW: Static Labels ABOVE the track --- */}
            <div className="static-graph-labels">
                <span className="static-label user">Your Estimate: ₹{userPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                <span className="static-label avg">Average: ₹{avg_premium.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>

            {/* --- Graph Track & Markers (No change here) --- */}
            <div className="graph-track">
                <div className="user-marker" style={{ left: `${userPercent}%` }}></div>
                <div className="average-marker" style={{ left: `${avgPercent}%` }}></div>
            </div>

            {/* --- Min/Max Labels (No change here) --- */}
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


// --- Sub-Component: History Item Card (UPDATED Structure) ---
const HistoryItemCard = ({ item }) => {
    const { input, output, analysis, timestamp, predictorType } = item;


    const formattedDate = new Date(timestamp).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const monthlyCost = output / 12;

    return (
        <div className="history-item-card">
            <div className="history-item-header">
                <span className="history-item-date">{formattedDate}</span>
                <span className={`history-item-type type-${predictorType}`}>{predictorType}</span>
            </div>
            {/* --- UPDATED BODY STRUCTURE --- */}
            <div className="history-item-body">
                {/* Prediction Value Moved Up */}
                <div className="history-item-prediction">
                    <p className="history-item-label">Estimated Premium:</p>
                    <p className="history-item-value">₹{output.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    <div className="monthly-breakdown history-monthly"> {/* Added history-monthly class */}
                      <p>≈ ₹{monthlyCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} per month</p>
                    </div>
                </div>
                {/* Graph Now Below Prediction */}
                <div className="history-item-graph">
                    {analysis ? (
                        <RangeComparisonGraph userPrice={output} analysis={analysis} />
                    ) : (
                        <p className="graph-summary">Comparison graph not available.</p>
                    )}
                </div>
            </div>
             {/* --- END OF UPDATED BODY STRUCTURE --- */}
            <div className="history-item-inputs">
                 <p><strong>Inputs Used:</strong>
                    {input?.age !== undefined ? ` Age: ${input.age},` : ''}
                    {input?.bmi !== undefined ? ` BMI: ${input.bmi.toFixed(2)},` : ''} {/* Added rounding */}
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

    useEffect(() => {
        const fetchHistory = async () => {
             if (!currentUser || currentUser.isAnonymous) {
                setError('Please log in to view history.');
                setLoading(false);
                setHistory([]);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const token = await getIdToken(currentUser);
                const response = await fetch('http://localhost:8000/api/history', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
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
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error("Failed to log out:", err);
        }
    };

    const filteredHistory = history.filter(item => item.predictorType === activeTab);

    return (
        // Changed container for grid layout
        <div className="profile-grid-container">
            {/* Left Column: Sticky Profile Info */}
            <aside className="profile-sidebar">
                <div className="profile-card profile-info-card"> {/* Added class */}
                    <h2 className="profile-title">Profile</h2>
                    <p className="profile-email">
                        <strong>Email:</strong> {currentUser?.email || 'Guest User'}
                    </p>
                    <button className="auth-button logout-button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Right Column: History Section */}
            <main className="profile-main-content">
                <div className="profile-history"> {/* Removed profile-card class */}
                    <h3>Your Prediction History</h3>

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
                            disabled
                        >
                            Car
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'life' ? 'active' : ''}`}
                            onClick={() => setActiveTab('life')}
                            disabled
                        >
                            Life
                        </button>
                    </div>

                    <div className="history-list">
                        {loading && <p>Loading history...</p>}
                        {error && <p className="auth-error">{error}</p>}
                        {!loading && !error && filteredHistory.length === 0 && (
                            <p>No predictions saved for the '{activeTab}' category yet.</p>
                        )}
                        {!loading && !error && filteredHistory.map(item => (
                            <HistoryItemCard key={item.id || item.timestamp} item={item} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

