const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const urlDatabase = new Map();
const shortcodeToUrl = new Map();

const generateShortcode = () => {
  return nanoid(6);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidShortcode = (shortcode) => {
  return /^[a-zA-Z0-9]+$/.test(shortcode) && shortcode.length >= 3 && shortcode.length <= 10;
};

app.post('/shorturls', async (req, res) => {
  try {
    console.log('Received URL shortening request');
    
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      console.log('URL is required');
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      console.log('Invalid URL format');
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (validity < 1) {
      console.log('Validity must be at least 1 minute');
      return res.status(400).json({ error: 'Validity must be at least 1 minute' });
    }

    let finalShortcode = shortcode;
    
    if (shortcode) {
      if (!isValidShortcode(shortcode)) {
        console.log('Invalid shortcode format');
        return res.status(400).json({ error: 'Invalid shortcode format' });
      }
      
      if (shortcodeToUrl.has(shortcode)) {
        console.log('Shortcode already exists');
        return res.status(409).json({ error: 'Shortcode already exists' });
      }
    } else {
      do {
        finalShortcode = generateShortcode();
      } while (shortcodeToUrl.has(finalShortcode));
    }

    const expiryDate = new Date(Date.now() + validity * 60 * 1000);
    
    const urlData = {
      originalUrl: url,
      shortcode: finalShortcode,
      creationDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      totalClicks: 0,
      clickData: []
    };

    urlDatabase.set(finalShortcode, urlData);
    shortcodeToUrl.set(finalShortcode, url);

    const shortLink = `http://localhost:${PORT}/${finalShortcode}`;
    
    console.log(`Successfully created short URL: ${shortLink}`);
    
    res.status(201).json({
      shortLink,
      expiry: expiryDate.toISOString()
    });

  } catch (error) {
    console.error(`Error creating short URL: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    console.log(`Fetching stats for shortcode: ${shortcode}`);

    const urlData = urlDatabase.get(shortcode);
    
    if (!urlData) {
      console.log(`Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    console.log(`Successfully fetched stats for: ${shortcode}`);
    res.json(urlData);

  } catch (error) {
    console.error(`Error fetching URL stats: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shorturls', async (req, res) => {
  try {
    console.log('Fetching all URL stats');
    
    const allStats = Array.from(urlDatabase.values());
    
    console.log(`Successfully fetched ${allStats.length} URL stats`);
    res.json(allStats);

  } catch (error) {
    console.error(`Error fetching all URL stats: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    console.log(`Redirecting shortcode: ${shortcode}`);

    const urlData = urlDatabase.get(shortcode);
    
    if (!urlData) {
      console.log(`Shortcode not found for redirect: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (new Date() > new Date(urlData.expiryDate)) {
      console.log(`Expired shortcode accessed: ${shortcode}`);
      return res.status(410).json({ error: 'URL has expired' });
    }

    const clickData = {
      timestamp: new Date().toISOString(),
      source: req.get('Referer') || 'Direct',
      location: req.get('X-Forwarded-For') || req.ip || 'Unknown'
    };

    urlData.totalClicks++;
    urlData.clickData.push(clickData);

    console.log(`Redirecting ${shortcode} to ${urlData.originalUrl}`);
    res.redirect(urlData.originalUrl);

  } catch (error) {
    console.error(`Error redirecting shortcode: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 