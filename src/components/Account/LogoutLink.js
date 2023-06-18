import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import AppRoutes from "../../AppRoutes";

const LogoutLinkComponent = (props) => {
  const { logout } = useAuth();
  const location = useLocation();
  const routes = AppRoutes;

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    debugger;
    console.log(routes); // prints out all of the routes array
    // HACK #118 find out how to differentiate between protected routes and unprotected routes, try to do that in
    // such a manner, which would handle also RBAC in the future.
    await logout(location.pathname);
  };

  return (
    <>
      <a
        href={process.env.REACT_APP_HOME_PAGE_URI}
        className={props.className}
        onClick={handleLogout}
      >
        Logout
      </a>
    </>
  );
};

export default LogoutLinkComponent;
