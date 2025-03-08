import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from './firebaseConfig';

import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import logo from '../assets/logo.png';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(auth.currentUser, { displayName: formData.name });
      setError(null); // Clear error on success
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setSuccess(false); // Ensure success is false on error
      setError(err.message);
    }
  };
  

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        // background: 'linear-gradient(135deg, #1E2126, #2A2D34)',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'transparent',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid white', // Default border color
          '&:hover': {
            borderColor: '#FFD700', // Change on hover
          },
          '&:focus-within': {
            borderColor: '#FFD700', // Change when focused
          },
        }}
      >
        
       <Box sx={{display:'flex',justifyContent:'between'}}>

       <img
  src={logo}
  alt="CryptoSprint Logo"
  style={{
    height: '45px',
    width:'45px',
    marginBottom: '20px',
    filter: '',
  }}
/>

        <Typography variant='h6' sx={{}}>
          Welcome to CryptoSprint
        </Typography>
       </Box>
       
        <Typography
          variant="h5"
          sx={{
            marginBottom: '30px',
            fontWeight: 'bold',
            // color: '#F0B90B',
            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          Create Your Account
        </Typography>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          sx={{
            marginBottom: '20px',
            input: { color: 'white' },
            label: { color: '#white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#white' },
              '&:hover fieldset': { borderColor: '#FFD700' },
              '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            },
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          autoComplete="username"
          fullWidth
          required
          onChange={handleChange}
          sx={{
            marginBottom: '20px',
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#white' },
              '&:hover fieldset': { borderColor: '#FFD700' },
              '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            },
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
               autoComplete="current-password"
          fullWidth
          required
          onChange={handleChange}
          sx={{
            marginBottom: '20px',
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#white' },
              '&:hover fieldset': { borderColor: '#FFD700' },
              '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#F0B90B',
            color: 'black',
            fontWeight: 'bold',
            width: '100%',
            marginBottom: '15px',
            '&:hover': { backgroundColor: '#E2B717' },
            boxShadow: '0px 4px 10px rgba(240, 185, 11, 0.5)',
          }}
        >
          Sign Up
        </Button>
        <Typography
          sx={{
            margin: '20px 0',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '14px',
          }}
        >
        

        {success && <Alert severity="success" sx={{ marginBottom: '20px' }}>Sign Up Successfully!</Alert>}
        
        {error && <Alert severity="error">{error}</Alert>}
          — OR —
        </Typography>
        <Button
          onClick={handleGoogleSignUp}
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            width: '100%',
            padding: '10px',
            '&:hover': {
              backgroundColor: 'rgba(240, 185, 11, 0.1)',
              borderColor: '#FFD700',
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            
          }}
        >
         <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" style={{ marginRight: '10px' }}> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path> <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path> <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path> <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path> </svg>
          Sign Up with Google
        </Button>
        <Typography>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#F0B90B', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign In
          </Link>
        </Typography>
   
      </Box>
    </Box>
  );
};

export default SignUp;