require('dotenv').config(); // Load environment variables

const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1000 }); // Cache data for 16.7 minutes

// Helper function to fetch and cache data
const fetchData = async (cacheKey, url, res) => {
  if (cache.has(cacheKey)) {
    console.log(`Returning cached data for ${cacheKey}`);
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get(url);
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    // Detailed logging
    console.error(`Error fetching ${cacheKey}:`, error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    res.status(500).json({ error: `Failed to fetch ${cacheKey}` });
  }
};

// Route to fetch trending coins
router.get("/trending-coins", (req, res) => {
  const { currency = "inr" } = req.query; // Default currency: INR
  const cacheKey = `trending-coins-${currency}`;
  const url = `${process.env.COIN_GECKO_API_URL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
  fetchData(cacheKey, url, res);
});

// Route to fetch a list of coins
router.get("/coin-list", (req, res) => {
  const { currency = "inr" } = req.query;
  const cacheKey = `coin-list-${currency}`;
  const url = `${process.env.COIN_GECKO_API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  fetchData(cacheKey, url, res);
});

// Route to fetch a single coin's details
router.get("/single-coin/:id", (req, res) => {
  const { id } = req.params;
  const cacheKey = `single-coin-${id}`;
  const url = `${process.env.COIN_GECKO_API_URL}/coins/${id}`;
  fetchData(cacheKey, url, res);
});

// Route to fetch historical data for a coin
router.get("/historical-chart/:id", (req, res) => {
  const { id } = req.params;
  const { days = 1, currency = "inr" } = req.query;
  const cacheKey = `historical-chart-${id}-${days}-${currency}`;
  const url = `${process.env.COIN_GECKO_API_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  fetchData(cacheKey, url, res);
});

module.exports = router;
