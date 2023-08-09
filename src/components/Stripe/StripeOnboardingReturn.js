import { CircularProgress } from "@mui/material";
import styles from "./StripeOnboardingReturn.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../Account/AuthContext";

const StripeOnboardingReturn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accountSetUp, setAccountSetUp] = useState(false);
  const { login, logout } = useAuth();

  // HACK TODO: change bool as a response value from the api to enum with three possible values:
  // 1. Success
  // 2. Connect account created, but has not been saved to the DB
  // 3. Connect account missing in Stripe, as well as in DB.
  // and adjust the client app to it.

  useEffect(() => {
    const verifyAccount = async () => {
      let response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/Stripe/IsSetUp`,
        {
          credentials: "include",
        }
      );
      debugger;
      if (response.ok) {
        let booleanResponse = await response.json();
        if (booleanResponse) {
          setIsLoading(false);
          setAccountSetUp(true);
        } else {
          setIsLoading(false);
          setAccountSetUp(false);
          logout();
        }
      } else if (response.status == 401) {
        login();
      } else {
        setIsLoading(false);
        setAccountSetUp(false);
        logout();
      }
    };
    verifyAccount();
  }, [isLoading]);
  let content = <></>;
  if (isLoading)
    content = (
      <>
        <h4>Verifying onboarding status, please wait</h4>
        <div className={styles.container}>
          <CircularProgress size={350} />
        </div>
      </>
    );
  else if (!isLoading && accountSetUp) {
    content = (
      <>
        <h3>Success</h3>
        <h5>
          Proceed to <strong>products dashboard</strong> and create your first
          subscription
        </h5>
      </>
    );
  } else if (!isLoading && !accountSetUp) {
    content = (
      <>
        <h3>Something went wrong</h3>
        <h5>
          Unfortunatelly, something went wrong with synchronisation between
          MyHub and Stripe.
        </h5>
      </>
    );
  }

  return (
    <>
      <div className={styles.container}>{content}</div>
    </>
  );
};

export default StripeOnboardingReturn;
