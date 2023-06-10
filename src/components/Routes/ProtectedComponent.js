import React from "react";
import { useAuth } from "../Account/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    //HACK TODO: Change this to be redirected towards the film, right after obtaining the Access token.
    // pass returnUrl to the login function and redirect to it
    login();
    return <div>Redirecting...</div>;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedComponent;
