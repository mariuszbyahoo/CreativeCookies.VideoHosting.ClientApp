import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";
import ConfirmationDialog from "../ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { Error } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

/**
 * This component serves as a session expiration page.
 * @returns JSX.Element
 */
const LogoutComponent = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dialogIsOpened, setDialogIsOpened] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    setIsLoggingOut(true);

    setDialogIsOpened(true);
  }, [logout]);

  let spinner = isLoggingOut ? (
    <>
      <Error style={{ fontSize: 200, color: "red" }} />
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
        title={t("YourSessionExpired")}
        message={t("PleaseLoginAgain")}
        hasCancelOption={false}
        onConfirm={() => {
          logout("/");
          setDialogIsOpened(false);
        }}
      />
    </>
  );
};

export default LogoutComponent;
