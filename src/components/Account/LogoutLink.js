import { useAuth } from "./AuthContext";

const LogoutLinkComponent = (props) => {
  const { logout } = useAuth();

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the anchor tag

    await logout();
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
