import React from "react";
import { useAuth } from "../Account/AuthContext";

const ProtectedComponent = ({ loginUrl, children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page
    window.location.href = loginUrl;
    return <div>Redirecting...</div>;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedComponent;
