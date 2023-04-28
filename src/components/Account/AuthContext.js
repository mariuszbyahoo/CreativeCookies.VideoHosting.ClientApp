// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const requestAccessToken = async (code) => {
    // Call your API to exchange the code for an access_token
    // Set isAuthenticated to true after a successful login
  };

  const logout = async () => {
    // Call your API to perform the logout action
    await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Add any necessary authentication headers, e.g., an access token
      }
    );

    // Clear any stored tokens and set isAuthenticated to false
    setIsAuthenticated(false);
  };

  // Check if the user is authenticated on initial render
  useEffect(() => {
    // Implement logic to check if the user is authenticated, e.g., check for a valid token
    // Set isAuthenticated accordingly
  }, []);

  const value = {
    isAuthenticated,
    requestAccessToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
