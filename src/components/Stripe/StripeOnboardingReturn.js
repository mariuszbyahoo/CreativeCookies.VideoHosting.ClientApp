import { CircularProgress } from "@mui/material";
import styles from "./StripeOnboardingReturn.module.css";
import { useEffect } from "react";
import { useAuth } from "../Account/AuthContext";

const StripeOnboardingReturn = () => {
  const {
    isAuthenticated,
    stripeAccountStatus,
    stripeAccountVerificationPending,
  } = useAuth();

  // useEffect(() => {
  //   switch (stripeAccountStatus) {
  //     case 0:
  //       break;
  //     case 1:
  //       break;
  //     case 2:
  //       break;
  //     case 3:
  //       break;
  //   }
  //   // HACK: TODO - change static one time run to useEffect with array of deps to check for accountStatus.
  // }, [stripeAccountStatus, stripeAccountVerificationPending]);

  let content = (
    <>
      <h4>Verifying onboarding status, please wait</h4>
      <div className={styles.container}>
        <CircularProgress size={350} />
      </div>
    </>
  );

  if (stripeAccountStatus === 2) {
    content = (
      <>
        <h3>Success</h3>
        <h5>
          Proceed to <strong>products dashboard</strong> and create your first
          subscription
        </h5>
      </>
    );
  } else if (stripeAccountStatus === 1) {
    content = (
      <>
        <h3>Account Restricted</h3>
        <h5>
          Your Stripe Connect account is created, but there seems to be a
          restriction. Please go to
          <a href="https://dashboard.stripe.com">stripe dashboard</a>, log in
          and check status of <strong>transfers</strong> and
          <strong>card payments</strong>
        </h5>
      </>
    );
  } else if (stripeAccountStatus === 0 && !stripeAccountVerificationPending) {
    content = (
      <>
        <h3>Something went wrong</h3>
        <h5>
          Unfortunately, something went wrong with the synchronization between
          MyHub and Stripe. Please contact support.
        </h5>
      </>
    );
  }

  return <div className={styles.container}>{content}</div>;
};

export default StripeOnboardingReturn;
