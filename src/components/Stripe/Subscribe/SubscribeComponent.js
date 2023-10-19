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

const SubscribeComponent = () => {
  const { isAuthenticated } = useAuth();
  const [priceList, setPriceList] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasDeclinedCoolingOffPeriod, setHasDeclinedCoolingOffPeriod] =
    useState(false); // EU's 14 days cooling off period
  const [isDialogOpened, setIsDialogOpened] = useState(false);

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
    setHasDeclinedCoolingOffPeriod(event.target.checked);
  };

  const handleClick = async () => {
    openCheckoutSession();
  };

  const openCheckoutSession = async () => {
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
    } else if (paymentSessionResult.status === 409) {
      setIsDialogOpened(true);
    } else {
      console.error("An unexpected error occured");
    }
  };

  const closeDialog = () => {
    setIsDialogOpened(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>Subscribe</div>
        <p className={styles.container}>
          <ArrowForwardIos />
          <span className={styles.description}>Get access to all videos</span>
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          <span className={styles.description}>
            Start supporting your favourite creator each month
          </span>
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
                      I wish to gain access to the ordered services immediately
                      and I waive my right to withdraw from the contract within
                      14 days. I am aware that I will no longer be able to
                      exercise my right to withdraw from the contract.
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
      <Dialog open={isDialogOpened} onCancel={closeDialog}>
        <DialogTitle>Payment unavailable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have ongoing subscription or you're within 14 days cooling off
            period for the subscription ordered. If you want order a new
            subscription you have to cancel this order or just await for the
            current billing period to pass.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SubscribeComponent;
