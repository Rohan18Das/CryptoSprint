import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useWallet } from '../Context/WalletContext';
import { Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../Authentication/AuthContext';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the Refresh Icon

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const AddPayment = () => {
  const [inputValue, setInputValue] = useState(''); // State to store input amount
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(''); // State to manage errors
  const { isLoggedIn, loading: authLoading, currentUser } = useAuth(); // Auth context to get current user
  const { balance, updateBalance, error: balanceError, fetchBalance } = useWallet(); // Wallet context to manage balance

  // Function to handle adding balance
  const handleAddBalance = async () => {
    const amountToAdd = parseFloat(inputValue);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
      setLoading(true);
      setError('');

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/checkoutsession/create-checkout-session`, {
        
        // const response = await axios.post('/api/checkoutsession/create-checkout-session', {
          email: currentUser.email,
          amountInINR: amountToAdd,
        });

        const { sessionId } = response.data;

        if (sessionId) {
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId });

          if (error) {
            setError('Payment session redirection failed: ' + error.message);
          } else {
            await fetchBalance(currentUser.email); // Fetch updated balance after payment
            console.log('Balance updated after payment');
          }
        } else {
          setError('Error creating checkout session.');
        }
      } catch (error) {
        console.error('Error creating checkout session:', error.response?.data || error.message);
        setError('Payment session creation failed.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid amount.');
    }
  };

  // Function to handle refreshing balance
  const handleRefreshBalance = async () => {
    if (currentUser?.email) {
      setLoading(true);
      await fetchBalance(currentUser.email);
      console.log('Current balance:', balance); // Console log the current balance
      setLoading(false);
    }
  };

  // Display loading spinner if auth is in loading state
  if (authLoading) {
    return <CircularProgress />;
  }

  // Display message if user is not logged in
  if (!isLoggedIn) {
    return (
      <Typography variant="h6" color="error">
        Please log in to add balance.
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 5, p: 4, border: '1px solid #333', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', backgroundColor: '#000', textAlign: 'center', color: '#fff' }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Arial, sans-serif', color: '#FFD700' }}>
        Wallet Balance: ₹{balance !== null && balance !== undefined ? balance.toFixed(2) : "0.00"}
      </Typography>

      {(error || balanceError) && (
        <Typography variant="body1" color="error">
          {error || balanceError}
        </Typography>
      )}

      <TextField
        label="Enter amount to add"
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        InputProps={{ style: { color: '#fff' } }}
        InputLabelProps={{ style: { color: '#fff' } }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#FFD700',
            },
            '&:hover fieldset': {
              borderColor: '#FFD700',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleAddBalance}
        fullWidth
        sx={{ mt: 2, backgroundColor: '#FFD700', color: '#000', '&:hover': { backgroundColor: '#E2B717' } }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Balance'}
      </Button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <RefreshIcon
          fontSize="large"
          style={{ color: '#FFD700', cursor: 'pointer' }}
          onClick={handleRefreshBalance}
        />
      </div>
    </Container>
  );
};

export default AddPayment;
