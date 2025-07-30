import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { log } from '../utils/logger';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const handleNavClick = (page: string) => {
    log('frontend', 'info', 'component', `Navigated to ${page} page`);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>URL Shortener</h2>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavClick('URL Shortener')}
          >
            URL Shortener
          </Link>
          <Link 
            to="/stats" 
            className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
            onClick={() => handleNavClick('Statistics')}
          >
            Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 