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
  Switch,
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
import ConfirmationDialog from "../../ConfirmationDialog";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isPriceDialogOpened, setIsPriceDialogOpened] = useState(false);
  const [isProductDialogOpened, setIsProductDialogOpened] = useState(false);
  const [merchantAddressData, setMerchantAddressData] = useState(undefined);
  const [merchantAddressSubmitted, setMerchantAddressSubmitted] =
    useState(false);
  const [merchantAddressNotAltered, setMerchantAddressNotAltered] =
    useState(false);
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
    let pricesList =
      pricesResponse.status === 200 ? await pricesResponse.json() : undefined;
    if (pricesList) {
      pricesList = pricesList.filter((price) => price.isActive);
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

  const onSubmit = async (submitFormData) => {
    if (
      submitFormData.appartmentNo === "" ||
      isNaN(submitFormData.appartmentNo)
    ) {
      submitFormData.appartmentNo = null;
    } else {
      submitFormData.appartmentNo = parseInt(submitFormData.appartmentNo, 10);
    }
    const merchantAddressResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Merchant`,
      {
        method: "PUT",
        body: JSON.stringify(submitFormData),
        headers: [["content-type", "application/json"]],
        credentials: "include",
      }
    );
    debugger;
    if (merchantAddressResponse.status === 200) {
      const wasSubmittedSuccesfully =
        (await merchantAddressResponse.json()) === 1;
      if (wasSubmittedSuccesfully) setMerchantAddressSubmitted(true);
      else setMerchantAddressNotAltered(true);
    }
  };

  const getMerchantAddressContent = () => {
    if (isLoadingPrice) {
      return <></>;
    } else {
      return (
        <>
          <h4>{t("CompanyAddressDesc")}:</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Controller
                    name="companyName"
                    control={control}
                    defaultValue={
                      merchantAddressData ? merchantAddressData.companyName : ""
                    }
                    rules={{
                      required: t("CompanyNameIsRequired"),
                      minLength: {
                        value: 3,
                        message: t("CompanyNameNotLessThan3Chars"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("CompanyName")}
                        error={!!errors.companyName}
                        helperText={
                          errors.companyName ? errors.companyName.message : ""
                        }
                      />
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <Controller
                    name="companyTaxId"
                    control={control}
                    defaultValue={
                      merchantAddressData
                        ? merchantAddressData.companyTaxId
                        : ""
                    }
                    rules={{
                      required: t("TaxIdRequired"),
                      minLength: {
                        value: 3,
                        message: t("TaxIdNotLessThan3Chars"),
                      },
                      pattern: {
                        value: /^[A-Za-z0-9\s]+$/,
                        message: t("InvalidLastName"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("CompanyTaxId")}
                        error={!!errors.companyTaxId}
                        helperText={
                          errors.companyTaxId ? errors.companyTaxId.message : ""
                        }
                      />
                    )}
                  />
                </div>
                <div className={styles.field}>
                  <Controller
                    name="isVATExempt"
                    control={control}
                    defaultValue={
                      merchantAddressData
                        ? merchantAddressData.isVATExempt
                        : false
                    }
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <Switch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          color="primary"
                        />
                        <label>{t("IsCompanyVATExempt")}</label>
                        {error && (
                          <p className={styles.errorText}>{error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Controller
                    name="street"
                    control={control}
                    defaultValue={
                      merchantAddressData ? merchantAddressData.street : ""
                    }
                    rules={{
                      required: t("StreetIsRequired"),
                      minLength: {
                        value: 3,
                        message: t("StreetAtLeast3CharsLong"),
                      },
                      pattern: {
                        value: /^[A-Za-z0-9\sążźśćęłóńĄŻŹŚĆĘŁÓŃ]+$/,
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
                    defaultValue={
                      merchantAddressData ? merchantAddressData.houseNo : ""
                    }
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
                    defaultValue={
                      merchantAddressData
                        ? merchantAddressData.appartmentNo
                        : ""
                    }
                    rules={{
                      min: {
                        value: 1,
                        message: t("AppartmentNumberReqErrorMsg"),
                      },
                      pattern: {
                        value: /^(?!0+$)\d+$/,
                        message: t("AppartmentNumberLghErrorMsg"),
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
                    control={control}
                    defaultValue={
                      merchantAddressData ? merchantAddressData.postCode : ""
                    }
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
                    control={control}
                    defaultValue={
                      merchantAddressData ? merchantAddressData.city : ""
                    }
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
            <Button type="submit">{t("SaveCompanyData")}</Button>
          </form>
        </>
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
    <div className={styles.container}>
      {getMerchantAddressContent()}
      <hr className={styles.divider} />
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
      <ConfirmationDialog
        title={t("Success")}
        message={t("MerchantAddressUpserted")}
        open={merchantAddressSubmitted}
        hasCancelOption={false}
        onConfirm={() => {
          setMerchantAddressSubmitted(false);
        }}
      ></ConfirmationDialog>
      <ConfirmationDialog
        title={t("DataUnchanged")}
        message={t("MerchantAddressHasNotBeenAltered")}
        open={merchantAddressNotAltered}
        hasCancelOption={false}
        onConfirm={() => {
          setMerchantAddressNotAltered(false);
        }}
      ></ConfirmationDialog>
    </div>
  );
};

export default StripeProductsDashboardComponent;
