import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path 
                d="M16 18l6-6-6-6M8 6l-6 6 6 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">LeetCode</span>
            <span className="logo-subtitle">Tracker</span>
          </div>
        </div>
        
        <nav className="nav-links">
          <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            LeetCode
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
