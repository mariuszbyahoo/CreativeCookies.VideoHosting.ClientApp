import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import {
  deleteCookie,
  generateRandomString,
  setAuthCookie,
} from "./authHelper";

const LoginComponent = (props) => {
  const { generatePkceData } = useAuth();
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
  const responseType = "code";
  const codeChallengeMethod = "S256";
  const scope = "test";

  const handleLoginClick = () => {
    const { codeVerifier, codeChallenge } = generatePkceData();
    const state = generateRandomString(32);
    const encodedState = encodeURIComponent(state);
    const encodedCodeChallenge = encodeURIComponent(codeChallenge);
    deleteCookie(process.env.REACT_APP_STATE_COOKIE_NAME);
    deleteCookie(process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME);

    setAuthCookie(process.env.REACT_APP_STATE_COOKIE_NAME, state);
    setAuthCookie(
      process.env.REACT_APP_CODE_VERIFIER_COOKIE_NAME,
      codeVerifier
    );
    const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodedState}&code_challenge=${encodedCodeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    window.location.href = loginUrl;
  };

  return (
    <a className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};

export default LoginComponent;
