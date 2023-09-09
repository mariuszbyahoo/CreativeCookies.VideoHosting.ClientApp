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
import { useState } from "react";

const ProductUpsertForm = ({
  isDialogOpened,
  setIsDialogOpened,
  isProcessingProduct,
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

  const handleSaveProduct = async () => {
    try {
      const requestBody = {
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

  const productNameChangeHandler = (e) => setProductName(e.target.value);
  const productDescriptionChangeHandler = (e) =>
    setProductDesctiption(e.target.value);

  const headerText = isProcessingProduct
    ? "Processing product..."
    : "Create subscription plan:";

  return (
    <>
      <Dialog open={isDialogOpened} onClose={handleClose}>
        <DialogTitle>{headerText}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSaveProduct)}>
            <div className={styles.container}>
              <label for="title-input">Product title</label>
              <Input
                {...register("productName", {
                  required: "Product name is required",
                  minLength: {
                    value: 5,
                    message: "Product name must be at least 5 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Product name cannot exceed 50 characters",
                  },
                })}
                id="title-input"
                type="text"
                value={productName}
                onChange={productNameChangeHandler}
                color="primary"
                style={{ width: "25vmax", margin: "2%" }}
              />
              {errors.productName && (
                <p style={{ color: "#b71c1c" }}>{errors.productName.message}</p>
              )}
              <label for="text-description">Product description</label>
              <TextField
                id="text-description"
                variant="standard"
                color="primary"
                multiline
                style={{ width: "25vmax", margin: "2%" }}
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
