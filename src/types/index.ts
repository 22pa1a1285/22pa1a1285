export interface ShortUrlRequest {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface ShortUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface ClickData {
  timestamp: string;
  source: string;
  location: string;
}

export interface UrlStats {
  shortcode: string;
  originalUrl: string;
  creationDate: string;
  expiryDate: string;
  totalClicks: number;
  clickData: ClickData[];
}

export interface UrlFormData {
  url: string;
  validity: number;
  shortcode: string;
} 