import React, { useEffect, useState, useRef, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Box, Typography, Select, MenuItem, CircularProgress, IconButton, FormControl } from '@mui/material';
import { HistoricalChart } from '../API/ApiEndPoint';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

import { Crypto } from '../Context/CryptoContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  zoomPlugin,
);

// Define the time ranges for the Select dropdown
const timeRanges = [
  { label: "24 Hours", value: "1d" },
  { label: "48 Hours", value: "2d" },
  { label: "1 Week", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
  { label: "60 Days", value: "60d" },
  { label: "90 Days", value: "90d" },
  { label: "6 Months", value: "180d" },
  { label: "1 Year", value: "365d" },
];

const CryptoChart = ({ id }) => {
  const [timeRange, setTimeRange] = useState('1d');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);

  const { currency, symbol } = useContext(Crypto);

  // Cache to store fetched data
  const chartCache = useRef({});

  // Fetch chart data from the API
  const fetchChartData = async (days) => {
    setLoading(true);
    const cacheKey = `${id}-${days}-${currency}`;
    if (chartCache.current[cacheKey]) {
      // Use cached data if available
      setChartData(chartCache.current[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const endpoint = HistoricalChart(id, days, currency);
      const { data } = await axios.get(endpoint);

      const prices = data.prices.map(([timestamp, price]) => ({
        x: new Date(timestamp),
        y: price,
      }));

      const newChartData = {
        labels: prices.map((point) => point.x),
        datasets: [
          {
            label: `${symbol} Price`,
            data: prices.map((point) => point.y),
            fill: true,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: '#0c6cf1',
            segment: {
              borderColor: (ctx) => {
                const index = ctx.p0DataIndex;
                const prevPrice = prices[index - 1]?.y;
                const currentPrice = prices[index]?.y;
                const nextPrice = prices[index + 1]?.y;

                if (!prevPrice || !currentPrice || !nextPrice) return 'transparent'; // Handle edge cases

                if (currentPrice > prevPrice && nextPrice >= currentPrice) {
                  return 'green'; // green to green
                } else if (currentPrice > prevPrice && nextPrice < currentPrice) {
                  return 'red'; // green to red
                } else if (currentPrice < prevPrice && nextPrice > currentPrice) {
                  return 'green'; // red to green
                } else if (currentPrice < prevPrice && nextPrice <= currentPrice) {
                  return 'red'; // red to red
                } else {
                  return currentPrice > prevPrice ? 'green' : 'red'; // Default case
                }
              },
              backgroundColor: 'rgba(12, 108, 241, 0.1)',
            },
          },
        ],
      };

      // Cache the fetched data
      chartCache.current[cacheKey] = newChartData;
      setChartData(newChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchChartData(timeRange);
  }, [id, currency, timeRange]);

  // Handle time range changes
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (chartRef.current) {
      if (!isFullscreen) {
        chartRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: '10px', md: '20px' },
        borderRadius: '10px',
        backgroundColor: 'rgba(16, 14, 14, 0.8)',
        width: { xs: '100%', md: '75%' },
        margin: 'auto',
      }}
    >
      {/* Header with toggle fullscreen button */}
      <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>
        {symbol.toUpperCase()} Historical Chart
        <IconButton onClick={toggleFullscreen} sx={{ color: 'white', marginLeft: '10px' }}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </Typography>

      {/* Time range selector */}
      <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            sx={{ color: 'white', border: '1px solid white', padding: '5px', borderRadius: '5px' }}
          >
            {timeRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Chart or loading spinner */}
      {loading ? (
        <CircularProgress style={{ color: 'gold', display: 'block', margin: 'auto' }} size={60} thickness={4} />
      ) : (
        <Box ref={chartRef} sx={{ height: '400px' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `Price: ${symbol}${context.raw}`,
                  },
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                  },
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true,
                    },
                    mode: 'x',
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.3,
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Time', color: 'white' },
                  type: 'time',
                  time: {
                    unit: 'day',
                  },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: {
                    source: 'auto',
                    autoSkip: true,
                    maxTicksLimit: 10,
                    color: 'white',
                  },
                },
                y: {
                  title: { display: true, text: `Price (${symbol.toUpperCase()})`, color: 'white' },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' },
                  ticks: {
                    color: 'white',
                    callback: function(value) {
                      return `${symbol}${value}`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CryptoChart;
