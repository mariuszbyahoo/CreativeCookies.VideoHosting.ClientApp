import { useEffect } from "react";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SuccessComponent.module.css";
import { CircularProgress } from "@mui/material";

const SuccessComponent = () => {
  const { isAuthenticated, userEmail } = useAuth();
  useEffect(() => {
    debugger;
    if (isAuthenticated) {
      // 1. fetch toggleUserRole
      // 2. request new token (old one stores old role)
      // 3. Display success message
    }
  }, [userEmail]);

  const content = (
    <>
      <h4>Processing payment</h4>
      <CircularProgress />
    </>
  );

  return (
    <>
      <div className={styles.container}>{content}</div>
    </>
  );
};

export default SuccessComponent;
