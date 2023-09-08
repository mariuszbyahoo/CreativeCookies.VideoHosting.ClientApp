import { AddCircleOutline } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./ProductUpsertForm.module.css";

const ProductUpsertForm = (props) => {
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

  const fetchWithCredentials = (url, options) => {
    return fetch(url, { ...options, credentials: "include" });
  };

  const handleSaveProduct = async () => {
    try {
      var res = await fetchWithCredentials(
        `${process.env.REACT_APP_API_ADDRESS}/StripeProducts/UsertSubscriptionPlan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(props.stripeProduct),
        }
      );
      props.setIsEditingProduct(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <h3>Create subscription plan:</h3>
      <form onSubmit={handleSubmit(handleSaveProduct)}>
        <div className={styles.container}>
          <TextField
            label="Name"
            variant="standard"
            color="primary"
            style={{ width: "40%", margin: "2%" }}
          />
          <br />
          <TextField
            label="Description"
            variant="standard"
            color="primary"
            multiline
            style={{ width: "40%", margin: "2%" }}
            minRows={3}
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
    </>
  );
};
export default ProductUpsertForm;
