import React, { Suspense, lazy } from 'react';
import { Routes, Route ,Navigate} from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ProfitLossPage from './Pages/ProfitLossPage';
import MarketInfo from './Pages/MarketInfo';
import CryptoNews from './Pages/CryptoNews';
const HomePage = lazy(() => import('./Pages/HomePage'));
const DashBoard = lazy(() => import('./Pages/DashBoard'));
const CoinPage = lazy(() => import('./Pages/CoinPage'));
const Login = lazy(() => import('./Authentication/Login'));
const SignUp = lazy(() => import('./Authentication/SignUp'));
const AddPayment = lazy(() => import('./Pages/AddPayment'));
const SuccessPage = lazy(() => import('./Pages/SuccessPage'));
const  CancelPage  = lazy(() => import('./Pages/CancelPage'));
const ProtectedRoute = lazy(() => import('./Authentication/ProtectedRoute'));

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#14161A',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={{ minHeight: '100vh', bgcolor: '#14161A', color: 'text.primary' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/market" element={<MarketInfo />} />
            <Route path="/news" element={<CryptoNews />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oops" element={<div style={{textAlign:'center', fontSize:'bolder'}}>Oops! The page you are looking for does not exist or you are not logged in.</div>} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coins/:id"
              element={
                <ProtectedRoute>
                  <CoinPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-payment"
              element={
                <ProtectedRoute>
                  <AddPayment />
                </ProtectedRoute>
              }
            />
             <Route
              path="analysis"
              element={
                <ProtectedRoute>
                  <ProfitLossPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/error"
              element={
                <ProtectedRoute>
                  <CancelPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/oops" />} />
                   </Routes>
        </Box>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;