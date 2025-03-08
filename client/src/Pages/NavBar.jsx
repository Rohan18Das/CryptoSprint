import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Authentication/AuthContext';
import { BorderBottom } from '@mui/icons-material';

const Navbar = () => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: '20px 20px',
    flexWrap: 'wrap', // Ensure items wrap on smaller screens
   
  };

  const leftStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap', // Ensure items wrap on smaller screens
  };

  const titleStyle = {
    color: '#F0B90B',
    margin: 0,
    fontSize: '2.0rem',
    fontFamily: 'montserrat',
  };

  const linkContainerStyle = {
    display: 'flex',
    marginLeft: '20px',
    flexWrap: 'wrap', // Ensure items wrap on smaller screens
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '15px',
    fontSize: '1.2rem',
    fontFamily: 'montserrat',
  };

  const rightStyle = {
    display: 'flex',
    marginTop: '10px', // Add some margin on smaller screens
  };

  const buttonStyle = {
    marginLeft: '15px',
    padding: '5px 10px',
    fontSize: '1rem',
    cursor: 'pointer',
    color: 'black',
    backgroundColor: '#F0B90B', // Yellow color
    border: 'none',
    borderRadius: '5px',
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = '#F0B90B';
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = 'white';
  };

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext); // Use the AuthContext to check authentication status

  const handleBuyCrypto = () => {
    if (isAuthenticated) {
      navigate('/coins/some-coin-id'); // Replace with the actual coin id or dynamic route
    } else {
      navigate('/login');
    }
  };

  const handleMarketClick = () => {
    navigate('/market');
  };

  const handleNewsClick = () => {
    navigate('/news');
  };

  return (
    <div style={navStyle}>
      <div style={leftStyle}>
        <h2 style={titleStyle}>CryptoSprint</h2>
        <div style={linkContainerStyle}>
          <a href="#" style={linkStyle} onClick={handleMarketClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Market</a>
          <a href="#" style={linkStyle} onClick={handleNewsClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Crypto News</a>
          <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Refer & Earn</a>
          <a href="#" style={linkStyle} onClick={handleBuyCrypto} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Buy Crypto</a>
        </div>
      </div>
      <div style={rightStyle}>
        <button style={buttonStyle} onClick={() => navigate('/signup')}>Sign Up</button>
        <button style={buttonStyle} onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default Navbar;
