import React, { useState, useEffect, createContext } from 'react';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [symbol, setSymbol] = useState('₹');

  console.log('currency is',currency);

  useEffect(() => {
    switch (currency) {
      case 'INR':
        setSymbol('₹');
        break;
      case 'USD':
        setSymbol('$');
        break;
      case 'EUR':
        setSymbol('€');
        break;
      case 'GBP':
        setSymbol('£');
        break;
      
      default:
        setSymbol('');
        break;
    }
  }, [currency]);

  return (
    <Crypto.Provider value={{ setCurrency, currency, symbol }}>
      {children}
    </Crypto.Provider>
  );
};

export { Crypto, CryptoContext };
