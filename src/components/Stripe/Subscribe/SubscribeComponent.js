import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SubscribeComponent.module.css";
import { ArrowForwardIos, HowToReg } from "@mui/icons-material";
import ShopIcon from "@mui/icons-material/Shop";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SubscribeComponent = () => {
  const { isAuthenticated } = useAuth();
  const [priceList, setPriceList] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasDeclinedCoolingOffPeriod, setHasDeclinedCoolingOffPeriod] =
    useState(false); // EU's 14 days cooling off period

  const fetchPriceList = async () => {
    setLoading(true);
    const subscriptionResult = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/FetchSubscriptionPlan`
    );
    if (subscriptionResult.ok) {
      const receivedSubscription = await subscriptionResult.json();
      setPriceList(receivedSubscription.prices);
      const plnIndex = receivedSubscription.prices.findIndex(
        (price) => price.currency === "pln"
      );

      if (plnIndex !== -1) {
        setSelectedPriceId(receivedSubscription.prices[plnIndex].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPriceList();
  }, [isAuthenticated]);

  const getActionButton = () => {
    return isAuthenticated ? (
      <Button variant="outlined" onClick={handleClick}>
        <ShopIcon /> Subscribe
      </Button>
    ) : (
      <Button variant="outlined">
        <HowToReg /> Register
      </Button>
    );
  };

  const handleDeclinedCoolingOffPeriodChange = (event) => {
    console.log(`turning checkbox to : ${event.target.checked}`);
    setHasDeclinedCoolingOffPeriod(event.target.checked);
  };

  const handleClick = async () => {
    const requestBody = {
      priceId: selectedPriceId,
      hasDeclinedCoolingOffPeriod: hasDeclinedCoolingOffPeriod,
    };
    const paymentSessionResult = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/StripeCheckout/CreateSession`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: [["content-type", "application/json"]],
        credentials: "include",
      }
    );

    if (paymentSessionResult.ok) {
      const responseBody = await paymentSessionResult.json();
      window.location.href = responseBody.destinationUrl;
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h3>Subscribe</h3>
        <p className={styles.container}>
          <ArrowForwardIos />
          Get access to all videos
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Start supporting your favourite creator each month
        </p>
        <div className={styles.container}>
          {loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <div className={styles.container}>
                <FormControl>
                  <Select
                    value={selectedPriceId}
                    onChange={(e) => setSelectedPriceId(e.target.value)}
                  >
                    {priceList.map((price) => (
                      <MenuItem key={price.id} value={price.id}>
                        {price.unitAmount / 100},-{" "}
                        {price.currency.toUpperCase()} per month
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select your subscription currency
                  </FormHelperText>
                </FormControl>
              </div>
              <div className={styles.container}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasDeclinedCoolingOffPeriod}
                      onChange={handleDeclinedCoolingOffPeriodChange}
                      name="hasDeclinedCoolingOffPeriod"
                      inputProps={{ "aria-label": "controlled" }}
                      color="primary"
                    />
                  }
                  label={
                    <div className={styles.checkboxLabel}>
                      I want to access videos immediately, and declinine the
                      right to use{" "}
                      <a href="https://europa.eu/youreurope/citizens/consumers/shopping/guarantees-returns/index_en.htm">
                        EU's 14 days cooling off period
                      </a>
                    </div>
                  }
                  labelPlacement="bottom"
                />
              </div>
            </>
          )}
        </div>

        {getActionButton()}
      </div>
    </>
  );
};
export default SubscribeComponent;
