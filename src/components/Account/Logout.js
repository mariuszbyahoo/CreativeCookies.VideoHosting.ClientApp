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
      await logout(); // Wait for the logout function to complete

      // Show the feedback message
      setMessage("Logged out");

      // Redirect the user to the "films-list" page or any other appropriate location after a short delay
      setTimeout(() => {
        navigate("/films-list");
      }, 2000);
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
