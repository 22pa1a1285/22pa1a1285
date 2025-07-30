import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { log } from './utils/logger';
import Navigation from './components/Navigation';
import UrlShortener from './components/UrlShortener';
import UrlStatsComponent from './components/UrlStats';
import './App.css';

const App: React.FC = () => {
  React.useEffect(() => {
    log('frontend', 'info', 'component', 'Application started');
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/stats" element={<UrlStatsComponent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 