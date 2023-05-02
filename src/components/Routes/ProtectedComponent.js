import React from "react";
import { useAuth } from "../Account/AuthContext";

const ProtectedComponent = ({ loginUrl, children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    //HACK TODO: Change this to be redirected towards the film, right after obtaining the Access token.
    window.location.href = loginUrl;
    return <div>Redirecting...</div>;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedComponent;
