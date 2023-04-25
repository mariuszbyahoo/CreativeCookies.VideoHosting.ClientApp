import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const SignInLandingComponent = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const returnedState = CryptoJS.AES.decrypt(
    searchParams.get("state"),
    process.env.REACT_APP_AES_KEY
  ).toString(CryptoJS.enc.Utf8);
  console.log(
    "returned state: ",
    CryptoJS.AES.decrypt(
      searchParams.get("state"),
      process.env.REACT_APP_AES_KEY
    ).toString(CryptoJS.enc.Utf8)
  );
  console.log(
    "stored state: ",
    CryptoJS.AES.decrypt(
      localStorage.getItem("state"),
      process.env.REACT_APP_AES_KEY
    ).toString(CryptoJS.enc.Utf8)
  );
  // Check if the returned state matches the stored state
  if (
    CryptoJS.AES.decrypt(
      searchParams.get("state"),
      process.env.REACT_APP_AES_KEY
    ).toString(CryptoJS.enc.Utf8) ===
    CryptoJS.AES.decrypt(
      localStorage.getItem("state"),
      process.env.REACT_APP_AES_KEY
    ).toString(CryptoJS.enc.Utf8)
  ) {
    // Perform other actions specified in RFC6749
    console.log("State values match");
  } else {
    console.error("State values do not match");
    // HACK TODO: Add error response https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
  }

  return (
    <>
      <h4>This is SignIn landing component</h4>
      <h5>Code: {code}</h5>
      <h5>State: {returnedState}</h5>
    </>
  );
};

export default SignInLandingComponent;
