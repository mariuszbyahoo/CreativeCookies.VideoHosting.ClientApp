import { Button } from "@mui/material";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SubscribeComponent.module.css";
import { ArrowForwardIos, HowToReg } from "@mui/icons-material";
import ShopIcon from "@mui/icons-material/Shop";
import { useEffect, useState } from "react";

const SubscribeComponent = () => {
  const { isAuthenticated } = useAuth();
  const [priceList, setPriceList] = useState([]);

  const fetchPriceList = async () => {
    const subscriptionResult = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/FetchSubscriptionPlan`
    );
    if (subscriptionResult.ok) {
      const receivedSubscription = await subscriptionResult.json();
      setPriceList(receivedSubscription.prices);
    }
  };

  useEffect(() => {
    fetchPriceList();
  }, [isAuthenticated]);

  const getActionButton = () => {
    return isAuthenticated ? (
      <Button variant="outlined">
        <ShopIcon /> Subscribe
      </Button>
    ) : (
      <Button variant="outlined">
        <HowToReg /> Register
      </Button>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <h3>Subscribe</h3>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 1 {/* HACK: Implement editability of those  */}
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 2 {/* HACK: Implement editability of those  */}
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 3 {/* HACK: Implement editability of those  */}
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 4 {/* HACK: Implement editability of those  */}
        </p>
        <div className={styles.container}>
          {priceList &&
            priceList.map((price) => (
              <p key={price.id}>
                {price.id} | {price.isActive ? "active" : "nonactive"} |{" "}
                {price.currency} | {price.unitAmount}
              </p>
            ))}
        </div>

        {getActionButton()}
      </div>
    </>
  );
};
export default SubscribeComponent;
