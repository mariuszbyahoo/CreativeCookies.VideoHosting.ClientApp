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
  const wordArray = CryptoJS.enc.Utf8.parse(codeVerifier); // new line
  const hash = CryptoJS.SHA256(wordArray); // use wordArray instead of codeVerifier
  const codeChallenge = CryptoJS.enc.Base64.stringify(hash)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return { codeVerifier, codeChallenge };
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
  const expiresInMinutes = 60 * 10;
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() + expiresInMinutes * 1000);
  expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; ${expires}; path=/; Secure;`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export {
  generateRandomString,
  setAuthCookie,
  getAuthCookie,
  generateCodeChallenge,
  deleteCookie,
};
