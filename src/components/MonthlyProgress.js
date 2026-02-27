import React, { useState } from 'react';
import './MonthlyProgress.css';

function MonthlyProgress({ userData }) {
  const { submissions } = userData;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if a submission qualifies (medium/hard before 6:30 IST)
  const checkSubmissionQualifies = (timestamp, difficulty) => {
    if (difficulty === 'Easy') return false;
    
    const date = new Date(timestamp * 1000);
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    
    // Check if before 6:30 AM IST
    return hours < 6 || (hours === 6 && minutes < 30);
  };

  // Build calendar data
  const buildCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const calendarDays = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, qualified: false });
    }

    // Process submissions for current month
    const qualifiedDays = new Set();
    
    if (submissions && Array.isArray(submissions)) {
      submissions.forEach((sub) => {
        const timestamp = sub.timestamp;
        const difficulty = sub.difficulty;
        const date = new Date(timestamp * 1000);
        
        if (date.getFullYear() === year && date.getMonth() === month) {
          if (checkSubmissionQualifies(timestamp, difficulty)) {
            qualifiedDays.add(date.getDate());
          }
        }
      });
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;
      
      calendarDays.push({
        day,
        qualified: qualifiedDays.has(day),
        isToday,
        isPast: new Date(year, month, day) < new Date()
      });
    }

    return calendarDays;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const calendarData = buildCalendarData();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const qualifiedCount = calendarData.filter(d => d.qualified).length;
  const totalDays = calendarData.filter(d => d.day && d.isPast).length;

  return (
    <div className="monthly-progress card">
      <div className="card-header">
        <div className="card-icon calendar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h2>Morning Challenge</h2>
        <span className="challenge-badge">Before 6:30 IST</span>
      </div>

      <div className="calendar-header">
        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="month-title">{monthName}</h3>
        <button className="nav-btn" onClick={() => navigateMonth(1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
        {calendarData.map((item, index) => (
          <div
            key={index}
            className={`calendar-day ${!item.day ? 'empty' : ''} ${item.qualified ? 'qualified' : ''} ${item.isToday ? 'today' : ''}`}
          >
            {item.day && (
              <>
                <span className="day-number">{item.day}</span>
                {item.qualified && <span className="qualified-dot"></span>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-footer">
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot qualified"></span>
            <span>Solved before 6:30 AM</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot empty"></span>
            <span>No early solve</span>
          </div>
        </div>
        <div className="streak-info">
          <span className="streak-count">{qualifiedCount}</span>
          <span className="streak-text">/ {totalDays || 0} days</span>
        </div>
      </div>
    </div>
  );
}

export default MonthlyProgress;
