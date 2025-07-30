import React, { useState } from 'react';
import { log } from '../utils/logger';
import { apiService } from '../services/api';
import { UrlFormData, ShortUrlResponse } from '../types';
import './UrlShortener.css';

interface UrlResult {
  originalUrl: string;
  shortUrl: string;
  expiry: string;
}

const UrlShortener: React.FC = () => {
  const [urls, setUrls] = useState<UrlFormData[]>([
    { url: '', validity: 30, shortcode: '' }
  ]);
  const [results, setResults] = useState<UrlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: 30, shortcode: '' }]);
      log('frontend', 'info', 'component', 'Added new URL input field');
    }
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      log('frontend', 'info', 'component', `Removed URL input field at index ${index}`);
    }
  };

  const updateUrl = (index: number, field: keyof UrlFormData, value: string | number) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    for (const urlData of urls) {
      if (!urlData.url.trim()) {
        setError('All URLs are required');
        return false;
      }
      if (!validateUrl(urlData.url)) {
        setError('Please enter valid URLs');
        return false;
      }
      if (urlData.validity < 1) {
        setError('Validity must be at least 1 minute');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await log('frontend', 'info', 'component', 'Starting URL shortening process');

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const newResults: UrlResult[] = [];

      for (const urlData of urls) {
        if (urlData.url.trim()) {
          const request = {
            url: urlData.url,
            validity: urlData.validity,
            shortcode: urlData.shortcode || undefined
          };

          const response: ShortUrlResponse = await apiService.createShortUrl(request);
          
          newResults.push({
            originalUrl: urlData.url,
            shortUrl: response.shortLink,
            expiry: response.expiry
          });
        }
      }

      setResults(newResults);
      await log('frontend', 'info', 'component', `Successfully shortened ${newResults.length} URLs`);
    } catch (error) {
      setError('Failed to create short URLs. Please try again.');
      await log('frontend', 'error', 'component', `URL shortening failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-shortener">
      <h1>URL Shortener</h1>
      <p>Shorten up to 5 URLs at once</p>

      <form onSubmit={handleSubmit} className="url-form">
        {urls.map((urlData, index) => (
          <div key={index} className="url-input-group">
            <div className="input-row">
              <input
                type="url"
                placeholder="Enter long URL"
                value={urlData.url}
                onChange={(e) => updateUrl(index, 'url', e.target.value)}
                required
                className="url-input"
              />
              <input
                type="number"
                placeholder="Validity (minutes)"
                value={urlData.validity}
                onChange={(e) => updateUrl(index, 'validity', parseInt(e.target.value) || 30)}
                min="1"
                className="validity-input"
              />
              <input
                type="text"
                placeholder="Custom shortcode (optional)"
                value={urlData.shortcode}
                onChange={(e) => updateUrl(index, 'shortcode', e.target.value)}
                className="shortcode-input"
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="form-actions">
          {urls.length < 5 && (
            <button type="button" onClick={addUrlField} className="add-btn">
              Add Another URL
            </button>
          )}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Short URLs'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <div className="results">
          <h2>Shortened URLs</h2>
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <div className="original-url">
                <strong>Original:</strong> {result.originalUrl}
              </div>
              <div className="short-url">
                <strong>Short:</strong> 
                <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                  {result.shortUrl}
                </a>
              </div>
              <div className="expiry">
                <strong>Expires:</strong> {new Date(result.expiry).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlShortener; 