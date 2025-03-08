import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material'; // Importing Box and Typography components from MUI
import axios from 'axios';
// get Currency
import { Crypto } from '../Context/CryptoContext';
import { TrendingCoins } from '../API/ApiEndPoint';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css'; // Import the carousel styles
import { Link } from 'react-router-dom';

//  number with commas function
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  // use Currency
  const { currency, symbol } = useContext(Crypto);
  const [trendings, setTrendings] = useState([]);

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrendings(data);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
    console.log('Trending Coins', trendings); 
  }, [currency]);

  const items = trendings.map((coin) => {
    const profit = coin?.price_change_percentage_24h >= 0;
    return (
      <Link to={`/coins/${coin.id}`} key={coin.id} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textTransform: 'uppercase',
            color: 'white',
            padding: '10px', // Add padding for better spacing
            margin: '5px 5px', // Add margin between items
          
          }}
        >
          <img src={coin.image} alt={coin.name} style={{ width: '50px', height: '50px', margin:'10px' }} />
          <Typography variant="h6">{coin.name}</Typography>
          <Typography variant="body2" sx={{ color: profit ? 'rgb(14, 203, 129)' : 'red' }}>
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </Typography>
          <Typography variant="body2" sx={{fontWeight:'bold'}}>{symbol}  {numberWithCommas(coin?.current_price.toFixed(2))}</Typography>
        </Box>
      </Link>
    );
  });

  // Responsive settings for AliceCarousel
  const responsive = {
    0: { items: 2 }, // Show 2 items on small screens
    512: { items: 4 }, // Show 4 items on medium screens
    1024: { items: 8 }, // Show 8 items on large screens
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        textTransform: 'uppercase',
        color: 'white',
        margin: '0 10px', // Reduce spacing between items
      }}
    >
      <AliceCarousel
        items={items}
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={2000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
      />
    </Box>
  );
};

export default Carousel;
