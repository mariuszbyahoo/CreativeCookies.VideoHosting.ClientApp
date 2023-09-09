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
import { AddCircleOutline } from "@mui/icons-material";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpened, setIsDialogOpened] = useState(false);

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
  }, [isDialogOpened]);

  return (
    <div className={styles.container}>
      {stripeProduct ? (
        <div>
          <h4>Manage prices for: {stripeProduct.name}</h4>
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
        <>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <h3>Subscription plan</h3>
              <p>
                Create your first subscription plan to start monetizing your
                videos
              </p>
              {!isDialogOpened && (
                <IconButton
                  color="primary"
                  aria-label="add new product"
                  onClick={() => setIsDialogOpened(true)}
                >
                  <AddCircleOutline style={{ fontSize: "48px" }} />
                </IconButton>
              )}
            </>
          )}
        </>
      )}
      <ProductUpsertForm
        stripeProduct={stripeProduct}
        setStripeProduct={(data) => {
          setStripeProduct(data);
        }}
        isDialogOpened={isDialogOpened}
        setIsDialogOpened={setIsDialogOpened}
      />
    </div>
  );
};

export default StripeProductsDashboardComponent;
