const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Root route handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Streamlabs Alert Control API is running',
    endpoints: {
      setMute: 'POST /api/alerts/set-mute',
      setSuppress: 'POST /api/alerts/set-suppress',
    }
  });
});

// CORS preflight handlers for new endpoints
app.options('/api/alerts/set-mute', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.options('/api/alerts/set-suppress', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Endpoint to get user info from Streamlabs based on token
app.get('/api/userinfo', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    console.log('Fetching user info from Streamlabs...');
    const response = await axios.get('https://streamlabs.com/api/v1.0/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Streamlabs user info response:', response.data);
    res.json(response.data.streamlabs); // Send back the streamlabs user object

  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user info',
      details: error.response?.data || { message: error.message },
    });
  }
});

// Proxy endpoint for setting mute state
app.post('/api/alerts/set-mute', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const shouldMute = req.body.mute; // Expecting { "mute": true } or { "mute": false }
    if (typeof shouldMute !== 'boolean') {
        return res.status(400).json({ error: 'Invalid request body, expected { "mute": boolean }'});
    }

    const streamlabsEndpoint = shouldMute 
      ? 'https://streamlabs.com/api/v2.0/alerts/mute_volume' 
      : 'https://streamlabs.com/api/v2.0/alerts/unmute_volume';
    
    console.log(`Calling Streamlabs endpoint: ${streamlabsEndpoint}`);

    const response = await axios.post(streamlabsEndpoint, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Set mute response:', response.data);
    // Assuming success if no error is thrown, Streamlabs might return specific data
    res.json({ success: true, details: response.data }); 

  } catch (error) {
    console.error('Error setting mute state:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to set mute state',
      details: error.response?.data || { message: error.message },
    });
  }
});

// Proxy endpoint for setting suppress state (using pause/unpause queue)
app.post('/api/alerts/set-suppress', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const shouldSuppress = req.body.suppress; // Expecting { "suppress": true } or { "suppress": false }
     if (typeof shouldSuppress !== 'boolean') {
        return res.status(400).json({ error: 'Invalid request body, expected { "suppress": boolean }'});
    }

    // Assuming pause_queue = suppress, unpause_queue = unsuppress
    const streamlabsEndpoint = shouldSuppress
        ? 'https://streamlabs.com/api/v2.0/alerts/pause_queue'
        : 'https://streamlabs.com/api/v2.0/alerts/unpause_queue';
    
    console.log(`Calling Streamlabs endpoint: ${streamlabsEndpoint}`);
    
    const response = await axios.post(streamlabsEndpoint, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Set suppress response:', response.data);
     // Assuming success if no error is thrown, Streamlabs might return specific data
    res.json({ success: true, details: response.data });

  } catch (error) {
    console.error('Error setting suppress state:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to set suppress state',
      details: error.response?.data || { message: error.message },
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The route ${req.method} ${req.url} does not exist`,
     availableRoutes: {
      root: 'GET /',
      setMute: 'POST /api/alerts/set-mute',
      setSuppress: 'POST /api/alerts/set-suppress',
      userInfo: 'GET /api/userinfo'
    }
  });
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
}); 