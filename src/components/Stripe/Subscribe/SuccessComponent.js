import { useEffect, useState } from "react";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SuccessComponent.module.css";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const SuccessComponent = () => {
  const { isAuthenticated, userEmail, refreshTokens } = useAuth();
  const [content, setContent] = useState(
    <>
      <h4>Processing payment</h4>
      <CircularProgress />
    </>
  );

  useEffect(() => {
    checkSessionStatus();
  }, [userEmail]);

  const checkSessionStatus = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("sessionId");
    if (isAuthenticated && sessionId) {
      try {
        const res = await fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/StripeCheckout/Status?sessionId=${sessionId}`,
          {
            credentials: "include",
          }
        );

        if (res.status === 200) {
          const isPaymentPaid = await res.json();

          if (isPaymentPaid) {
            await refreshTokens(false);
            setContent(
              <>
                <h4>Payment succeed</h4>
                <Link to="../films-list">Explore films</Link>
              </>
            );
          } else {
            setContent(
              <>
                <h4>Payment failed</h4>
                <Link to="../films-list">Return to films list</Link>
              </>
            );
          }
        } else {
          setContent(
            <>
              <h4>Payment failed</h4>
              <Link to="../films-list">Return to films list</Link>
            </>
          );
          const errorMessage = await res.text();
          console.error(`Error: ${errorMessage}`);
        }
      } catch (error) {
        setContent(
          <>
            <h4>Payment failed</h4>
            <Link to="../films-list">Return to films list</Link>
          </>
        );
        console.error(`Fetch error: ${error}`);
      }
    } else {
      setContent(
        <>
          <h4>No payment sent</h4>
          <Link to="../films-list">Return to the films list</Link>
        </>
      );
    }
  };

  return (
    <>
      <div className={styles.container}>{content}</div>
    </>
  );
};

export default SuccessComponent;
