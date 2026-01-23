#!/usr/bin/env node

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
let db;

async function connectDB() {
  if (!mongoUri) {
    console.log('⚠️  MONGODB_URI not found, using demo data');
    return null;
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.log('❌ MongoDB connection failed, using demo data');
    console.log('Error:', error.message);
    return null;
  }
}

// Demo data fallback
const demoProducts = [
  { _id: '1', name: 'Tomatoes', price: 2500, category: 'Vegetables', region: 'Dar es Salaam' },
  { _id: '2', name: 'Maize', price: 1800, category: 'Grains', region: 'Dodoma' },
  { _id: '3', name: 'Bananas', price: 3000, category: 'Fruits', region: 'Arusha' }
];

const demoMarketPrices = [
  { product: 'Tomatoes', price: 2500, trend: 'up', region: 'Dar es Salaam' },
  { product: 'Maize', price: 1800, trend: 'stable', region: 'Dodoma' },
  { product: 'Bananas', price: 3000, trend: 'down', region: 'Arusha' }
];

const demoWeather = [
  { location: 'Dar es Salaam', temperature: 28, humidity: 75, condition: 'Partly Cloudy' }
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MkulimaLink API Server',
    version: '1.0.0',
    status: 'running',
    database: db ? 'MongoDB Atlas' : 'Demo Data'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: db ? 'MongoDB Atlas' : 'Demo Data'
  });
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    if (db) {
      const products = await db.collection('products').find({}).toArray();
      res.json({ products });
    } else {
      res.json({ products: demoProducts });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.json({ products: demoProducts });
  }
});

// Market
app.get('/api/market', async (req, res) => {
  try {
    if (db) {
      const prices = await db.collection('marketprices').find({}).toArray();
      res.json({ prices });
    } else {
      res.json({ prices: demoMarketPrices });
    }
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.json({ prices: demoMarketPrices });
  }
});

// Weather
app.get('/api/weather', async (req, res) => {
  try {
    if (db) {
      const weather = await db.collection('weather').find({}).toArray();
      res.json({ weather });
    } else {
      res.json({ weather: demoWeather });
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.json({ weather: demoWeather });
  }
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

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Database: ${db ? 'MongoDB Atlas' : 'Demo Data'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
