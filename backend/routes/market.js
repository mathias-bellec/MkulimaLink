const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');
const { scrapeMarketPrices } = require('../utils/marketScraper');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 });

router.get('/prices', async (req, res) => {
  try {
    const { product, category, region, days = 30 } = req.query;
    
    const cacheKey = `prices_${product}_${category}_${region}_${days}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const query = {};
    if (product) query.product = new RegExp(product, 'i');
    if (category) query.category = category;
    if (region) query.region = region;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    query.date = { $gte: startDate };

    const prices = await MarketPrice.find(query)
      .sort('-date')
      .limit(100);

    cache.set(cacheKey, prices);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/prices/latest', async (req, res) => {
  try {
    const { category, region } = req.query;
    
    const pipeline = [
      { $sort: { date: -1 } },
      {
        $group: {
          _id: { product: '$product', region: '$region' },
          latestPrice: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestPrice' } },
      { $limit: 50 }
    ];

    if (category) {
      pipeline.unshift({ $match: { category } });
    }
    if (region) {
      pipeline.unshift({ $match: { region } });
    }

    const latestPrices = await MarketPrice.aggregate(pipeline);
    res.json(latestPrices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/prices/trends/:product', async (req, res) => {
  try {
    const { product } = req.params;
    const { region, days = 90 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      product: new RegExp(product, 'i'),
      date: { $gte: startDate }
    };
    if (region) query.region = region;

    const trends = await MarketPrice.find(query)
      .sort('date')
      .select('date price.average region market');

    const analysis = {
      product,
      dataPoints: trends.length,
      averagePrice: trends.reduce((sum, t) => sum + t.price.average, 0) / trends.length,
      minPrice: Math.min(...trends.map(t => t.price.average)),
      maxPrice: Math.max(...trends.map(t => t.price.average)),
      trends
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/prices/refresh', async (req, res) => {
  try {
    await scrapeMarketPrices();
    cache.flushAll();
    res.json({ message: 'Market prices refreshed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/regions', async (req, res) => {
  try {
    const regions = await MarketPrice.distinct('region');
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await MarketPrice.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
