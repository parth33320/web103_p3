const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const locationsRouter = require('./routes/locations');
const eventsRouter = require('./routes/events');
const { resetDatabase } = require('./config/reset');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/locations', locationsRouter);
app.use('/api/events', eventsRouter);

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production if available
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('API Server Running. Frontend build not found.');
    }
  });
});

// Seed mock database automatically if USE_MOCK_DB is set
if (process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test') {
  resetDatabase()
    .then(() => console.log('[Server] Mock database seeded successfully.'))
    .catch((err) => console.error('[Server] Mock database seeding error:', err));
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Express REST API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
