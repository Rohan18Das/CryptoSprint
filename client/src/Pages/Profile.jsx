import React, { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  Box,
  Drawer,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../Authentication/firebaseConfig';
import { AuthContext } from '../Authentication/AuthContext';
import { useWallet } from '../Context/WalletContext';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { balance } = useWallet(); // Using context for balance
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      setTimeout(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUser({
              name: currentUser.displayName || 'User',
              avatar: currentUser.photoURL || 'https://via.placeholder.com/150',
              email: currentUser.email || 'No Email Found',
            });
            console.log('User Name:', currentUser.displayName || 'User');
            console.log('User Email:', currentUser.email);
            console.log('Logged In:', true);
          }
          setLoading(false);
        } else {
          console.log('Logged In:', false);
          navigate('/login');
        }
      }, 2000);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Attempting to logout...');
    logout();
    console.log('Redirecting to home page...');
    navigate('/');
  };
  
  const handleAddBalance = () => {
    navigate('/add-payment');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const profileContent = (
    <Box
      sx={{
        width: { xs: '100vw', sm: 350 },
        padding: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        backgroundColor: '#14161A',
        color: 'white',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
      >
        <CloseIcon />
      </IconButton>

      {user && !loading ? (
        <>
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{
              width: { xs: 120, sm: 200 },
              height: { xs: 120, sm: 200 },
              cursor: 'pointer',
              backgroundColor: '#EEBC1D',
              mb: 3,
              border: '5px solid rgb(255, 215, 0)',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {user.name}
          </Typography>
        </>
      ) : (
        <CircularProgress sx={{ color: 'gold' }} />
      )}

      <Typography
        sx={{
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          textAlign: 'center',
          fontWeight: 'bolder',
          wordWrap: 'break-word',
          mb: 3,
        }}
      >
        Wallet Balance: ₹ {(balance !== null && balance !== undefined ? balance : 0).toFixed(2)}
      </Typography>

      <Button
        variant="contained"
        sx={{
          marginLeft:'5px',
          backgroundColor: '#EEBC1D',
          mb: 2,
          ':hover': {
            backgroundColor: '#E2B717',
          },
        }}
        onClick={handleAddBalance}
      >
        Add Balance
      </Button>

      <Button
        variant="outlined"
        sx={{
          color: 'gold',
          borderColor: 'gold',
          ':hover': {
            backgroundColor: 'black',
            borderColor: 'gold',
          },
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(true)}
      >
        {user && !loading ? (
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{
              border: '2px solid rgb(255, 215, 0)',
              width: { xs: 40, sm: 50 },
              height: { xs: 40, sm: 50 },
              transition: 'transform 0.3s ease-in-out',
            }}
          />
        ) : (
          <CircularProgress sx={{ color: 'gold' }} />
        )}
      </Box>

      <Button
      variant="contained"
      onClick={() => navigate('/analysis')}
      sx={{
        padding: '6px 12px',
        marginLeft:'20px',
        fontSize: '12px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 215, 0, 0.8)', // Golden color with some transparency
        color: '#000',
        '&:hover': {
          backgroundColor: 'rgba(255, 215, 0, 1)', // Darker on hover
        },
        '@media (max-width: 600px)': {
          fontSize: '10px',
          padding: '5px 10px',
        }
      }}
    >
      Trade Report
    </Button>

      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        {profileContent}
      </Drawer>
    </>
  );
};

export default Profile;
