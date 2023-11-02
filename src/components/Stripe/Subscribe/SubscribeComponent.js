import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { t } from "i18next";

const SubscribeComponent = () => {
  const { isAuthenticated } = useAuth();
  const [priceList, setPriceList] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasDeclinedCoolingOffPeriod, setHasDeclinedCoolingOffPeriod] =
    useState(false); // EU's 14 days cooling off period
  const [
    isSubscriptionActiveDialogOpened,
    setIsSubscriptionActiveDialogOpened,
  ] = useState(false);
  const [isOrderActiveDialogOpened, setIsOrderActiveDialogOpened] =
    useState(false);

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
        <ShopIcon /> {t("Subscribe")}
      </Button>
    ) : (
      <Button variant="outlined">
        <HowToReg /> {t("Register")}
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
      setIsSubscriptionActiveDialogOpened(true);
    } else if (paymentSessionResult.status === 423) {
      setIsOrderActiveDialogOpened(true);
    } else {
      console.error("An unexpected error occured");
    }
  };

  const closeSubscriptionActiveDialog = () => {
    setIsSubscriptionActiveDialogOpened(false);
  };

  const closeOrderActiveDialog = () => {
    setIsOrderActiveDialogOpened(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>{t("Subscribe")}</div>
        <p className={styles.container}>
          <ArrowForwardIos />
          <span className={styles.description}>
            {t("GetAccessToAllVideos")}
          </span>
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          <span className={styles.description}>
            {t("StartSupportingCreator")}
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
                    {t("SelectSubscriptionCurrency")}
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
                      {t("WaiveRightToWithdrawFromContract")}
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
      <Dialog
        open={isSubscriptionActiveDialogOpened}
        onCancel={closeSubscriptionActiveDialog}
      >
        <DialogTitle>{t("MembershipActive")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("MembershipActiveDesc")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSubscriptionActiveDialog}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isOrderActiveDialogOpened}
        onCancel={closeOrderActiveDialog}
      >
        <DialogTitle>{t("WithinCoolingOffPeriod")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("CurrentlyWithinCoolingOffPeriod")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOrderActiveDialog}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SubscribeComponent;
