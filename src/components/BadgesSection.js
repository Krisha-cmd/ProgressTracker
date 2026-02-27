import React from 'react';
import './BadgesSection.css';

function BadgesSection({ userData }) {
  const { badges } = userData;

  const getBadgeClass = (badge) => {
    const name = badge?.name?.toLowerCase() || '';
    if (name.includes('guardian') || name.includes('knight')) return 'legendary';
    if (name.includes('100') || name.includes('annual')) return 'epic';
    if (name.includes('50') || name.includes('streak')) return 'rare';
    return 'common';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="badges-section card">
      <div className="card-header">
        <div className="card-icon badges-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <h2>Achievements</h2>
        <span className="badge-count">{badges?.length || 0} Badges</span>
      </div>

      <div className="badges-grid">
        {badges && badges.length > 0 ? (
          badges.map((badge, index) => (
            <div 
              key={index} 
              className={`badge-item ${getBadgeClass(badge)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="badge-icon-wrapper">
                {badge.icon ? (
                  <img src={badge.icon} alt={badge.name} className="badge-image" />
                ) : (
                  <div className="badge-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="badge-info">
                <span className="badge-name">{badge.name || 'Badge'}</span>
                <span className="badge-date">{formatDate(badge.creationDate)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-badges">
            <div className="no-badges-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <p>No badges earned yet</p>
            <span>Keep solving problems to earn badges!</span>
          </div>
        )}
      </div>

      {badges && badges.length > 0 && (
        <div className="badges-footer">
          <div className="rarity-legend">
            <span className="rarity common">Common</span>
            <span className="rarity rare">Rare</span>
            <span className="rarity epic">Epic</span>
            <span className="rarity legendary">Legendary</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgesSection;
