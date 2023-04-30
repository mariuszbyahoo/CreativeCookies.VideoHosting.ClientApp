import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAuthCookie, isStateValid } from "./authHelper";

const SignInLandingComponent = () => {
  const { requestAccessToken } = useAuth();
  const [stateFromCookies, setStateFromCookies] = useState(getAuthCookie());
  const [error, setError] = useState(null);
  const [errorDescription, setErrorDescription] = useState(null);

  useEffect(() => {
    // Verify the state parameter and extract the code and error parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      setError(error);
    } else if (isStateValid(state, stateFromCookies)) {
      // If the state is valid, call the requestAccessToken function with the code
      requestAccessToken(code);
    }
  }, [requestAccessToken]);

  let content;
  if (error) {
    content = (
      <>
        <h4>An error occurred during authentication:</h4>
        <p>
          <strong>Error:</strong> {error}
        </p>
      </>
    );
  } else {
    content = <h4>Processing Auth...</h4>;
  }

  return <div>{content}</div>;
};

export default SignInLandingComponent;
