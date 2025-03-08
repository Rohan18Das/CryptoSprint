// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../Authentication/AuthContext'; // Assuming you have an AuthContext

// // Create WalletContext
// export const WalletContext = createContext();

// // Create WalletProvider component
// export const WalletProvider = ({ children }) => {
//   const [balance, setBalance] = useState(0); // Initial balance
//   const [error, setError] = useState(''); // Error message for failed balance fetch
//   const { currentUser } = useAuth(); // Get the current user from AuthContext

//   // Function to update balance
//   const updateBalance = (newBalance) => {
//     setBalance(newBalance);
//   };

//   // Function to fetch balance from the server
//   const fetchBalance = async (email) => {
//     if (!email) {
//       setError('Please log in to add balance.');
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:30001/api/wallet/balance?email=${email}`);

//       if (response.data && response.data.balanceINR !== undefined) {
//         updateBalance(response.data.balanceINR); // Balance in INR
//         setError(''); // Clear any previous errors
//       } else {
//         // Initialize wallet and balance if not found
//         await axios.post(`http://localhost:30001/api/wallet/init`, { email });
//         setBalance(0); // Initialize balance to 0
//         setError(''); // Clear error message
//       }
//     } catch (error) {
//       console.error('Error fetching balance:', error.message);
//       setError('Failed to fetch balance. Please try again.');
//     }
//   };

//   // Fetch balance when the user logs in or after page refresh
//   useEffect(() => {
//     if (currentUser?.email) {
//       fetchBalance(currentUser.email);
//     }
//   }, [currentUser]);

//   return (
//     <WalletContext.Provider value={{ balance, updateBalance, error }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // Exporting WalletContext and custom hook
// export const useWallet = () => {
//   return useContext(WalletContext);
// };
