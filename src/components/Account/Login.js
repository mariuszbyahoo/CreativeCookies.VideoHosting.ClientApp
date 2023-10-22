import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router";
import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { HourglassBottom } from "@mui/icons-material";

/**
 *
 * @param {ReactComponentProperties[]} props
 * @returns
 */
const LoginComponent = (props) => {
  const { login } = useAuth();
  const location = useLocation();
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const handleLoginClick = (event) => {
    event.preventDefault();
    setIsDialogOpened(true);
    login(location.pathname);
  };

  return (
    <>
      <a className={props.className} onClick={handleLoginClick}>
        Login
      </a>
      <Dialog open={isDialogOpened}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginComponent;
