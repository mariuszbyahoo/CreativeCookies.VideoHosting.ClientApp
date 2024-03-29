import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AppRoutes from "../../AppRoutes";
import { useTranslation } from "react-i18next";

/**
 * Logout link component to insert in the top navigation bar
 * @param {ReactComponentProps} props
 * @returns JSX.Element
 */
const LogoutLinkComponent = (props) => {
  const { logout } = useAuth();
  const location = useLocation();
  const routes = AppRoutes;

  const { t } = useTranslation();

  /**
   * Depending on the location.pathname calls logout() function with an
   * appropriate parameter.
   * @param {onClick} event
   * @returns Promise of a logout() function call
   */
  const handleLogout = async (event) => {
    event.preventDefault();
    // HACK: CHange GUID to :id in lookupstring
    let isProtectedRoute = checkRoute(location.pathname);

    if (isProtectedRoute) return await logout("/films-list");
    else if (isProtectedRoute != null && isProtectedRoute === false)
      return await logout(location.pathname);
    else {
      return await logout("/films-list");
    }
  };

  /**
   * This function returns null if route is not existing
   * or returns true/false about it's protected status
   * @param {string} routePath
   * @returns
   */
  const checkRoute = (routePath) => {
    const route = AppRoutes.find((route) => route.path === routePath);
    if (!route) {
      return null;
    }
    return route.protected || false;
  };

  return (
    <>
      <a
        href={`https://${process.env.REACT_APP_API_ADDRESS}/identity/account/logout`}
        className={props.className}
        // onClick={handleLogout}
      >
        {t("Logout")}
      </a>
    </>
  );
};

export default LogoutLinkComponent;
