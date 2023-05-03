import React from "react";
import { useAuth } from "./AuthContext";

const LoginComponent = (props) => {
  const { login } = useAuth();

  const handleLoginClick = () => {
    login();
  };

  return (
    <a className={props.className} onClick={handleLoginClick}>
      Login
    </a>
  );
};

export default LoginComponent;
