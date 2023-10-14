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
import Cookies from "js-cookie";
import moment from "moment";

const AuthContext = createContext();

/**
 * AuthContext gives access to:
 *  isAuthenticated,
 *  userEmail,
 *  requestAccessToken,
 *  refreshTokens,
 *  logout,
 *  generatePkceData,
 *  login,
 *  isUserMenuLoading,
 * @returns AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuLoading, setIsUserMenuLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAwaitingForSubscription, setIsAwaitingForSubscription] =
    useState(false); // HACK use this one inside of NavMenu
  const [clientId, setClientId] = useState(process.env.REACT_APP_CLIENT_ID);
  const [stripeAccountStatus, setStripeAccountStatus] = useState({ data: 3 });
  const [
    stripeAccountVerificationPending,
    setStripeAccountVerificationPending,
  ] = useState(false);
  const [subscriptionStartDateLocal, setSubscriptionStartDateLocal] =
    useState("");
  const [subscriptionEndDateLocal, setSubscriptionEndDateLocal] = useState("");
  const navigate = useNavigate();

  // Check if the user is authenticated on initial render
  useEffect(() => {
    const checkAuthentication = async () => {
      var res = false;
      try {
        setIsUserMenuLoading(true);
        const response = await fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/auth/isAuthenticated?clientId=${clientId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          const email = data.email;
          const role = data.userRole;
          setUserEmail(email);
          setUserRole(role);
          setIsAuthenticated(data.isAuthenticated);
          if (role === "admin" || role === "ADMIN") {
            await delayedCheckStripeAccountStatus(true);
          } else if (role) {
            await setSubscriptionDates();
          }
        }
      } catch (error) {
        console.error("Error checking authentication status: ", error);
      } finally {
        setIsUserMenuLoading(false);
      }
    };

    checkAuthentication();
  }, [clientId]);

  const delayedCheckStripeAccountStatus = async (checkImmediately) => {
    checkImmediately && (await checkStripeAccountStatus(false));
    setTimeout(async () => {
      await checkStripeAccountStatus(true);
    }, 60000);
  };

  const checkStripeAccountStatus = async (usingRecurency) => {
    setStripeAccountVerificationPending(true);
    const connectAccountResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/stripeAccounts/IsSetUp`,
      {
        credentials: "include",
      }
    );
    if (connectAccountResponse.ok) {
      let connectAccountResult = await connectAccountResponse.json();
      setStripeAccountStatus(connectAccountResult);
      switch (connectAccountResult.data) {
        case 0:
        case 1:
          window.location.href = `https://${process.env.REACT_APP_API_ADDRESS}/Identity/Account/StripeOnboarding`;
          break;
        case 2:
          setStripeAccountVerificationPending(false);
          break;
        case 3:
          usingRecurency && (await delayedCheckStripeAccountStatus(false));
          break;
        default:
          setStripeAccountVerificationPending(false);
          throw new Error("API returned invalid key for stripe onboarding");
      }
    }
    setStripeAccountVerificationPending(false);
  };

  const fetchAccessToken = async (
    body,
    shouldNavigate = true,
    logsOut = false
  ) => {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/auth/token`,
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
        const role = decodedToken.role;
        setUserRole(role);
        setUserEmail(email);
        setIsAuthenticated(true);
        const stateCookie = Cookies.get(
          process.env.REACT_APP_STATE_COOKIE_NAME
        );
        let returnPath = "/films-list";

        if (role === "admin" || role === "ADMIN")
          await checkStripeAccountStatus(role);
        else if (role) {
          await setSubscriptionDates();
        }

        if (stateCookie) {
          const containsReturnPath = stateCookie.split("|").length > 1;
          if (containsReturnPath) {
            returnPath = decodeURIComponent(stateCookie.split("|")[0]);
          }
        }
        shouldNavigate && navigate(returnPath);
        deleteCookie(process.env.REACT_APP_STATE_COOKIE_NAME);
      } else if (response.status == "400") {
        var res = "LoginAgain";
        if (logsOut) {
          await logout("/films-list");
        }
        return res;
      } else {
        console.error("Error requesting access token: ", response.statusText);
      }
    } catch (err) {
      console.error(`Error while fetching the AccessToken: ${err}`);
    }
    return "";
  };

  const setSubscriptionDates = async () => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Users/SubscriptionDates`,
      {
        credentials: "include",
      }
    );
    if (response.ok) {
      try {
        const jsonData = await response.json();
        const utcBeginning = moment.utc(jsonData.startDateUTC);
        const utcEnd = moment.utc(jsonData.endDateUTC);
        console.log(`jsonData: ${jsonData}`);
        console.log(`jsonData.subscriptionStartDate: ${jsonData.startDateUTC}`);
        console.log(`jsonData.SubscriptionEndDateUTC: ${jsonData.endDateUTC}`);
        const utcNow = moment.utc();
        if (utcBeginning.isAfter(utcNow)) {
          setIsAwaitingForSubscription(true);
        } else {
          setIsAwaitingForSubscription(false);
        }
        setSubscriptionStartDateLocal(utcBeginning.local());
        setSubscriptionEndDateLocal(utcEnd.local());
      } catch (err) {
        console.error(err);
      }
    } else if (response.code === 201) {
      console.error("no user found with access token");
      // no user found
    } else {
      console.err("An error occured in AuthContext.setSubscripitonDates()");
      // some error occured
    }
  };

  const refreshTokens = useCallback(async (logsOut = true) => {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
    });

    return await fetchAccessToken(body, false, logsOut);
  }, []);

  const requestAccessToken = useCallback(
    async (code, codeVerifier, logsOut) => {
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

        fetchAccessToken(body, true, logsOut);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    },
    []
  );

  const generatePkceData = () => {
    const { codeVerifier, codeChallenge } = generateCodeChallenge();
    return { codeVerifier, codeChallenge };
  };

  const logout = async (pathToRedirectAfterLogout) => {
    setIsAuthenticated(false);
    setUserEmail("");
    setUserRole("");
    if (
      pathToRedirectAfterLogout === "undefined" ||
      pathToRedirectAfterLogout === "null"
    )
      pathToRedirectAfterLogout = "/films-list";
    window.location.href = `https://${process.env.REACT_APP_API_ADDRESS}/identity/account/logout?returnPath=${pathToRedirectAfterLogout}`;
  };

  const login = async (pathToRedirectAfterLogin) => {
    const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
    const responseType = "code";
    const codeChallengeMethod = "S256";

    const { codeVerifier, codeChallenge } = generatePkceData();
    const state = pathToRedirectAfterLogin
      ? `${pathToRedirectAfterLogin}|${generateRandomString(4)}`
      : generateRandomString(32);
    const encodedState = encodeURIComponent(state);
    deleteCookie(process.env.REACT_APP_STATE_COOKIE_NAME);
    deleteCookie(process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME);

    setAuthCookie(process.env.REACT_APP_STATE_COOKIE_NAME, state);
    setAuthCookie(
      process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME,
      codeVerifier
    );
    const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${encodedState}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    window.location.href = loginUrl;
  };

  const value = {
    isAuthenticated,
    userEmail,
    userRole,
    requestAccessToken,
    refreshTokens,
    logout,
    generatePkceData,
    login,
    isUserMenuLoading,
    checkStripeAccountStatus,
    stripeAccountStatus,
    stripeAccountVerificationPending,
    isAwaitingForSubscription,
    subscriptionStartDateLocal,
    subscriptionEndDateLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
