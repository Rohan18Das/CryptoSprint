import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
      <Box textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" gutterBottom>
          We couldn't process your request. Please try again later.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Go Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default CancelPage;
