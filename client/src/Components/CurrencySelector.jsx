import React, { useContext } from 'react';
import { Crypto } from "../Context/CryptoContext"; 
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';



const CurrencySelector = () => {
  const { currency, setCurrency } = useContext(Crypto);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: { xs: 100, md: 120 }, // Responsive min-width
        marginLeft: 'auto', // This ensures it stays on the right side
      }}
    >
      <InputLabel id="currency-select-label" sx={{ color: 'white' }}>
        Currency
      </InputLabel>
      <Select
        labelId="currency-select-label"
        id="currency-select"
        value={currency}
        onChange={handleChange}
        label="Currency"
        sx={{
          width: { xs: 80, md: 100 }, // Responsive width
          height: { xs: 36, md: 40 }, // Responsive height
          color: 'white',
          backgroundColor: '#1e2125', // Slightly lighter for visibility
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gold', // Hover effect
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              backgroundColor: '#1e2125', // Dropdown background color
              color: 'white', // Dropdown text color
            },
          },
        }}
      >
        <MenuItem value="INR">INR</MenuItem>
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="EUR">EUR</MenuItem>
        <MenuItem value="GBP">GBP</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CurrencySelector;
