# URL Shortener Application

A React TypeScript application for shortening URLs with analytics capabilities.

## Features

- Shorten up to 5 URLs concurrently
- Custom validity periods (defaults to 30 minutes)
- Optional custom shortcodes
- URL statistics and analytics
- Responsive design
- Comprehensive logging integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will run on http://localhost:3000

## Usage

### URL Shortener Page
- Enter up to 5 URLs to shorten
- Set custom validity periods (in minutes)
- Optionally provide custom shortcodes
- View generated short URLs with expiry dates

### Statistics Page
- View all shortened URLs
- See click statistics and analytics
- Monitor URL expiry status
- View detailed click data

## API Integration

The frontend integrates with a backend microservice running on http://localhost:5000. Ensure the backend is running for full functionality.

## Logging

The application uses a custom logging middleware that sends logs to the evaluation service. All significant events are logged for monitoring and debugging purposes. 