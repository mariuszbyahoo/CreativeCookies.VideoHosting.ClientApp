import { Link, NavLink } from "react-router-dom";
import { generateRandomString, setAuthCookie } from "./stateHelper";

const LoginComponent = (props) => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
  const responseType = "code";
  const scope = encodeURIComponent("test");
  const state = generateRandomString(32);
  const encodedState = encodeURIComponent(state);
  const codeChallenge = encodeURIComponent("myCodeChallenge");
  const codeChallengeMethod = "myCodeChallengeMethod";

  const handleLoginClick = () => {
    setAuthCookie("oauth2_state", state); // Expires in 5 minutes
  };

  const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodedState}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

  return (
    <a href={loginUrl} className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};
export default LoginComponent;
