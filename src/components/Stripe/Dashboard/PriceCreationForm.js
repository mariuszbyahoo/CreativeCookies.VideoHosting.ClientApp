import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  MenuItem,
  Select,
} from "@mui/material";
import styles from "./PriceCreationForm.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { t } from "i18next";

const PriceCreationForm = ({
  isPriceDialogOpened,
  setIsPriceDialogOpened,
  stripeProduct,
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
  const [priceAmount, setPriceAmount] = useState(12);
  const [priceCurrency, setPriceCurrency] = useState("pln");

  const handleSavePrice = async () => {
    try {
      console.log(JSON.stringify(stripeProduct));
      let requestBody = {
        stripeProductId: stripeProduct.id,
        unitAmount: priceAmount * 100,
        currencyCode: priceCurrency,
      };

      var res = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/StripeProducts/CreateStripePrice`,
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
      } else {
        // HACK: do some error handling
      }
    } catch (err) {
      console.error(JSON.stringify(err));
    } finally {
      setPriceAmount(12);
      setPriceCurrency("pln");
      setIsPriceDialogOpened(false);
    }
  };

  const handleClose = () => {
    setIsPriceDialogOpened(false);
  };

  const getMinAmount = () => {
    if (priceCurrency === "pln") {
      return 12;
    } else if (priceCurrency === "eur" || priceCurrency === "usd") {
      return 4;
    } else {
      return 4;
    }
  };

  const priceAmountChangeHandler = (e) => {
    clearErrors("priceAmount");
    const value = e.target.value;
    const numValue = parseInt(value);
    setPriceAmount(numValue);
  };
  const priceCurrencyChangeHandler = (e) => {
    clearErrors("priceAmount");
    const newPriceCurrency = e.target.value;
    setPriceCurrency(newPriceCurrency);
    if (priceAmount) {
      if (newPriceCurrency === "pln" && priceAmount < 11) setPriceAmount(12);
      else if (newPriceCurrency === "eur" && priceAmount < 3) setPriceAmount(4);
      else if (newPriceCurrency === "usd" && priceAmount < 3) setPriceAmount(4);
    }
  };
  return (
    <>
      <Dialog open={isPriceDialogOpened} onClose={handleClose}>
        <DialogTitle>{t("AddANewPrice")}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSavePrice)}>
            <div className={styles.container}>
              <div className="row">
                <div className="col-auto">
                  <label htmlFor="amount-input">Amount</label>
                  <Input
                    {...register("priceAmount", {
                      required: t("AmountIsRequired"),
                      min: {
                        value: getMinAmount(),
                        message: `${t("AmountNotLessThan")} ${getMinAmount()}`,
                      },
                    })}
                    id="amount-input"
                    type="number"
                    value={priceAmount}
                    onChange={priceAmountChangeHandler}
                    color="primary"
                    min="1"
                    step="1"
                    className={styles.formInput}
                  />
                  {errors.priceAmount && (
                    <div style={{ color: "#b71c1c" }}>
                      {errors.priceAmount.message}
                    </div>
                  )}
                </div>
                <div className="col-auto">
                  <label htmlFor="currency-select">{t("Currency")}</label>
                  <Select
                    {...register("priceCurrency")}
                    id="currency-select"
                    value={priceCurrency}
                    type="select"
                    onChange={priceCurrencyChangeHandler}
                    color="primary"
                    className={styles.formInput}
                  >
                    <MenuItem value="pln">PLN</MenuItem>
                    <MenuItem value="eur">EUR</MenuItem>
                    <MenuItem value="usd">USD</MenuItem>
                  </Select>
                </div>
              </div>
              <IconButton
                color="primary"
                aria-label="add new price"
                type="submit"
              >
                <AddCircleOutline style={{ fontSize: "36px" }} />
              </IconButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PriceCreationForm;
