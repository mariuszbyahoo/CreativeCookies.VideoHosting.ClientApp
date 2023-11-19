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
    document.cookie = "CookieConsent=true; path=/";
    setShowConsentPopup(false);
  };

  return (
    <ConsentContext.Provider value={{ showConsentPopup, acceptCookies }}>
      {children}
    </ConsentContext.Provider>
  );
};
