
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { auth } from '../Authentication/firebaseConfig'; // Your Firebase config
// import { useNavigate, useLocation } from 'react-router-dom';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
//   const [loading, setLoading] = useState(!localStorage.getItem('isLoggedIn')); 
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const checkAuthState = async () => {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         setIsLoggedIn(true);
//         setCurrentUser(auth.currentUser);
//         localStorage.setItem('isLoggedIn', 'true');
//         if (location.pathname === '/login') {
//           navigate('/dashboard');
//         }
//         setLoading(false); // Stop loading once token is validated
//       } else {
//         auth.onAuthStateChanged(async (user) => {
//           if (user) {
//             const token = await user.getIdToken();
//             localStorage.setItem('authToken', token);
//             setIsLoggedIn(true);
//             setCurrentUser(user);
//             localStorage.setItem('isLoggedIn', 'true');
//             if (location.pathname === '/login') {
//               navigate('/dashboard');
//             }
//           } else {
//             setIsLoggedIn(false);
//             setCurrentUser(null);
//             localStorage.setItem('isLoggedIn', 'false');
//           }
//           setLoading(false); // Stop loading once the check is complete
//         });
//       }
//     };

//     checkAuthState();
//   }, [navigate, location.pathname]);

//   const login = (token) => {
//     localStorage.setItem('authToken', token);
//     setIsLoggedIn(true);
//     setCurrentUser(auth.currentUser);
//     localStorage.setItem('isLoggedIn', 'true');
//     navigate('/dashboard');
//   };

//   const logout = () => {
//     auth.signOut()
//       .then(() => {
//         setCurrentUser(null);
//         setIsLoggedIn(false);
//         localStorage.removeItem('authToken');
//       })
//       .catch((error) => console.error('Logout failed:', error));
//   };
  

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, currentUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AuthProvider, useAuth, AuthContext };













// ****************************************************************
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../Authentication/firebaseConfig'; // Your Firebase config
import { useNavigate, useLocation } from 'react-router-dom';

// Create AuthContext to manage authentication state globally
const AuthContext = createContext();

// AuthProvider component to wrap the part of the app that needs access to auth state
const AuthProvider = ({ children }) => {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  // State to track loading status
  const [loading, setLoading] = useState(!localStorage.getItem('isLoggedIn'));
  // State to store the current user information
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        // If user is authenticated
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token);
        setIsLoggedIn(true);
        setCurrentUser(user);
        console.log('Current user set from onAuthStateChanged:', user);
        localStorage.setItem('isLoggedIn', 'true');
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else {
        // If no user is found
        console.log('No user found, setting isLoggedIn to false.');
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.setItem('isLoggedIn', 'false');
      }
      // Stop loading once the check is complete
      setLoading(false);
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Function to log in the user and update the state
  const login = (token) => {
    console.log('Logging in...');
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
    setCurrentUser(auth.currentUser);
    console.log('Current user set in login:', auth.currentUser);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  // Function to log out the user and clear the state
  const logout = () => {
    console.log('Logging out...');
    auth.signOut()
      .then(() => {
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
        console.log('User logged out.');
      })
      .catch((error) => console.error('Logout failed:', error));
  };

  // Provide the authentication state and functions to the component tree
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
