import React from "react";

const ProtectedComponent = ({ isAuthenticated, loginUrl, children }) => {
  if (!isAuthenticated) {
    // Redirect to the login page
    window.location.href = loginUrl;
    return <div>Redirecting...</div>;
  } else {
    return <>{children}</>;
  }
};

export default ProtectedComponent;
