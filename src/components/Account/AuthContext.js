// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (code) => {
    // Call your API to exchange the code for an access_token
    // Set isAuthenticated to true after a successful login
  };

  const logout = async () => {
    // Perform logout actions, e.g., clearing tokens
    setIsAuthenticated(false);
  };

  // Check if the user is authenticated on initial render
  useEffect(() => {
    // Implement logic to check if the user is authenticated, e.g., check for a valid token
    // Set isAuthenticated accordingly
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
