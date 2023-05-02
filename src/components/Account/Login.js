import React from "react";
import { useAuth } from "./AuthContext";
import { generateRandomString, setAuthCookie } from "./authHelper";

const LoginComponent = (props) => {
  const { generatePkceData } = useAuth();
  const { codeVerifier, codeChallenge } = generatePkceData();
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
  const responseType = "code";
  const scope = encodeURIComponent("test");
  const state = generateRandomString(32);
  const encodedState = encodeURIComponent(state);

  const encodedCodeChallenge = encodeURIComponent(codeChallenge);
  const codeChallengeMethod = "S256";

  const handleLoginClick = () => {
    setAuthCookie(process.env.REACT_APP_STATE_COOKIE_NAME, state);
    // Store the codeVerifier in sessionStorage or another appropriate storage
    setAuthCookie(
      process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME,
      codeVerifier
    );
  };

  const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodedState}&code_challenge=${encodedCodeChallenge}&code_challenge_method=${codeChallengeMethod}`;

  return (
    <a href={loginUrl} className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};

export default LoginComponent;
