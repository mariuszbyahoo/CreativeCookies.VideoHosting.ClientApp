import CryptoJS from "crypto-js";

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateCodeChallenge() {
  const codeVerifier = generateRandomString(43);
  const hash = CryptoJS.SHA256(codeVerifier);
  const base64UrlEncodedHash = CryptoJS.enc.Base64.stringify(hash)
    .replace("+", "-")
    .replace("/", "_")
    .replace(/=+$/, "");
  return { codeVerifier, codeChallange: base64UrlEncodedHash };
}

function getAuthCookie(name) {
  const nameWithEquals = `${name}=`;
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

function setAuthCookie(name, value) {
  const expiresInMinutes = 60 * 5;
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() + expiresInMinutes * 1000);
  expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=` + value + expires + "; path=/; Secure;";
}

function isStateValid(stateFromParams, stateFromCookies) {
  const areTheyEqual = stateFromParams === stateFromCookies;

  if (areTheyEqual) {
    document.cookie = `${process.env.REACT_APP_STATE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } else if (!areTheyEqual && !stateFromCookies) {
    console.log("State cookie expired!");
    // add reaction if cookie will expire itself before the equality test
    // i.e. component receives a request, but state param from cookie is not present.
  }
  return areTheyEqual;
}

export {
  generateRandomString,
  setAuthCookie,
  getAuthCookie,
  isStateValid,
  generateCodeChallenge,
};
