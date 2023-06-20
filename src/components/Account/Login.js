import React from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router";

/**
 *
 * @param {ReactComponentProperties[]} props
 * @returns
 */
const LoginComponent = (props) => {
  const { login } = useAuth();
  const location = useLocation();

  const handleLoginClick = (event) => {
    event.preventDefault();
    login(location.pathname);
  };

  return (
    <a className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};

export default LoginComponent;
