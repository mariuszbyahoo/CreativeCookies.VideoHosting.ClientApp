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
  TextField,
} from "@mui/material";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SubscribeComponent.module.css";
import { ArrowForwardIos, HowToReg } from "@mui/icons-material";
import ShopIcon from "@mui/icons-material/Shop";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    const colClassName = `${styles.addressContainer} col`;

    return isAuthenticated ? (
      <div className={styles.container}>
        <p style={{ fontWeight: 700 }}>Add invoice address:</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="FirstName"
                      error={!!errors.firstName}
                      helperText={
                        errors.firstName ? errors.firstName.message : ""
                      }
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="LastName"
                      error={!!errors.lastName}
                      helperText={
                        errors.lastName ? errors.lastName.message : ""
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="street"
                  control={control}
                  rules={{ required: "Street is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Street"
                      error={!!errors.street}
                      helperText={errors.street ? errors.street.message : ""}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <Controller
                  name="houseNo"
                  control={control}
                  rules={{ required: "House number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="House number"
                      error={!!errors.houseNo}
                      helperText={errors.houseNo ? errors.houseNo.message : ""}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <Controller
                  name="appartmentNo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Appartment number"
                      error={!!errors.appartmentNo}
                      helperText={
                        errors.appartmentNo ? errors.appartmentNo.message : ""
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="postCode"
                  control={control}
                  rules={{ required: "Post code is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Post code"
                      error={!!errors.postCode}
                      helperText={
                        errors.postCode ? errors.postCode.message : ""
                      }
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      error={!!errors.city}
                      helperText={errors.city ? errors.city.message : ""}
                    />
                  )}
                />
              </div>
              <div className={styles.field}>
                <Controller
                  name="Country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled="disabled"
                      label="Country"
                      error={!!errors.country}
                      helperText={errors.country ? errors.country.message : ""}
                      value="Polska"
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <p>
            Above address will be used only for invoicing purposes and the tax
            identification
          </p>
          <Button type="submit">
            <ShopIcon /> {t("Subscribe")}
          </Button>
        </form>
        {/* <Button variant="outlined" onClick={handleClick}>
          <ShopIcon /> {t("Subscribe")}
        </Button> */}
      </div>
    ) : (
      <Button variant="outlined">
        <HowToReg /> {t("Register")}
      </Button>
    );
  };

  const handleDeclinedCoolingOffPeriodChange = (event) => {
    setHasDeclinedCoolingOffPeriod(event.target.checked);
  };
  const onSubmit = async (addressData) => {
    // Data contains your form fields
    const requestBody = {
      address: addressData,
      priceId: selectedPriceId,
      hasDeclinedCoolingOffPeriod: hasDeclinedCoolingOffPeriod,
    };
    // ... send data to your API
    openCheckoutSession(requestBody);
  };
  // const handleClick = async () => {
  //   openCheckoutSession();
  // };

  const openCheckoutSession = async (requestBody) => {
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
