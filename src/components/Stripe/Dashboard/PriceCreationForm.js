import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const PriceCreationForm = ({ isPriceDialogOpened, setIsPriceDialogOpened }) => {
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
  const handleSavePrice = () => {};
  const handleClose = () => {
    setIsPriceDialogOpened(false);
  };
  return (
    <>
      <Dialog open={isPriceDialogOpened} onClose={handleClose}>
        <DialogTitle>Add price</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSavePrice)}></form>
        </DialogContent>
      </Dialog>
    </>
  );
};
