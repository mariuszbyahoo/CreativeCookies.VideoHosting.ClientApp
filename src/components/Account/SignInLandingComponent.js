import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getAuthCookie, isStateValid } from "./authHelper";

const SignInLandingComponent = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [stateFromParams, setStateFromParams] = useState(
    decodeURIComponent(searchParams.get("state"))
  );
  const [stateFromCookies, setStateFromCookies] = useState(getAuthCookie());

  const [code, setCode] = useState(searchParams.get("code"));

  const areTheyEqual = isStateValid(stateFromParams, stateFromCookies);
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
