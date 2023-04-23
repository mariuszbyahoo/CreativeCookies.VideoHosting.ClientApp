import { Link, NavLink } from "react-router-dom";

const LoginComponent = (props) => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
  const responseType = "code";
  const scope = encodeURIComponent("test");
  const state = encodeURIComponent("myStateValue");
  const codeChallenge = encodeURIComponent("myCodeChallenge");
  const codeChallengeMethod = "myCodeChallengeMethod";

  const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
  return (
    <a href={loginUrl} className={props.className}>
      Login
    </a>
  );
  // Use the loginUrl as the href for a link or as the target URL for a button click event.
};
export default LoginComponent;
