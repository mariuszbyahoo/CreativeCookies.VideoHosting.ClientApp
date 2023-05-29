import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  hasCancelOption,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {hasCancelOption && <Button onClick={onCancel}>Cancel</Button>}
      <Button onClick={onConfirm} color="secondary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;