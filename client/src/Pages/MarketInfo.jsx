import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MarketInfo = () => {
  const [marketData, setMarketData] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topVolumes, setTopVolumes] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        const data = await response.json();
        setMarketData(data);
        setTopGainers(data.slice(0, 3)); // Mock data for top gainers
        setTopVolumes(data.slice(0, 3)); // Mock data for top volumes
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Market Overview
      </Typography>
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="body1">
            Cryptocurrencies are digital or virtual currencies that use cryptography for security and operate on decentralized networks based on blockchain technology. The most well-known cryptocurrency is <strong>Bitcoin (BTC)</strong>, but there are thousands of others, each with unique features and use cases.
          </Typography>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Markets Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {marketData.slice(0, 3).map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={coin.name} src={coin.image} style={{ marginBottom: '10px', width: 56, height: 56 }} />
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">Price: ${coin.current_price}</Typography>
                    <Typography variant="body2" color="textSecondary">Change: {coin.price_change_percentage_24h}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Trading Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Detailed trading data and analytics for cryptocurrencies.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Opportunity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Insights into potential investment opportunities in the crypto market.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Token Unlock</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Information about upcoming token unlock events.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Hot Coins</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {marketData.slice(3, 6).map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={coin.name} src={coin.image} style={{ marginBottom: '10px', width: 56, height: 56 }} />
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">Price: ${coin.current_price}</Typography>
                    <Typography variant="body2" color="textSecondary">Change: {coin.price_change_percentage_24h}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">New Listings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {marketData.slice(6, 9).map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={coin.name} src={coin.image} style={{ marginBottom: '10px', width: 56, height: 56 }} />
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">Price: ${coin.current_price}</Typography>
                    <Typography variant="body2" color="textSecondary">Change: {coin.price_change_percentage_24h}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Top Gainer Coin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {topGainers.map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={coin.name} src={coin.image} style={{ marginBottom: '10px', width: 56, height: 56 }} />
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">Price: ${coin.current_price}</Typography>
                    <Typography variant="body2" color="textSecondary">Change: {coin.price_change_percentage_24h}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Top Volume Coin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {topVolumes.map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={coin.name} src={coin.image} style={{ marginBottom: '10px', width: 56, height: 56 }} />
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">Price: ${coin.current_price}</Typography>
                    <Typography variant="body2" color="textSecondary">Volume: ${coin.total_volume}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Top Tokens by Market Capitalization</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Get a comprehensive snapshot of all cryptocurrencies available on Binance. This page displays the latest prices, 24-hour trading volume, price changes, and market capitalizations for all cryptocurrencies on Binance. Users can quickly access key information about these digital assets and access the trade page from here.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>



  );
};

export default MarketInfo;
