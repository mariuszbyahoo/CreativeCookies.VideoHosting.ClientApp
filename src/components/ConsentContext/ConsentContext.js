import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ConsentContext = createContext();

export const useConsent = () => {
  return useContext(ConsentContext);
};

export const ConsentProvider = ({ children }) => {
  const [showConsentPopup, setShowConsentPopup] = useState(false);

  useEffect(() => {
    const checkCookieConsent = () => {
      const cookieConsent = document.cookie
        .split("; ")
        .find((row) => row.startsWith("CookieConsent="));
      if (!cookieConsent) {
        setShowConsentPopup(true);
      }
    };

    checkCookieConsent();
  }, []);

  const acceptCookies = () => {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Expires in 10 years
    document.cookie = `CookieConsent=true; expires=${expirationDate.toUTCString()}; path=/`;
    setShowConsentPopup(false);
  };

  return (
    <ConsentContext.Provider value={{ showConsentPopup, acceptCookies }}>
      {children}
    </ConsentContext.Provider>
  );
};
