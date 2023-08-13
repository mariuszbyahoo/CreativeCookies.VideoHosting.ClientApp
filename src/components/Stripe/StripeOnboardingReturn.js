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

  const [content, setContent] = useState(
    <>
      <h4>Verifying onboarding status, please wait</h4>
      <div className={styles.container}>
        <CircularProgress size={350} />
      </div>
    </>
  );

  useEffect(() => {
    switch (stripeAccountStatus.data) {
      case 0:
        if (!stripeAccountVerificationPending) {
          setContent(
            <>
              <h3>Something went wrong</h3>
              <h5>
                Unfortunately, something went wrong with the synchronization
                between MyHub and Stripe. Please contact support.
              </h5>
            </>
          );
        }
        break;
      case 1:
        // keep the default content
        break;
      case 2:
        setContent(
          <>
            <h3>Success</h3>
            <h5>
              Proceed to <strong>subscriptions dashboard</strong> and create
              your first one.
            </h5>
          </>
        );
        break;
      case 3:
        setContent(
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
        break;
      default:
        // Keep the default content
        break;
    }
  }, [stripeAccountStatus, stripeAccountVerificationPending]);

  return <div className={styles.container}>{content}</div>;
};

export default StripeOnboardingReturn;
