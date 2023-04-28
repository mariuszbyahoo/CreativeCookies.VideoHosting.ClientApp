function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function setAuthCookie(name, value) {
  const expiresInMinutes = 60 * 5;
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() + expiresInMinutes * 1000);
  expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + value + expires + "; path=/; Secure;";
}

export { generateRandomString, setAuthCookie };
