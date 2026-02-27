import React, { useState, useEffect } from 'react';
import './App.css';
import StatsOverview from './components/StatsOverview';
import ProblemStats from './components/ProblemStats';
import MonthlyProgress from './components/MonthlyProgress';
import LastSubmission from './components/LastSubmission';
import BadgesSection from './components/BadgesSection';
import Header from './components/Header';
import { fetchLeetCodeData } from './services/leetcodeService';

const DEFAULT_USERNAME = 'krisha-cmd';

function App() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [inputUsername, setInputUsername] = useState(DEFAULT_USERNAME);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-load data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchLeetCodeData(DEFAULT_USERNAME);
        setUserData(data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    
    setUsername(inputUsername.trim());
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchLeetCodeData(inputUsername.trim());
      setUserData(data);
    } catch (err) {
      setError('Failed to fetch data. Please check the username and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="background-gradient"></div>
      <div className="background-grid"></div>
      
      <Header />
      
      <main className="main-content">
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Enter LeetCode username..."
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Track Progress'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-section">
            <div className="loading-card"></div>
            <div className="loading-card"></div>
            <div className="loading-card"></div>
          </div>
        )}

        {userData && !loading && (
          <div className="dashboard animate-fade-in">
            <div className="dashboard-grid">
              <StatsOverview userData={userData} />
              <ProblemStats userData={userData} />
              <MonthlyProgress userData={userData} />
              <BadgesSection userData={userData} />
              <LastSubmission userData={userData} />
            </div>
          </div>
        )}

        {!userData && !loading && !error && (
          <div className="welcome-section animate-fade-in">
            <div className="welcome-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </div>
            <h2>Track Your LeetCode Journey</h2>
            <p>Enter your LeetCode username to view your stats, badges, and daily progress</p>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon green">📊</div>
                <span>Problem Stats</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon yellow">🏆</div>
                <span>Badges & Rank</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon blue">📅</div>
                <span>Daily Progress</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon purple">⏱️</div>
                <span>Submissions</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with ♥ using LeetCode API</p>
      </footer>
    </div>
  );
}

export default App;
