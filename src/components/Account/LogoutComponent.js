import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";
import ConfirmationDialog from "../ConfirmationDialog";
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dialogIsOpened, setDialogIsOpened] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  let spinner = isLoggingOut ? (
    <>
      <p>Logging out...</p>
      <CircularProgress size={200} />
    </>
  ) : (
    <></>
  );

  return (
    <>
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
        {spinner}
      </div>
      <ConfirmationDialog
        open={dialogIsOpened}
        title="Your session have expired"
        message="Please login again"
        hasCancelOption={false}
        onConfirm={() => {
          setDialogIsOpened(false);
          navigate("/");
        }}
      />
    </>
  );
};

export default LogoutComponent;
