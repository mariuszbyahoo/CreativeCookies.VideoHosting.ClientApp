// AuthContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { deleteCookie, generateCodeChallenge } from "./authHelper";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const requestAccessToken = useCallback(async (code, codeVerifier) => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const grantType = "authorization_code";

    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=${grantType}&code=${code}&redirect_uri=${redirectUri}&client_id=${clientId}&code_verifier=${codeVerifier}`,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("returned: ", data);
        const decodedToken = jwtDecode(data.access_token);
        setAccessToken(data.access_token);
        const email = decodedToken.email;
        console.log("UserEmail: ", email);
        setUserEmail(email);
        setIsAuthenticated(true);
      } else {
        // Handle errors, e.g., display an error message
        console.error("Error requesting access token:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  }, []);

  const generatePkceData = () => {
    const { codeVerifier, codeChallenge } = generateCodeChallenge();
    return { codeVerifier, codeChallenge };
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
    userEmail,
    requestAccessToken,
    logout,
    generatePkceData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
