// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
// // import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { CryptoContext } from './Context/CryptoContext';
// import { WalletProvider } from './Context/WalletContext';

// import { AuthProvider } from './Authentication/AuthContext';
// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>

//     <CssBaseline />
//     <BrowserRouter>
//       <CryptoContext>

//         <WalletProvider>
//           <AuthProvider>
//             <App />
//           </AuthProvider>


//         </WalletProvider>



//       </CryptoContext>

//     </BrowserRouter>

//   </React.StrictMode>
// );









//  ************************************************************ //
// main.jsx or index.js
import { Buffer } from 'buffer';
if (!window.Buffer) {
  window.Buffer = Buffer;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { CryptoContext } from './Context/CryptoContext';
import { AuthProvider } from './Authentication/AuthContext';
import { WalletProvider } from './Context/WalletContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <CryptoContext>
        <AuthProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </AuthProvider>
      </CryptoContext>
    </BrowserRouter>
  </React.StrictMode>
);
