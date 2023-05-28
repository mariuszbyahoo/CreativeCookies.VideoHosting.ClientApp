import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const EditMetadataDialogComponent = ({
  max,
  progress,
  open,
  title,
  textToDisplay,
  selectedVideoId,
  onCancel,
  onConfirm,
}) => {
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Selected video id is: </DialogTitle>
        <DialogContent>
          <p>{selectedVideoId}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditMetadataDialogComponent;
