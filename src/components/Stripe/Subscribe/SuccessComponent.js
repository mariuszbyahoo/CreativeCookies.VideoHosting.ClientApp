import { useEffect, useState } from "react";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SuccessComponent.module.css";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { t } from "i18next";

const SuccessComponent = ({ usingCoolingOffPeriod }) => {
  const { isAuthenticated, userEmail, refreshTokens } = useAuth();
  const [content, setContent] = useState(
    <>
      <h4>{t("ProcessingPayment")}</h4>
      <CircularProgress />
    </>
  );

  useEffect(() => {
    userEmail && checkSessionStatus();
  }, [userEmail]);

  const checkSessionStatus = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("sessionId");
    if (sessionId) {
      try {
        const res = await fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/StripeCheckout/Status?sessionId=${sessionId}`,
          {
            credentials: "include",
          }
        );

        if (res.status == 200) {
          const isPaymentPaid = await res.json();

          if (isPaymentPaid && !usingCoolingOffPeriod) {
            const subRes = await fetch(
              `https://${process.env.REACT_APP_API_ADDRESS}/Users/IsASubscriber`,
              {
                credentials: "include",
              }
            );
            if (subRes.status == 200) {
              const isUserASubscriber = await subRes.json();
              if (isUserASubscriber) {
                await refreshTokens(false);
                setContent(
                  <>
                    <h4>Payment succeed</h4>
                    {usingCoolingOffPeriod && <p>{t("GrantingAfter14Days")}</p>}
                    <Link to="../films-list">{t("ExploreFilms")}</Link>
                  </>
                );
              } else {
                setTimeout(() => checkSessionStatus(), 2000);
                setContent(
                  <>
                    <h4>{t("ProcessingPayment")}</h4>
                    <CircularProgress />
                  </>
                );
              }
            }
          } else if (isPaymentPaid && usingCoolingOffPeriod) {
            await refreshTokens(false);
            setContent(
              <>
                <h4>{t("PaymentSucceed")}</h4>
                <p>{t("GrantingAfter14Days")}</p>
                <Link to="../films-list">{t("ExploreFilms")}</Link>
              </>
            );
          } else {
            setContent(
              <>
                <h4>{t("PaymentFailed")}</h4>
                <Link to="../films-list">{t("ReturnToFilmsList")}</Link>
              </>
            );
          }
        } else if (res.status == 403) {
          setContent(
            <>
              <h4>{t("ProcessingPayment")}</h4>
              <CircularProgress />
            </>
          );
        } else {
          setContent(
            <>
              <h4>{t("PaymentFailed")}</h4>
              <Link to="../films-list">{t("ReturnToFilmsList")}</Link>
            </>
          );
          const errorMessage = await res.text();
          console.error(`Error: ${errorMessage}`);
        }
      } catch (error) {
        setContent(
          <>
            <h4>{t("PaymentFailed")}</h4>
            <Link to="../films-list">{t("ReturnToFilmsList")}</Link>
          </>
        );
        console.error(`Fetch error: ${error}`);
      }
    } else {
      setContent(
        <>
          <h4>{t("NoPaymentSubmitted")}</h4>
          <Link to="../films-list">{t("ReturnToFilmsList")}</Link>
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
