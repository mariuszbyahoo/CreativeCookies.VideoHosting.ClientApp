import { useState } from "react";
import { useLocation } from "react-router-dom";

function getCookie(name) {
  const nameWithEquals = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameWithEquals) === 0) {
      return cookie.substring(nameWithEquals.length, cookie.length);
    }
  }
  return "";
}

const SignInLandingComponent = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [stateFromParams, setStateFromParams] = useState(
    decodeURIComponent(searchParams.get("state"))
  );
  const [stateFromCookies, setStateFromCookies] = useState(
    getCookie("oauth2_state")
  );

  const [code, setCode] = useState(searchParams.get("code"));

  const areTheyEqual = stateFromParams === stateFromCookies;

  if (areTheyEqual) {
    document.cookie =
      "oauth2_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // HACK TODO: Perform tokens retrieval.
  }

  return (
    <>
      <h4>This is SignIn landing component</h4>
      <h5>Code: {code}</h5>
      <h5>State from params: {stateFromParams}</h5>
      <h5>State from Cookies: {stateFromCookies}</h5>
      <h5>Are they equal: {areTheyEqual ? <p>Yes</p> : <p>No</p>}</h5>
    </>
  );
};

export default SignInLandingComponent;
