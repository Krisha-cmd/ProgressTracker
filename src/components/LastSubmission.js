import React from 'react';
import './LastSubmission.css';

function LastSubmission({ userData }) {
  const { recentSubmissions } = userData;

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return '';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    if (status === 'Accepted') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  };

  return (
    <div className="last-submission card">
      <div className="card-header">
        <div className="card-icon submission-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h2>Recent Submissions</h2>
      </div>

      <div className="submissions-list">
        {recentSubmissions && recentSubmissions.length > 0 ? (
          recentSubmissions.slice(0, 6).map((submission, index) => (
            <div 
              key={index} 
              className={`submission-item ${submission.statusDisplay === 'Accepted' ? 'accepted' : 'failed'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="submission-status">
                {getStatusIcon(submission.statusDisplay)}
              </div>
              
              <div className="submission-content">
                <div className="submission-header">
                  <h4 className="problem-name">{submission.title || 'Unknown Problem'}</h4>
                  <span className={`difficulty-badge ${getDifficultyClass(submission.difficulty)}`}>
                    {submission.difficulty || 'N/A'}
                  </span>
                </div>
                
                <div className="submission-meta">
                  <span className="submission-time" title={formatFullDate(submission.timestamp)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatTimestamp(submission.timestamp)}
                  </span>
                  <span className="submission-lang">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    {submission.lang || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-submissions">
            <div className="no-submissions-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <p>No recent submissions</p>
            <span>Start solving problems to see your activity here</span>
          </div>
        )}
      </div>

      {recentSubmissions && recentSubmissions.length > 0 && (
        <div className="submission-footer">
          <div className="stats-summary">
            <div className="summary-item">
              <span className="summary-value accepted">
                {recentSubmissions.filter(s => s.statusDisplay === 'Accepted').length}
              </span>
              <span className="summary-label">Accepted</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item">
              <span className="summary-value total">
                {recentSubmissions.length}
              </span>
              <span className="summary-label">Total</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LastSubmission;
