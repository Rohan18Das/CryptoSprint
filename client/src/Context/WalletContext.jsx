import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(null); // Initial balance set to null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const { currentUser } = useAuth(); // Auth context

  // Update balance in state
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  // Fetch balance from backend
  const fetchBalance = async (email) => {
    if (!email) {
      setError('Please log in to view balance.');
      setLoading(false);
      return;
    }
    try {
      console.log(`Fetching balance for email: ${email}`);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wallet/balance?email=${email}`);
      if (response.data && response.data.balanceINR !== undefined) {
        setBalance(response.data.balanceINR);
        setError('');
        console.log(`Balance fetched: ₹${response.data.balanceINR}`);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wallet/init`, { email });
        setBalance(0);
        setError('');
        console.log('Balance initialized to ₹0');
      }
    } catch (error) {
      console.error('Error fetching balance:', error.message);
      setError('Failed to fetch balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch balance when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.email) {
      console.log('Current user detected:', currentUser.email);
      setLoading(true);
      fetchBalance(currentUser.email); // Fetch balance on initial load

      // Periodic balance fetch (every 5 seconds)
      const interval = setInterval(() => {
        fetchBalance(currentUser.email);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      console.log('No current user detected');
    }
  }, [currentUser]);

  return (
    <WalletContext.Provider value={{ balance, updateBalance, fetchBalance, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
