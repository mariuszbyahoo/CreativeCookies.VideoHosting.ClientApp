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
  const [unexpectedErrorOccured, setUnexpectedErrorOccured] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchPageData = async () => {
    setLoading(true);
    let usersAddress = null;
    const addressResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Address`,
      {
        method: "GET",
        headers: [["content-type", "application/json"]],
        credentials: "include",
      }
    );
    var addressVal = await addressResponse.json();

    if (addressResponse.status === 200) setUserAddress(addressVal);

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
    fetchPageData();
  }, [isAuthenticated]);

  const getActionButton = () => {
    const colClassName = `${styles.addressContainer} col`;

    if (isAuthenticated) {
      return (
        <div className={styles.container}>
          <p style={{ fontWeight: 700 }}>{t("InvoiceAddressMsg")}:</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue={userAddress && userAddress.firstName}
                    rules={{
                      required: t("FirstNameRequired"),
                      minLength: {
                        value: 3,
                        message: t("FirstNameAtLeast3Chars"),
                      },
                      pattern: {
                        value: /^[A-Za-z\sążźśćęłóńĄŻŹŚĆĘŁÓŃ]{3,}$/,
                        message: t("InvalidFirstName"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("FirstName")}
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
                    defaultValue={userAddress && userAddress.lastName}
                    control={control}
                    rules={{
                      required: t("LastNameRequired"),
                      minLength: {
                        value: 3,
                        message: t("LastNameAtLeast3Chars"),
                      },
                      pattern: {
                        value: /^[A-Za-z\sążźśćęłóńĄŻŹŚĆĘŁÓŃ]{3,}$/,
                        message: t("InvalidLastName"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("LastName")}
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
                    defaultValue={userAddress && userAddress.street}
                    control={control}
                    rules={{
                      required: t("StreetIsRequired"),
                      minLength: {
                        value: 3,
                        message: t("StreetAtLeast3CharsLong"),
                      },
                      pattern: {
                        value: /^[A-Za-z\sążźśćęłóńĄŻŹŚĆĘŁÓŃ]{3,}$/,
                        message: t("InvalidStreetName"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("Street")}
                        error={!!errors.street}
                        helperText={errors.street ? errors.street.message : ""}
                      />
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <Controller
                    name="houseNo"
                    defaultValue={userAddress && userAddress.houseNo}
                    control={control}
                    rules={{
                      required: t("HouseNumberIsRequired"),
                      pattern: {
                        value: /^[0-9]+[A-Za-z]?\/?[0-9]*[A-Za-z]?$/,
                        message: t("InvalidHouseNumber"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("HouseNumber")}
                        error={!!errors.houseNo}
                        helperText={
                          errors.houseNo ? errors.houseNo.message : ""
                        }
                      />
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <Controller
                    name="appartmentNo"
                    control={control}
                    defaultValue={userAddress && userAddress.appartmentNo}
                    rules={{
                      min: {
                        value: 1,
                        message: t("AppartmentNumberReqErrorMsg"),
                      },
                      pattern: {
                        value: /^(?!0+$)\d+$/,
                        message: t("AppartmentNumberReqErrorMsg"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("AppartmentNumber")}
                        error={!!errors.appartmentNo}
                        type="number"
                        InputProps={{ inputProps: { min: 1 } }}
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
                    defaultValue={userAddress && userAddress.postCode}
                    control={control}
                    rules={{
                      required: t("PostCodeReq"),
                      pattern: {
                        value: /^\d{2}-\d{3}$/,
                        message: t("PostCodeFormat"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("PostCode")}
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
                    defaultValue={userAddress && userAddress.city}
                    control={control}
                    rules={{
                      required: t("CityIsReq"),
                      minLength: {
                        value: 3,
                        message: t("CityLengthMsg"),
                      },
                      pattern: {
                        value: /^[A-Za-z\sążźśćęłóńĄŻŹŚĆĘŁÓŃ]{3,}$/,
                        message: t("CityFormat"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("City")}
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
                    rules={{ required: t("CountryReq") }}
                    defaultValue="Polska"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled={true}
                        label={t("Country")}
                        error={!!errors.country}
                        helperText={
                          errors.country ? errors.country.message : ""
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <p>{t("AddressMsg")}</p>
            <Button type="submit">
              <ShopIcon /> {t("Subscribe")}
            </Button>
          </form>
        </div>
      );
    } else {
      return (
        <Button variant="outlined">
          <HowToReg /> {t("Register")}
        </Button>
      );
    }
  };

  const handleDeclinedCoolingOffPeriodChange = (event) => {
    setHasDeclinedCoolingOffPeriod(event.target.checked);
  };
  const onSubmit = async (addressData) => {
    addressData.appartmentNo = addressData.appartmentNo
      ? parseInt(addressData.appartmentNo, 10)
      : null; // Convert to integer or null
    const requestBody = {
      address: addressData,
      priceId: selectedPriceId,
      hasDeclinedCoolingOffPeriod: hasDeclinedCoolingOffPeriod,
    };
    // HACK: 1. open spinner window
    openCheckoutSession(requestBody);
    // HACK: if response is not 200 - then show error message
  };
  const handleClick = async () => {
    const requestBody = {
      priceId: selectedPriceId,
      hasDeclinedCoolingOffPeriod: hasDeclinedCoolingOffPeriod,
    };
    openCheckoutSession(requestBody);
  };

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
      setUnexpectedErrorOccured(true);
    }
  };

  const closeUnexpectedErrorOccured = () => {
    setUnexpectedErrorOccured(false);
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

        {loading ? <></> : getActionButton()}
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
      <Dialog
        open={unexpectedErrorOccured}
        onCancel={closeUnexpectedErrorOccured}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("UnexpectedErrorOccured")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOrderActiveDialog}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default SubscribeComponent;
