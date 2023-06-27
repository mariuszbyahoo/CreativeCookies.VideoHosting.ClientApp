import React, { useEffect } from "react";
import { useAuth } from "../Account/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

/**
 * Redirects unauthenticated users to login page and those, who do not posses the permissions - to films-list
 * @param {String} accessFor CommaSeparatedValues, set of roles which has access to this component
 * @returns
 */
const ProtectedComponent = ({ accessFor, children }) => {
  const { isAuthenticated, login, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isAuthenticated &&
      !accessFor.toUpperCase().includes(userRole.toUpperCase())
    ) {
      navigate("/films-list");
    }
  }, []);

  if (!isAuthenticated) {
    login(location.pathname);
    return (
      <div
        style={{
          height: "100vw",
          flexGrow: 1,
          minWidth: "100%",
          textAlign: "center",
          marginTop: "0 auto",
          marginBottom: "0 auto",
        }}
      >
        <CircularProgress size={200} />
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default ProtectedComponent;
