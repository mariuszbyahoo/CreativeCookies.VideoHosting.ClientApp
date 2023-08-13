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
              <h3>Something went wrong</h3>
              <h5>
                Unfortunately, something went wrong with the synchronization
                between MyHub and Stripe. Please contact support.
              </h5>
            </>
          );
        }
        return defaultContent();

      case 1:
        return defaultContent();

      case 2:
        return (
          <>
            <h3>Success</h3>
            <h5>
              Proceed to <strong>subscriptions dashboard</strong> and create
              your first one.
            </h5>
          </>
        );

      case 3:
        return (
          <>
            <h4>Verifying onboarding status, please wait</h4>
            <p>
              Verification of recently submitted account should take no more
              than 5 minutes.
            </p>
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
