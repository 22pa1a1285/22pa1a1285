import React, { useState, useEffect } from 'react';
import { log } from '../utils/logger';
import { apiService } from '../services/api';
import { UrlStats } from '../types';
import './UrlStats.css';

const UrlStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      await log('frontend', 'info', 'component', 'Loading URL statistics');
      const data = await apiService.getAllUrlStats();
      setStats(data);
      await log('frontend', 'info', 'component', `Loaded ${data.length} URL statistics`);
    } catch (error) {
      setError('Failed to load URL statistics');
      await log('frontend', 'error', 'component', `Failed to load URL statistics: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiryDate: string): boolean => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="url-stats">
        <h1>URL Statistics</h1>
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="url-stats">
      <h1>URL Statistics</h1>
      <p>Analytics for all shortened URLs</p>

      {error && <div className="error-message">{error}</div>}

      {stats.length === 0 ? (
        <div className="no-stats">
          <p>No shortened URLs found. Create some URLs first!</p>
        </div>
      ) : (
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${isExpired(stat.expiryDate) ? 'expired' : ''}`}>
              <div className="stat-header">
                <h3>Shortcode: {stat.shortcode}</h3>
                {isExpired(stat.expiryDate) && (
                  <span className="expired-badge">Expired</span>
                )}
              </div>
              
              <div className="stat-content">
                <div className="url-info">
                  <div className="original-url">
                    <strong>Original URL:</strong>
                    <span>{stat.originalUrl}</span>
                  </div>
                  <div className="dates">
                    <div><strong>Created:</strong> {formatDate(stat.creationDate)}</div>
                    <div><strong>Expires:</strong> {formatDate(stat.expiryDate)}</div>
                  </div>
                </div>

                <div className="click-stats">
                  <div className="total-clicks">
                    <strong>Total Clicks:</strong> {stat.totalClicks}
                  </div>
                  
                  {stat.clickData.length > 0 && (
                    <div className="click-details">
                      <h4>Click Details:</h4>
                      <div className="click-list">
                        {stat.clickData.map((click, clickIndex) => (
                          <div key={clickIndex} className="click-item">
                            <div className="click-time">
                              <strong>Time:</strong> {formatDate(click.timestamp)}
                            </div>
                            <div className="click-source">
                              <strong>Source:</strong> {click.source || 'Direct'}
                            </div>
                            <div className="click-location">
                              <strong>Location:</strong> {click.location || 'Unknown'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={loadStats} className="refresh-btn">
        Refresh Statistics
      </button>
    </div>
  );
};

export default UrlStatsComponent; 