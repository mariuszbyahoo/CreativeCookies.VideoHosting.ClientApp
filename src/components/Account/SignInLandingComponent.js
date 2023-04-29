import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAuthCookie, isStateValid } from "./authHelper";

const SignInLandingComponent = () => {
  const { requestAccessToken } = useAuth();
  const [stateFromCookies, setStateFromCookies] = useState(getAuthCookie());

  // HACK: If error response received: display an error message to the user

  useEffect(() => {
    // Verify the state parameter and extract the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    // Implement the logic to verify the state parameter
    // If the state is valid, call the requestAccessToken function with the code
    if (isStateValid(state, stateFromCookies)) {
      requestAccessToken(code);
    }
  }, [requestAccessToken]);

  const content = <h4>Processing Auth...</h4>;

  return <div>{content}</div>;
};

export default SignInLandingComponent;
