import React from 'react';
import { Box, Typography } from '@mui/material'; // Importing Box and Typography components from MUI
import banner from '../assets/banner.jpg'; // Importing the banner image
import Carousel from './Carousel'; // Importing the Carousel component
import TypingEffect from './TypingEffect'; // Importing the TypingEffect component

const Banner = () => {

  return (
    <Box
      sx={{
        position: 'relative', // Ensure the text overlays the image
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Ensure no overflow
        width: '100vw', // Full width
   
        height: { xs: '300px', sm: '290px', md: '390px' }, // Responsive height for different screen sizes
        padding: { xs: 0, sm: 0, md: 0 }, // Add responsive padding
      }}
    >
      <img
        src={banner}
        alt="Banner"
        style={{
          width: '100%',
          height: '100vh', // Ensure the image covers the container
          objectFit: 'cover', // Cover to fill the container
        
          paddingTop:0
        }}
      />
      <Box
        sx={{
          position: 'absolute', // Overlay the text on the image
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center the text
          textAlign: 'center',
          padding: { xs: 1, sm: 2, md: 4 }, // Responsive padding
          width: '100%', // Ensure the text container is responsive
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            margin:'15',
            fontFamily: 'Montserrat',
            color: 'white',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', // Add shadow for better readability
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3rem' }, // Responsive font size
            
          }}
        >
          Crypto Sprint
        
        </Typography>
        
        <TypingEffect text="Explore top trending coins seamlessly. Trade on the go, anytime, anywhere with Crypto Sprint App" />
       <Carousel/>
      </Box>
    </Box>
  );
};

export default Banner;
