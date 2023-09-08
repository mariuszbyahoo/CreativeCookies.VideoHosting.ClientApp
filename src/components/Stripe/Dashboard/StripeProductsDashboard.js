import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styles from "./StripeProductsDashboard.module.css";
import ProductUpsertForm from "./ProductUpsertForm";
import { Button } from "reactstrap";

const StripeProductsDashboardComponent = () => {
  const [stripeProduct, setStripeProduct] = useState(null);
  const [stripePrices, setStripePrices] = useState([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  const fetchWithCredentials = (url, options) => {
    return fetch(url, { ...options, credentials: "include" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lookupResponse = await fetchWithCredentials(
          `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/HasAnyProduct`
        );
        const isThereAnyProduct = await lookupResponse.json();
        if (isThereAnyProduct) {
          const productResponse = await fetchWithCredentials(
            `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/FetchSubscriptionPlan`
          );
          const productData = await productResponse.json();
          // HACK: Fix this to be corresponding to the latest API changes
          const pricesResponse = await fetchWithCredentials(
            `https://${process.env.REACT_APP_API_ADDRESS}/StripePrices/GetAll`
          );
          const pricesData = await pricesResponse.json();

          if (productData.length > 0) {
            setStripeProduct(productData[0]);
            setStripePrices(pricesData);
          }
        }
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditProduct = () => {
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async () => {
    try {
      await fetchWithCredentials(
        `${process.env.REACT_APP_API_ADDRESS}/StripeProducts/UpdateSubscriptionPlan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stripeProduct),
        }
      );
      setIsEditingProduct(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className={styles.container}>
      {stripeProduct ? (
        <div>
          <h2>Product</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{stripeProduct.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  {isEditingProduct ? (
                    <TextField
                      value={stripeProduct.name}
                      onChange={(e) =>
                        setStripeProduct({
                          ...stripeProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    stripeProduct.name
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{stripeProduct.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditProduct}
                  >
                    Edit
                  </Button>
                  {isEditingProduct && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSaveProduct}
                    >
                      Save
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <h2>Prices</h2>
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
        <ProductUpsertForm
          stripeProduct={stripeProduct}
          setIsEditingProduct={setIsEditingProduct}
        />
      )}
    </div>
  );
};

export default StripeProductsDashboardComponent;
