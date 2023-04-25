import { Link, NavLink } from "react-router-dom";
import CryptoJS from "crypto-js";

function getRandomNumbers(amount) {
  const randomNumbers = [];
  const min = 1;
  const max = 100;

  for (let i = 0; i < amount; i++) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    randomNumbers.push(randomNumber);
  }
  return randomNumbers.join("");
}

const LoginComponent = (props) => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
  const responseType = "code";
  const scope = encodeURIComponent("test");
  const initialState = getRandomNumbers(10);
  const stateEncrypted = encodeURIComponent(
    CryptoJS.AES.encrypt(initialState, process.env.REACT_APP_AES_KEY)
  );
  const codeChallenge = encodeURIComponent("myCodeChallenge");
  const codeChallengeMethod = "myCodeChallengeMethod";

  const handleLoginClick = () => {
    localStorage.setItem("state", stateEncrypted.toString(CryptoJS.enc.Utf8));
    console.log("stateEncrypted: ", stateEncrypted.toString(CryptoJS.enc.Utf8));
  };

  const loginUrl = `https://${process.env.REACT_APP_API_ADDRESS}/api/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${stateEncrypted}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

  return (
    <a href={loginUrl} className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
  // Use the loginUrl as the href for a link or as the target URL for a button click event.
};
export default LoginComponent;
