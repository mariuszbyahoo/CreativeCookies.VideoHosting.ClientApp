import { CircularProgress } from "@mui/material";
import styles from "./StripeOnboardingReturn.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../Account/AuthContext";

const StripeOnboardingReturn = () => {
  const {
    isAuthenticated,
    stripeAccountStatus,
    stripeAccountVerificationPending,
  } = useAuth();

  const determineContent = () => {
    switch (stripeAccountStatus.data) {
      case 0:
        if (!stripeAccountVerificationPending) {
          return (
            <>
              <h3>{t("SomethingWentWrong")}</h3>
              <h5>{t("PleaseContactSupportStripeError")}</h5>
            </>
          );
        }
        return defaultContent();

      case 1:
        return defaultContent();

      case 2:
        return (
          <>
            <h3>{t("Success")}</h3>
            <h5>
              {t("ProceedTo")} <strong>{t("SubscriptionsDashboard")}</strong>{" "}
              {t("AndCreateANewOne")}
            </h5>
          </>
        );

      case 3:
        return (
          <>
            <h4>{t("VerifyingOnboardingStatus")}</h4>
            <p>{t("VerificationShouldTake5Minutes")}.</p>
            <div className={styles.container}>
              <CircularProgress size={350} />
            </div>
          </>
        );

      default:
        return defaultContent();
    }
  };

  const defaultContent = () => (
    <>
      <h4>Verifying onboarding status, please wait</h4>
      <div className={styles.container}>
        <CircularProgress size={350} />
      </div>
    </>
  );

  return <div className={styles.container}>{determineContent()}</div>;
};

export default StripeOnboardingReturn;
