import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  hasCancelOption,
  confirmBtnMsg,
  cancelBtnMsg,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {hasCancelOption && (
          <Button onClick={onCancel}>
            {cancelBtnMsg ? t(cancelBtnMsg) : t("Cancel")}
          </Button>
        )}
        <Button onClick={onConfirm} color="secondary">
          {confirmBtnMsg ? t(confirmBtnMsg) : t("Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
