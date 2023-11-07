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
import { t } from "i18next";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isPriceDialogOpened, setIsPriceDialogOpened] = useState(false);
  const [isProductDialogOpened, setIsProductDialogOpened] = useState(false);

  const fetchWithCredentials = (url, options) => {
    return fetch(url, { ...options, credentials: "include" });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
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
