const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/api');
const { scheduleExpiryChecks } = require('./utils/cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Schedule expiry checks
scheduleExpiryChecks();

module.exports = app;