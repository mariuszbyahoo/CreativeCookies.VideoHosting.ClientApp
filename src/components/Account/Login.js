import React from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router";

const LoginComponent = (props) => {
  const { login } = useAuth();
  const location = useLocation();

  const handleLoginClick = () => {
    login(location.pathname);
  };

  return (
    <a className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};

export default LoginComponent;
