import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { numberWithCommas } from '../Components/Carousel';

const CoinPageCard = ({ coin, currency, symbol, loading, error }) => {
  if (loading || error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#000',
          color: 'gold',
        }}
      >
        <CircularProgress sx={{ color: 'rgb(255, 215, 0)' }} />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Please wait...</Typography>
      </Box>
    );
  }

  const profit = coin.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()] >= 0;

  return (
    <Card
      sx={{
        backgroundColor: '#1e1e1e',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        padding: { xs: '10px', sm: '20px' },
        width: '100%',
        maxWidth: '500px',
        margin: { xs: '10px auto', sm: '10px auto' },
        minHeight: { xs: 'auto', sm: 'auto' }, // Auto height for smaller screens
        boxSizing: 'border-box',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: { xs: '10px', sm: '15px' } }}>
          <img
            src={coin.image.large}
            alt={coin.name}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: '#ffcc00',
            fontSize: { xs: '16px', sm: '24px' },
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          {coin.name} ({coin.symbol.toUpperCase()})
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#bbb',
            fontSize: { xs: '12px', sm: '14px' },
            textAlign: 'center',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            margin: '0 auto',
          }}
        >
          {coin.description.en}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '14px', sm: '18px' },
            fontWeight: 'bold',
            color: '#1e7e34',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          {symbol}{numberWithCommas(coin.market_data.current_price[currency.toLowerCase()].toFixed(2))}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: profit ? '#1e7e34' : '#e03e3e',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '15px',
          }}
        >
          24h Change: {profit && '+'}{coin.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()].toFixed(2)}%
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: '8px',
            fontSize: { xs: '12px', sm: '14px' },
            color: '#bbb',
          }}
        >
          <Box>
            <Typography variant="body2"><strong>24h High/Low</strong></Typography>
            <Typography variant="body2">
              {symbol}{numberWithCommas(coin.market_data.high_24h[currency.toLowerCase()])} / {symbol}{numberWithCommas(coin.market_data.low_24h[currency.toLowerCase()])}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2"><strong>Market Cap</strong></Typography>
            <Typography variant="body2">
              {symbol}{numberWithCommas(coin.market_data.market_cap[currency.toLowerCase()])}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2"><strong>24h Volume</strong></Typography>
            <Typography variant="body2">
              {symbol}{numberWithCommas(coin.market_data.total_volume[currency.toLowerCase()])}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2"><strong>All-Time High</strong></Typography>
            <Typography variant="body2">
              {symbol}{numberWithCommas(coin.market_data.ath[currency.toLowerCase()])}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2"><strong>All-Time Low</strong></Typography>
            <Typography variant="body2">
              {symbol}{numberWithCommas(coin.market_data.atl[currency.toLowerCase()])}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoinPageCard;
