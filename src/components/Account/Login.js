import { Link, NavLink } from "react-router-dom";

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function setCookie(name, value) {
  const expiresInSeconds = 60;
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() + expiresInSeconds * 1000);
  expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + value + expires + "; path=/";
}

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
    setCookie("oauth2_state", state); // Expires in 60 seconds
  };

  const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodedState}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

  return (
    <a href={loginUrl} className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
  // Use the loginUrl as the href for a link or as the target URL for a button click event.
};
export default LoginComponent;
