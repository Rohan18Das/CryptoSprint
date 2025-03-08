import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material'; // Import Button from MUI

const SuccessPage = () => {
  const location = useLocation();
  const [transactionMessage, setTransactionMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionStatus = params.get('status');
    
    if (transactionStatus === 'success') {
      setTransactionMessage('Transaction successful!');
      setMessageColor('#4CAF50'); // Green for success
    } else if (transactionStatus === 'failure') {
      setTransactionMessage('Transaction failed. Please try again.');
      setMessageColor('#F44336'); // Red for failure
    } else {
      navigate('/error'); // Redirect to error page if no valid status
    }
  }, [location, navigate]);

  return (
    <div>
      {transactionMessage && (
        <Typography
          variant="h6"
          component="p"
          sx={{ mt: 3, color: messageColor }}
        >
          {transactionMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard')}
        sx={{
          backgroundColor: '#FFD700',
          color: '#000',
          '&:hover': {
            backgroundColor: '#E2B717',
          },
          mt: 2, // Add some margin top for spacing
        }}
      >
        Redirect to Dashboard
      </Button>
    </div>
  );
};

export default SuccessPage;
