import React from 'react';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';
import Profile from '../Pages/Profile';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#14161A', color: '#fff', width: '100vw' }}>
      <Container>
        <Toolbar>
          <Typography
            variant="h5"
            onClick={() => navigate('/')}
            sx={{
              flex: 1,
              cursor: 'pointer',
              color: 'gold',
              fontFamily: 'Montserrat',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2rem' }, // Responsive font size
            }}
          >
            CryptoSprint
          </Typography>
          <CurrencySelector />
          <Profile/>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
