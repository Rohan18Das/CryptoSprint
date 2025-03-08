// export const LatestDexSpotPairs = () =>
//   `https://api.coinmarketcap.com/v4/dex/spot-pairs/latest?api_key=${import.meta.env.VITE_API_KEY}`;

// export const RealTimeMarketQuotes = (contractAddress, networkId) =>
//   `https://api.coinmarketcap.com/v4/dex/pairs/quotes/latest?contract_address=${contractAddress}&network_id=${networkId}&api_key=${import.meta.env.VITE_API_KEY}`;

// export const DexMarketPairData = () =>
//   `https://api.coinmarketcap.com/v4/dex/spot-pairs/latest?api_key=${import.meta.env.VITE_API_KEY}`;

// export const TrendingCoins = (currency) =>
//   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&api_key=${import.meta.env.VITE_API_KEY}`;

// export const CoinList = (currency) =>
//   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&api_key=${import.meta.env.VITE_API_KEY}`;

// export const SingleCoin = (id) =>
//   `https://api.coingecko.com/api/v3/coins/${id}?api_key=${import.meta.env.VITE_API_KEY}`;

// export const HistoricalChart = (id, days, currency) =>
//   `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&api_key=${import.meta.env.VITE_API_KEY}`;


// export const convertCurrency = (fromCurrency, toCurrency, amount) => 
//   `https://api.fastforex.io/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}&api_key=${import.meta.env.VITE_FASTFOREX_API_KEY}`;



// Updated API functions to use your backend

// export const TrendingCoins = (currency) =>
//   `http://localhost:30001/api/trending-coins?currency=${currency}`;

// export const CoinList = (currency) =>
//   `http://localhost:30001/api/coin-list?currency=${currency}`;

// export const SingleCoin = (id) =>
//   `http://localhost:30001/api/single-coin/${id}`;

// export const HistoricalChart = (id, days, currency) =>
//   `http://localhost:30001/api/historical-chart/${id}?days=${days}&currency=${currency}`;

// export const TrendingCoins = (currency) =>
//   `/api/trending-coins?currency=${currency}`;

// export const CoinList = (currency) =>
//   `/api/coin-list?currency=${currency}`;

// export const SingleCoin = (id) =>
//   `/api/single-coin/${id}`;

// export const HistoricalChart = (id, days, currency) =>
//   `/api/historical-chart/${id}?days=${days}&currency=${currency}`;

//ApiEndpoint.jsx
export const TrendingCoins = (currency) =>
  `${import.meta.env.VITE_API_URL}/api/trending-coins?currency=${currency}`;

export const CoinList = (currency) =>
  `${import.meta.env.VITE_API_URL}/api/coin-list?currency=${currency}`;

export const SingleCoin = (id) =>
  `${import.meta.env.VITE_API_URL}/api/single-coin/${id}`;

export const HistoricalChart = (id, days, currency) =>
  `${import.meta.env.VITE_API_URL}/api/historical-chart/${id}?days=${days}&currency=${currency}`;
