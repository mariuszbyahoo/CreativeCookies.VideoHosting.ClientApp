import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";
import ConfirmationDialog from "../ConfirmationDialog";

const LogoutComponent = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dialogIsOpened, setDialogIsOpened] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setIsLoggingOut(true);
    async function callLogout() {
      await logout();
    }
    callLogout().then(() => {
      setIsLoggingOut(false);
      setDialogIsOpened(true);
    });
  }, [logout]);

  let spinner = isLoggingOut ? <CircularProgress /> : <></>;

  return (
    <>
      {spinner}
      <ConfirmationDialog
        open={dialogIsOpened}
        title="User logged out"
        message="Please login again"
        hasCancelOption={false}
        onConfirm={() => {
          setDialogIsOpened(false);
        }}
      />
    </>
  );
};

export default LogoutComponent;
