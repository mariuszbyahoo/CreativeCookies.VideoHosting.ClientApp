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
  const [isUserMenuLoading, setIsUserMenuLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [clientId, setClientId] = useState(process.env.REACT_APP_CLIENT_ID);
  const navigate = useNavigate();

  const fetchAccessToken = async (body, shouldNavigate = true) => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const decodedToken = jwtDecode(data.access_token);
        const email = decodedToken.email;
        setUserEmail(email);
        setIsAuthenticated(true);
        shouldNavigate && navigate("/films-list");
      } else if (response.status == "400") {
        console.log(response.headers);
        await logout();
        return "LoginAgain";
      } else {
        console.error("Error requesting access token: ", response.statusText);
      }
    } catch (err) {
      console.error(`Error while fetching the AccessToken: ${err}`);
    }
    return "";
  };

  const refreshTokens = useCallback(async () => {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
    });

    return await fetchAccessToken(body, false);
  }, []);

  const requestAccessToken = useCallback(async (code, codeVerifier) => {
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

      fetchAccessToken(body);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  }, []);

  const generatePkceData = () => {
    const { codeVerifier, codeChallenge } = generateCodeChallenge();
    return { codeVerifier, codeChallenge };
  };

  const logout = async () => {
    await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Clear any stored tokens and set isAuthenticated to false
    setIsAuthenticated(false);
  };

  const login = async () => {
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
    const checkAuthentication = async () => {
      try {
        setIsUserMenuLoading(true);
        const response = await fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/isAuthenticated?clientId=${clientId}`,
          {
            credentials: "include", // This line ensures cookies are sent with the fetch request
          }
        );
        if (response.ok) {
          const data = await response.json();
          const email = data.email;
          setUserEmail(email);
          setIsAuthenticated(data.isAuthenticated);
        }
      } catch (error) {
        console.error("Error checking authentication status: ", error);
      } finally {
        setIsUserMenuLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const value = {
    isAuthenticated,
    userEmail,
    requestAccessToken,
    refreshTokens,
    logout,
    generatePkceData,
    login,
    isUserMenuLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
