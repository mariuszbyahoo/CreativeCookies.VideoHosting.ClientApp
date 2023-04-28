import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LogoutComponent = (props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the anchor tag

    try {
      debugger;
      // Redirect the user to the Razor Page Logout
      // HACK TODO: After finishing of Tokens retrieval flow - clear all
      // Auth related cookies from the browser.
      window.location.href = "https://localhost:7034/Identity/Account/Logout";
    } catch (error) {
      // Show an error message if the logout process fails
      setMessage("Error logging out");
    }
  };

  return (
    <>
      <a
        href="https://localhost:44495"
        className={props.className}
        onClick={handleLogout}
      >
        Logout
      </a>
      {message && <div>{message}</div>}
    </>
  );
};

export default LogoutComponent;
