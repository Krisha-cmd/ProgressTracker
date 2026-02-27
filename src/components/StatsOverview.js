import React from 'react';
import './StatsOverview.css';

function StatsOverview({ userData }) {
  const { profile, contestInfo } = userData;

  const formatRank = (rank) => {
    if (!rank) return 'N/A';
    return rank.toLocaleString();
  };

  const getContestRatingColor = (rating) => {
    if (rating >= 2400) return 'guardian';
    if (rating >= 2100) return 'master';
    if (rating >= 1800) return 'expert';
    if (rating >= 1600) return 'specialist';
    if (rating >= 1400) return 'competent';
    return 'beginner';
  };

  return (
    <div className="stats-overview card">
      <div className="card-header">
        <div className="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2>Profile Overview</h2>
      </div>

      <div className="profile-header">
        <div className="avatar-container">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="avatar-ring"></div>
        </div>
        <div className="profile-info">
          <h3 className="username">{profile?.username || 'User'}</h3>
          <p className="realname">{profile?.realName || ''}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Global Rank</div>
          <div className="stat-value rank">
            <span className="rank-hash">#</span>
            {formatRank(profile?.ranking)}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Contest Rating</div>
          <div className={`stat-value rating ${getContestRatingColor(contestInfo?.rating)}`}>
            {contestInfo?.rating ? Math.round(contestInfo.rating) : 'N/A'}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Contests</div>
          <div className="stat-value">
            {contestInfo?.attended || 0}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Top %</div>
          <div className="stat-value top-percent">
            {contestInfo?.topPercentage ? `${contestInfo.topPercentage.toFixed(2)}%` : 'N/A'}
          </div>
        </div>
      </div>

      <div className="streak-section">
        <div className="streak-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20" />
          </svg>
          <div className="streak-info">
            <span className="streak-value">{profile?.contributionPoints || 0}</span>
            <span className="streak-label">Contribution</span>
          </div>
        </div>
        <div className="streak-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <div className="streak-info">
            <span className="streak-value">{profile?.reputation || 0}</span>
            <span className="streak-label">Reputation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
