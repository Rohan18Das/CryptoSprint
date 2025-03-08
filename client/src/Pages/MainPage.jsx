import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import logo from '../assets/cryptocoin.jpg';
import { Margin } from '@mui/icons-material';

const MainPage = () => {
  const mainStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    height: '80vh', // Reduced height

    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly dark background to highlight the content
    position: 'relative',
    overflow: 'hidden',
  };

  const contentStyle = {
    color: 'white',
    zIndex: 2,
     
    animation: 'jump 2s', // Add jump animation to content for 2 seconds
    textAlign: 'left', // Center text for better responsiveness
  };

  const imageStyle = {
    position: 'absolute',
    right: 0,
 
    top: 0,
    width: '60%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.8, // Transparent effect
    zIndex: 1,
  };

  const overlayStyleLeft = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '40%', // Cover left half
    height: '100%',
    background: 'linear-gradient(to  right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', // Transparent gradient to the right
    zIndex: 2,
  };

  const overlayStyleRight = {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%', // Cover right half
    height: '100%',
    background: 'linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', // Transparent gradient to the left
    zIndex: 2,
  };

  return (
    <div style={mainStyle}>
      <Container style={contentStyle}>
        <Typography variant="h2" fontWeight="bold" color="yellow">
          Welcome to the new age of Cryptocurrency
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#F0B90B', // Yellow color
            color: 'black',
            '&:hover': {
              backgroundColor: '#d4a10a',
            },
          }}
        >
          Contact Us
        </Button>
      </Container>
      <div style={overlayStyleLeft}></div>
      <div style={overlayStyleRight}></div>
      <img src={logo} alt="Crypto" style={imageStyle} />
      <style>
        {`
          @keyframes jump {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            .MuiTypography-h2 {
              font-size: 0.25rem; /* Reduce font size on small screens */
            }

            .MuiButton-root {
              font-size: 0.875rem; /* Reduce button font size on small screens */
              padding: 10px 20px;
            }
            
            .overlay-style-left, .overlay-style-right {
              width: 100%; /* Make overlay full width */
            }

            .image-style {
              height: auto; /* Adjust image height for better fit */
            }
          }

          @media (max-width: 480px) {
            .MuiTypography-h2 {
              font-size: 1.5rem; /* Further reduce font size on extra small screens */
            }

            .MuiButton-root {
              font-size: 0.75rem; /* Further reduce button font size on extra small screens */
              padding: 8px 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MainPage;
