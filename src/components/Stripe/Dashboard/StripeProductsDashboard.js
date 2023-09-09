import React, { useEffect, useState } from "react";
import {
  Box,
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
import { AddCircleOutline } from "@mui/icons-material";
import PriceCreationForm from "./PriceCreationForm";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        } else {
        }
        setIsLoading(false);
        // HACK: Fix this to be corresponding to the latest API changes
        // const pricesResponse = await fetchWithCredentials(
        //   `https://${process.env.REACT_APP_API_ADDRESS}/StripePrices/GetAll`
        // );
        // const pricesData = await pricesResponse.json();

        //}
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchData();
  }, [isProductDialogOpened, isPriceDialogOpened]);

  const openEditDialog = () => {
    setIsProductDialogOpened(true);
  };

  const openPriceDialog = () => {
    setIsPriceDialogOpened(true);
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
            Add new price
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Price ID</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Unit Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stripePrices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell>{price.id}</TableCell>
                  <TableCell>{price.currency}</TableCell>
                  <TableCell>{price.unitAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className={styles.container}>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <h3>Subscription plan</h3>
              <p>
                Create your first subscription plan to start monetizing your
                videos
              </p>
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
