// AuthContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  deleteCookie,
  generateCodeChallenge,
  generateRandomString,
  setAuthCookie,
} from "./authHelper";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const requestAccessToken = useCallback(async (code, codeVerifier) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const grantType = "authorization_code";
    try {
      const body = new URLSearchParams({
        grant_type: grantType,
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const decodedToken = jwtDecode(data.access_token);
        setAccessToken(data.access_token);
        const email = decodedToken.email;
        setUserEmail(email);
        setIsAuthenticated(true);
        navigate("/films-list");
      } else {
        // Handle errors, e.g., display an error message
        console.error("Error requesting access token: ", response.statusText);
        navigate("/auth-error");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
      navigate("/auth-error");
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

  const login = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
    const responseType = "code";
    const codeChallengeMethod = "S256";

    const { codeVerifier, codeChallenge } = generatePkceData();
    const state = generateRandomString(32);
    const encodedState = encodeURIComponent(state);
    deleteCookie(process.env.REACT_APP_STATE_COOKIE_NAME);
    deleteCookie(process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME);

    setAuthCookie(process.env.REACT_APP_STATE_COOKIE_NAME, state);
    setAuthCookie(
      process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME,
      codeVerifier
    );
    const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${encodedState}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    window.location.href = loginUrl;
  };

  // Check if the user is authenticated on initial render
  useEffect(() => {
    // Implement logic to check if the user is authenticated, e.g., check for a valid token
    // Set isAuthenticated accordingly
  }, []);

  const value = {
    isAuthenticated,
    userEmail,
    accessToken,
    requestAccessToken,
    logout,
    generatePkceData,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
