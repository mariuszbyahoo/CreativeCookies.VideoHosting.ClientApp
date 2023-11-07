import { AddCircleOutline } from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./ProductUpsertForm.module.css";
import { useEffect, useState } from "react";
import { t } from "i18next";

const ProductUpsertForm = ({
  isDialogOpened,
  setIsDialogOpened,
  isProcessingProduct,
  stripeProduct,
  setStripeProduct,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    watch,
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDesctiption] = useState("");

  const fetchWithCredentials = (url, options) => {
    return fetch(url, { ...options, credentials: "include" });
  };

  useEffect(() => {
    clearErrors();
    if (stripeProduct) {
      setProductName(stripeProduct.name);
      setProductDesctiption(stripeProduct.description);
    }
  }, [stripeProduct]);

  const handleSaveProduct = async () => {
    try {
      let requestBody = {
        name: productName,
        description: productDescription,
      };
      var res = await fetchWithCredentials(
        `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/UpsertSubscriptionPlan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );
      if (res.ok) {
        const productJson = await res.json();
        setStripeProduct(productJson);
      } else {
        // HACK: Manage other responses.
      }
      setIsDialogOpened(false);
      clearErrors();
      setProductDesctiption("");
      setProductName("");
    } catch (error) {
      console.error("Error updating product:", error);
      setIsDialogOpened(false);
    }
  };

  const handleClose = () => {
    setIsDialogOpened(false);
  };

  const productNameChangeHandler = (e) => {
    if (e.target.value.length > 5) {
      clearErrors();
    }

    setProductName(e.target.value);
  };
  const productDescriptionChangeHandler = (e) =>
    setProductDesctiption(e.target.value);

  const headerText = isProcessingProduct
    ? t("ProcessingProduct")
    : t("SubscriptionPlan");

  return (
    <>
      <Dialog open={isDialogOpened} onClose={handleClose}>
        <DialogTitle>{headerText}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSaveProduct)}>
            <div className={styles.container}>
              <label htmlFor="title-input">{t("ProductTitle")}</label>
              <Input
                {...register("productName", {
                  required: t("ProductNameRequired"),
                  minLength: {
                    value: 5,
                    message: t("ProductNameAtLeast5Chars"),
                  },
                  maxLength: {
                    value: 50,
                    message: t("ProductNameAtMost50Chars"),
                  },
                })}
                id="title-input"
                type="text"
                value={productName}
                onChange={productNameChangeHandler}
                color="primary"
                className={styles.formInput}
              />
              {errors.productName && (
                <p style={{ color: "#b71c1c" }}>{errors.productName.message}</p>
              )}
              <label htmlFor="text-description">
                {t("ProductDescription")}
              </label>
              <TextField
                id="text-description"
                variant="standard"
                color="primary"
                multiline
                className={styles.formInput}
                minRows={3}
                value={productDescription}
                onChange={productDescriptionChangeHandler}
              />
              <br />
              <IconButton
                color="primary"
                aria-label="add new product"
                type="submit"
              >
                <AddCircleOutline style={{ fontSize: "48px" }} />
              </IconButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ProductUpsertForm;
