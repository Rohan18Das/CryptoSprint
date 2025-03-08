
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SingleCoin } from '../API/ApiEndPoint';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Crypto } from '../Context/CryptoContext';
import CurrencySelector from '../Components/CurrencySelector';
import { FaArrowLeft } from 'react-icons/fa';
import CoinPageCard from './CoinPageCard';
import CryptoChart from './CryptoChart';
import TradePage from './TradePage';

const CoinPage = () => {
  const { currency, symbol } = useContext(Crypto);
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch coin details');
      } finally {
        setLoading(false);
      }
    };
    fetchCoinDetails();
  }, [id]);

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

  const coinPrice = coin.market_data.current_price[currency.toLowerCase()];
  console.log(`Coin Price is ${symbol} ${coinPrice}`);

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centering content for smaller screens
        width: '100%',
        minHeight: '100vh',
        padding: { xs: '10px', sm: '20px' }, // Padding for small screens
        margin: '0',
        boxSizing: 'border-box',
        overflowX: 'hidden', // Prevent horizontal overflow
      }}
    >
      {/* Left Dashboard and Currency Selector */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        width: '100%',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack items on smaller screens
      }}>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: { xs: '8px', sm: '10px', md: '10px' },
            fontSize: { xs: '14px', sm: '16px', md: '15px' },
            ":hover": {
              backgroundColor: 'transparent',
              outline: '1px solid gold',
              border: '1px solid gold',
            },
            minWidth: { xs: 'auto', sm: '150px', md: '180px' },
          }}
        >
          <FaArrowLeft style={{ marginRight: '10px' }} />
          Dashboard
        </Button>
        <CurrencySelector />
      </Box>

      {/* Container for Card and Chart */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center', // Ensure it is centered on smaller screens
      }}>
        {/* Coin Page Card */}
        <Box sx={{
          flex: { xs: '1 1 100%', sm: '1 1 40%' },
          padding: '10px',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          <CoinPageCard coin={coin} currency={currency} symbol={symbol} />
        </Box>

        {/* Crypto Chart */}
        <Box sx={{
          flex: { xs: '1 1 100%', sm: '1 1 60%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          <CryptoChart id={id} />
        </Box>

        {/* TradePage Component */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 40%' },
            padding: '10px',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {coinPrice && coin ? <TradePage coinPrice={coinPrice} coin={coin} /> : null}
        </Box>
      </Box>
    </Box>
  );
};

export default CoinPage;
