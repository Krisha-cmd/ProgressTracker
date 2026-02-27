import React from 'react';
import './ProblemStats.css';

function ProblemStats({ userData }) {
  const { problemStats } = userData;

  const stats = {
    easy: problemStats?.easy || { solved: 0, total: 0 },
    medium: problemStats?.medium || { solved: 0, total: 0 },
    hard: problemStats?.hard || { solved: 0, total: 0 },
  };

  const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;
  const totalProblems = stats.easy.total + stats.medium.total + stats.hard.total;

  const getPercentage = (solved, total) => {
    if (total === 0) return 0;
    return (solved / total) * 100;
  };

  const difficulties = [
    { key: 'easy', label: 'Easy', color: 'green', icon: '🟢' },
    { key: 'medium', label: 'Medium', color: 'yellow', icon: '🟡' },
    { key: 'hard', label: 'Hard', color: 'red', icon: '🔴' },
  ];

  // Calculate circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const totalPercentage = getPercentage(totalSolved, totalProblems);
  const strokeDashoffset = circumference - (totalPercentage / 100) * circumference;

  return (
    <div className="problem-stats card">
      <div className="card-header">
        <div className="card-icon problem-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <h2>Problem Statistics</h2>
      </div>

      <div className="progress-circle-container">
        <svg className="progress-circle" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-green)" />
              <stop offset="50%" stopColor="var(--accent-yellow)" />
              <stop offset="100%" stopColor="var(--accent-red)" />
            </linearGradient>
          </defs>
          <circle
            className="progress-bg"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            strokeWidth="12"
          />
          <circle
            className="progress-fill"
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div className="progress-text">
          <span className="progress-value">{totalSolved}</span>
          <span className="progress-label">/ {totalProblems}</span>
          <span className="progress-subtitle">Solved</span>
        </div>
      </div>

      <div className="difficulty-breakdown">
        {difficulties.map((diff) => (
          <div key={diff.key} className={`difficulty-item ${diff.color}`}>
            <div className="difficulty-header">
              <span className="difficulty-icon">{diff.icon}</span>
              <span className="difficulty-label">{diff.label}</span>
              <span className="difficulty-count">
                {stats[diff.key].solved}/{stats[diff.key].total}
              </span>
            </div>
            <div className="difficulty-bar">
              <div 
                className="difficulty-fill"
                style={{ width: `${getPercentage(stats[diff.key].solved, stats[diff.key].total)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="beats-section">
        <div className="beats-item">
          <span className="beats-value">{totalPercentage.toFixed(1)}%</span>
          <span className="beats-label">Completion Rate</span>
        </div>
      </div>
    </div>
  );
}

export default ProblemStats;
