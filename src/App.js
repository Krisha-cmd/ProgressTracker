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

  return (
    <div className="app">
      <div className="background-gradient"></div>
      <div className="background-grid"></div>
      
      <Header />
      
      <main className="main-content">        {error && (
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
      </main>

      <footer className="footer">
        <p>Built with ♥ using LeetCode API</p>
      </footer>
    </div>
  );
}

export default App;