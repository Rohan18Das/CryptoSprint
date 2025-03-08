import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Modal, TextField, Alert, IconButton, CircularProgress, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Crypto } from '../Context/CryptoContext';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';
import { useWallet } from '../Context/WalletContext';

const TradePage = ({ coinPrice, coin }) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(''); // 'buy' or 'sell'
  const navigate = useNavigate();
  const { symbol } = useContext(Crypto);
  const { balance, updateBalance, error: balanceError } = useWallet();
  const { isLoggedIn, loading: authLoading, currentUser } = useAuth();

  useEffect(() => {
    const validPrice = parseFloat(coinPrice) || 0;
    setPrice(validPrice);
  }, [coinPrice]);

  useEffect(() => {
    setTotalPrice((parseFloat(quantity) || 0) * price);
  }, [quantity, price]);

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
      if (parseFloat(value) > 0) {
        setError('');
      }
    } else {
      setError('Invalid quantity.');
    }
  };

  const incrementQuantity = () => {
    const newQuantity = (parseFloat(quantity) || 0) + 1;
    setQuantity(String(newQuantity));
    if (newQuantity > 0) {
      setError('');
    }
  };

  const decrementQuantity = () => {
    const newQuantity = (parseFloat(quantity) > 0 ? parseFloat(quantity) - 1 : 0);
    setQuantity(String(newQuantity));
    if (newQuantity > 0) {
      setError('');
    }
  };

  const handleTermsClose = () => setTermsOpen(false);

  const handleTermsAgree = () => {
    setAgreedToTerms(true);
    setTermsOpen(false);
    if (transactionType === 'buy') {
      handleBuy();
    } else if (transactionType === 'sell') {
      handleSell();
    }
  };

  const handleBuy = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantity is required and must be greater than zero.');
      return;
    }

    if (totalPrice > balance) {
      setError('Insufficient balance.');
      return;
    }

    if (!agreedToTerms) {
      setTransactionType('buy');
      setTermsOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions/buy`, {
        email: currentUser.email,
        coin: coin.name,
        quantity: parseFloat(quantity),
        price,
        totalPrice,
        useWallet: true
      });

      if (response.status === 200) {
        updateBalance();
        setNotification('This coin has been bought successfully.');
        setError('');
        setNotificationOpen(true);
        setAgreedToTerms(false);  // Reset terms agreement
      } else {
        setError('Error processing buy transaction.');
      }
    } catch (error) {
      console.error('Error processing buy transaction:', error.response?.data || error.message);
      setError('Buy transaction failed.');
    }
  };

  const handleSell = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantity is required and must be greater than zero.');
      return;
    }

    if (!agreedToTerms) {
      setTransactionType('sell');
      setTermsOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions/sell`, {
        email: currentUser.email,
        coin: coin.name,
        quantity: parseFloat(quantity),
        price,
      });

      if (response.status === 200) {
        updateBalance();
        setNotification('This coin has been sold successfully.');
        setError('');
        setNotificationOpen(true);
        setAgreedToTerms(false);  // Reset terms agreement
      } else {
        setError('Error processing sell transaction.');
      }
    } catch (error) {
      console.error('Error processing sell transaction:', error.response?.data || error.message);
      setError('Sell transaction failed.');
    }
  };

  const handleNotificationClose = () => setNotificationOpen(false);

  if (authLoading) {
    return <CircularProgress />;
  }

  if (!isLoggedIn) {
    return (
      <Typography variant="h6" color="error">
        Please log in to trade cryptocurrency.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        border: '1px solid white',
        padding: '20px',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        margin: '20px auto',
        transition: 'border-color 0.3s ease',
        '&:hover': {
          borderColor: 'gold',
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
        },
      }}
    >
      <Typography variant="h6" color="white" mb={2}>Buy/Sell Cryptocurrency</Typography>

      <Typography variant="h6" color="white" mt={3}>
        Current Price: {symbol} {typeof price === 'number' && !isNaN(price) ? price.toFixed(2) : '0.00'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBlock: '15px' }}>
        <IconButton onClick={decrementQuantity} sx={{ color: 'white', padding: '2' }}>
          <Remove />
        </IconButton>
        <TextField 
          id="outlined-basic" 
          label="Quantity" 
          variant="outlined"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder={`Enter ${coin?.name || 'coin'} amount`}
          sx={{
            '& .MuiInputBase-root': { color: 'white', textAlign: 'center' },
            '& .MuiOutlinedInput-root': { backgroundColor: '#000', borderRadius: '4px' },
            width: '100%',
            margin: '0 10px',
            '&::placeholder': { color: '#ddd', opacity: 1 },
          }}
        />
        <IconButton onClick={incrementQuantity} sx={{ color: 'white' }}>
          <Add />
        </IconButton>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: '10px' }}>{error}</Alert>}

      <Typography variant="h6" color="white" mt={2}>
        Total Price: {symbol} {typeof totalPrice === 'number' && !isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00'}
      </Typography>

      <Typography variant="h6" color={totalPrice > balance ? 'red' : 'white'} mt={2}>
        Available Balance: ₹ {balance}
      </Typography>

      <Box sx={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleBuy}
          sx={{ padding: '10px', fontSize: '16px' }}
        >
          Buy
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSell}
          sx={{ padding: '10px', fontSize: '16px' }}
        >
          Sell
        </Button>
      </Box>

      {/* Terms and Conditions Modal */}
      <Modal
        open={termsOpen}
        onClose={handleTermsClose}
        aria-labelledby="terms-modal-title"
        aria-describedby="terms-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            backgroundColor: '#000',
            color: '#fff',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid white',
            width: '80%',
            maxWidth: '600px',
          }}
        >
          <Typography variant="h6" id="terms-modal-title" mb={2}>
            Terms and Conditions
          </Typography>
          <Typography id="terms-modal-description" paragraph>
            Please read and agree to the terms and conditions to proceed with the transaction. By clicking "Agree",
            you confirm that you have read and accepted our terms.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleTermsClose} color="error">Cancel</Button>
            <Button onClick={handleTermsAgree} color="success">Agree</Button>
          </Box>
        </Box>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'green',
            color: '#fff',
            fontSize: '16px',
          },
        }}
      />
    </Box>
  );
};

export default TradePage;
