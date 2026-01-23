#!/usr/bin/env node

const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MkulimaLink API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Products
app.get('/api/products', (req, res) => {
  res.json({ 
    products: [
      { _id: '1', name: 'Tomatoes', price: 2500 },
      { _id: '2', name: 'Maize', price: 1800 },
      { _id: '3', name: 'Bananas', price: 3000 }
    ] 
  });
});

// Market
app.get('/api/market', (req, res) => {
  res.json({ 
    prices: [
      { product: 'Tomatoes', price: 2500 },
      { product: 'Maize', price: 1800 },
      { product: 'Bananas', price: 3000 }
    ] 
  });
});

// Weather
app.get('/api/weather', (req, res) => {
  res.json({
    location: 'Dar es Salaam',
    temperature: 28,
    humidity: 75
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
