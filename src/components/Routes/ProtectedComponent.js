import React from "react";
import { useAuth } from "../Account/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedComponent = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    //HACK TODO: Change this to be redirected towards the film, right after obtaining the Access token.
    // pass returnUrl to the login function and redirect to it
    login();
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
