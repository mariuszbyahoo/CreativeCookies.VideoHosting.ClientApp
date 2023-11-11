import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styles from "./StripeProductsDashboard.module.css";
import ProductUpsertForm from "./ProductUpsertForm";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  AddCircleOutline,
  Cancel,
  CheckCircleOutline,
} from "@mui/icons-material";
import PriceCreationForm from "./PriceCreationForm";
import { useForm, Controller } from "react-hook-form";
import { t } from "i18next";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isPriceDialogOpened, setIsPriceDialogOpened] = useState(false);
  const [isProductDialogOpened, setIsProductDialogOpened] = useState(false);
  const [merchantAddressData, setMerchantAddressData] = useState(undefined);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fetchWithCredentials = (url, options) => {
    return fetch(url, { ...options, credentials: "include" });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // HACK: Add condition to add merchant's address before allowing to edit anything else
        debugger;
        const merchantAddressResponse = await fetchWithCredentials(
          `https://${process.env.REACT_APP_API_ADDRESS}/Merchant`
        );
        const merchantAddressData =
          merchantAddressResponse.status === 200
            ? await merchantAddressResponse.json()
            : undefined;

        setMerchantAddressData(merchantAddressData);

        const productResponse = await fetchWithCredentials(
          `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/FetchSubscriptionPlan`
        );
        const productData =
          productResponse.status === 200
            ? await productResponse.json()
            : undefined;
        if (productData) {
          setStripeProduct(productData);
          await reloadPrices(productData.id);
        } else {
        }

        setIsLoadingProduct(false);
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
        setIsLoadingProduct(false);
      }
    };
    setIsLoadingProduct(true);
    fetchData();
  }, [isProductDialogOpened, isPriceDialogOpened]);

  const reloadPrices = async (productId) => {
    setIsLoadingPrice(true);
    const pricesResponse = await fetchWithCredentials(
      `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/GetAllPrices?productId=${productId}`
    );
    const pricesList =
      pricesResponse.status === 200 ? await pricesResponse.json() : undefined;
    if (pricesList) {
      setStripePrices(pricesList);
    }
    setIsLoadingPrice(false);
  };

  const openEditDialog = () => {
    setIsProductDialogOpened(true);
  };

  const openPriceDialog = () => {
    setIsPriceDialogOpened(true);
  };

  const toggleActivation = async (priceId) => {
    setIsLoadingProduct(true);
    await fetchWithCredentials(
      `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/TogglePriceState?priceId=${priceId}`,
      {
        method: "PUT",
      }
    );
    await reloadPrices(stripeProduct.id);
    setIsLoadingProduct(false);
  };

  const onSubmit = async (submitFormData) => {};

  const getMerchantAddressContent = () => {
    if (isLoadingPrice) {
      return <></>;
    } else {
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.field}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{
                    required: "First name is required",
                    minLength: {
                      value: 3,
                      message: "First name must be at least 3 characters long",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]{3,}$/,
                      message: "Invalid first name",
                    },
                  }}
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
                  name="companyTaxId"
                  control={control}
                  defaultValue={merchantAddressData.companyTaxId}
                  rules={{
                    required: "Tax id is required",
                    minLength: {
                      value: 3,
                      message: "",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: "Invalid last name",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company Tax Id"
                      error={!!errors.companyTaxId}
                      helperText={
                        errors.companyTaxId ? errors.companyTaxId.message : ""
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
                  defaultValue={merchantAddressData.street}
                  rules={{
                    required: "Street is required",
                    minLength: {
                      value: 3,
                      message: "Street must be at least 3 characters long",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: "Invalid street name",
                    },
                  }}
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
                  defaultValue={merchantAddressData.houseNo}
                  control={control}
                  rules={{
                    required: "House number is required",
                    pattern: {
                      value: /^[0-9]+[A-Za-z]?\/?[0-9]*[A-Za-z]?$/,
                      message: "Invalid house number",
                    },
                  }}
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
                  defaultValue={merchantAddressData.appartmentNo}
                  rules={{
                    min: {
                      value: 1,
                      message: "Apartment number must be greater than zero",
                    },
                    pattern: {
                      value: /^(?!0+$)\d+$/,
                      message:
                        "Invalid apartment number. Only numbers greater than zero are allowed.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Appartment number"
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
                  control={control}
                  defaultValue={merchantAddressData.postCode}
                  rules={{
                    required: "Post code is required",
                    pattern: {
                      value: /^\d{2}-\d{3}$/,
                      message: "Post code must be in the format XX-XXX",
                    },
                  }}
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
                  defaultValue={merchantAddressData.city}
                  rules={{
                    required: "City is required",
                    minLength: {
                      value: 3,
                      message: "City name must be at least 3 characters long",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]{3,}$/,
                      message: "Invalid city name",
                    },
                  }}
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
                  defaultValue="Polska"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={true}
                      label="Country"
                      error={!!errors.country}
                      helperText={errors.country ? errors.country.message : ""}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Button type="submit">{t("SaveCompanyData")}</Button>
        </form>
      );
    }
  };

  const getPricesContent = () => {
    if (isLoadingPrice)
      return (
        <div className={styles.container}>
          <CircularProgress size={100} />
        </div>
      );
    else if (stripePrices)
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("Price")}</TableCell>
              <TableCell>{t("State")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stripePrices.map((price) => (
              <TableRow key={price.id}>
                <TableCell>{price.id}</TableCell>
                <TableCell>
                  {`${price.currency.toUpperCase()} ${
                    price.unitAmount / 100
                  },-`}
                </TableCell>
                <TableCell>
                  {price.isActive ? (
                    <>
                      <CheckCircleOutline className="text-green" />{" "}
                      <Button onClick={() => toggleActivation(price.id)}>
                        {t("Deactivate")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Cancel className="text-red" />
                      <Button onClick={() => toggleActivation(price.id)}>
                        {t("Activate")}
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    else return <h4>{t("NoPricesYet")}</h4>;
  };

  return (
    <>
      {stripeProduct ? (
        <div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-auto">
                <h4>{stripeProduct.name}</h4>
              </div>
              <div className="col-auto">
                <IconButton onClick={openEditDialog}>
                  <BorderColorIcon className={styles.editButton} />
                </IconButton>
              </div>
            </div>
          </div>
          <div className={styles.table}>
            <IconButton color="primary" onClick={openPriceDialog}>
              <AddCircleOutline style={{ fontSize: "24px" }} />
            </IconButton>
            {t("AddANewPrice")}
          </div>
          {getPricesContent()}
        </div>
      ) : (
        <div className={styles.container}>
          {isLoadingProduct ? (
            <h1>
              <CircularProgress />
            </h1>
          ) : (
            <>
              <h3>{t("SubscriptionPlan")}</h3>
              <p>{t("CreateYourFirstPlan")}</p>
              {!isProductDialogOpened && (
                <IconButton
                  color="primary"
                  aria-label="add new product"
                  onClick={() => setIsProductDialogOpened(true)}
                >
                  <AddCircleOutline style={{ fontSize: "48px" }} />
                </IconButton>
              )}
            </>
          )}
        </div>
      )}
      <ProductUpsertForm
        stripeProduct={stripeProduct}
        setStripeProduct={(data) => {
          setStripeProduct(data);
        }}
        isDialogOpened={isProductDialogOpened}
        setIsDialogOpened={setIsProductDialogOpened}
      />
      <PriceCreationForm
        isPriceDialogOpened={isPriceDialogOpened}
        setIsPriceDialogOpened={setIsPriceDialogOpened}
        stripeProduct={stripeProduct}
      />
    </>
  );
};

export default StripeProductsDashboardComponent;
