const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { log } = require('./logger');

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
    await log('backend', 'info', 'controller', 'Received URL shortening request');
    
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      await log('backend', 'error', 'controller', 'URL is required');
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      await log('backend', 'error', 'controller', 'Invalid URL format');
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (validity < 1) {
      await log('backend', 'error', 'controller', 'Validity must be at least 1 minute');
      return res.status(400).json({ error: 'Validity must be at least 1 minute' });
    }

    let finalShortcode = shortcode;
    
    if (shortcode) {
      if (!isValidShortcode(shortcode)) {
        await log('backend', 'error', 'controller', 'Invalid shortcode format');
        return res.status(400).json({ error: 'Invalid shortcode format' });
      }
      
      if (shortcodeToUrl.has(shortcode)) {
        await log('backend', 'error', 'controller', 'Shortcode already exists');
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
    
    await log('backend', 'info', 'controller', `Successfully created short URL: ${shortLink}`);
    
    res.status(201).json({
      shortLink,
      expiry: expiryDate.toISOString()
    });

  } catch (error) {
    await log('backend', 'error', 'controller', `Error creating short URL: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shorturls/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    await log('backend', 'info', 'controller', `Fetching stats for shortcode: ${shortcode}`);

    const urlData = urlDatabase.get(shortcode);
    
    if (!urlData) {
      await log('backend', 'error', 'controller', `Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    await log('backend', 'info', 'controller', `Successfully fetched stats for: ${shortcode}`);
    res.json(urlData);

  } catch (error) {
    await log('backend', 'error', 'controller', `Error fetching URL stats: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/shorturls', async (req, res) => {
  try {
    await log('backend', 'info', 'controller', 'Fetching all URL stats');
    
    const allStats = Array.from(urlDatabase.values());
    
    await log('backend', 'info', 'controller', `Successfully fetched ${allStats.length} URL stats`);
    res.json(allStats);

  } catch (error) {
    await log('backend', 'error', 'controller', `Error fetching all URL stats: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    await log('backend', 'info', 'controller', `Redirecting shortcode: ${shortcode}`);

    const urlData = urlDatabase.get(shortcode);
    
    if (!urlData) {
      await log('backend', 'error', 'controller', `Shortcode not found for redirect: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (new Date() > new Date(urlData.expiryDate)) {
      await log('backend', 'warn', 'controller', `Expired shortcode accessed: ${shortcode}`);
      return res.status(410).json({ error: 'URL has expired' });
    }

    const clickData = {
      timestamp: new Date().toISOString(),
      source: req.get('Referer') || 'Direct',
      location: req.get('X-Forwarded-For') || req.ip || 'Unknown'
    };

    urlData.totalClicks++;
    urlData.clickData.push(clickData);

    await log('backend', 'info', 'controller', `Redirecting ${shortcode} to ${urlData.originalUrl}`);
    res.redirect(urlData.originalUrl);

  } catch (error) {
    await log('backend', 'error', 'controller', `Error redirecting shortcode: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, async () => {
  await log('backend', 'info', 'handler', `Server started on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
}); 