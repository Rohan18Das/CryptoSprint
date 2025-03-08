
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getPastDate = (days) => {
  const today = new Date();
  const pastDate = new Date(today.setDate(today.getDate() - days));
  return pastDate.toISOString().split('T')[0];
};

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(Math.floor(Math.random() * 10) + 1);  // Random starting page
  const [hasMore, setHasMore] = useState(true);  // Infinite scroll flag
  const apiKey = '81eb7cafdc3444c9a66eb46c396e39b2';
  const pageSize = 10;  // Number of articles per page
  const daysBack = 30;  // Number of days to go back
  const apiURL = `https://newsapi.org/v2/everything?q=crypto&from=${getPastDate(daysBack)}&sortBy=publishedAt&apiKey=${apiKey}&pageSize=${pageSize}&page=${page}`;

  const fetchNews = async () => {
    try {
      const response = await axios.get(apiURL);
      setNews((prevNews) => [...prevNews, ...response.data.articles]);
      setLoading(false);
      if (response.data.articles.length < pageSize) {
        setHasMore(false);  // Disable infinite scroll if no more articles
      }
    } catch (error) {
      if (error.response && error.response.status === 426) {  // Handling specific error for production-level restriction
        setError('Error 426 fetching the news. Ensure you have the necessary subscription for the production environment.');
      } else {
        setError('Error fetching the news. Please try again later.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);  // Fetch news when page changes

  return (
    <div style={{ padding: '20px ' }}>
      <Typography variant="h4" gutterBottom align="center">
        Crypto News
      </Typography>

      {loading && page === 1 && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      <InfiniteScroll
        dataLength={news.length}  // Length of news array
        next={() => setPage((prevPage) => prevPage + 1)}  // Load more news
        hasMore={hasMore}  // Infinite scroll flag
        loader={<CircularProgress style={{ display: 'block', margin: '20px auto' }} />}
        endMessage={<Typography align="center">No more news</Typography>}
      >
        <Grid container spacing={3}>
          {news.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="a" href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    {article.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    Published on: {formatDate(article.publishedAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </div>
  );
};

export default CryptoNews;
