import { log } from '../utils/logger';
import { ShortUrlRequest, ShortUrlResponse, UrlStats } from '../types';

const API_BASE_URL = 'http://localhost:5000';

export const apiService = {
  async createShortUrl(request: ShortUrlRequest): Promise<ShortUrlResponse> {
    try {
      await log('frontend', 'info', 'service', `Creating short URL for: ${request.url}`);
      
      const response = await fetch(`${API_BASE_URL}/shorturls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await log('frontend', 'info', 'service', `Successfully created short URL: ${data.shortLink}`);
      
      return data;
    } catch (error) {
      await log('frontend', 'error', 'service', `Failed to create short URL: ${error}`);
      throw error;
    }
  },

  async getUrlStats(shortcode: string): Promise<UrlStats> {
    try {
      await log('frontend', 'info', 'service', `Fetching stats for shortcode: ${shortcode}`);
      
      const response = await fetch(`${API_BASE_URL}/shorturls/${shortcode}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await log('frontend', 'info', 'service', `Successfully fetched stats for: ${shortcode}`);
      
      return data;
    } catch (error) {
      await log('frontend', 'error', 'service', `Failed to fetch stats for ${shortcode}: ${error}`);
      throw error;
    }
  },

  async getAllUrlStats(): Promise<UrlStats[]> {
    try {
      await log('frontend', 'info', 'service', 'Fetching all URL stats');
      
      const response = await fetch(`${API_BASE_URL}/shorturls`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await log('frontend', 'info', 'service', `Successfully fetched ${data.length} URL stats`);
      
      return data;
    } catch (error) {
      await log('frontend', 'error', 'service', `Failed to fetch all URL stats: ${error}`);
      throw error;
    }
  }
}; 