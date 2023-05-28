import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";

const ProgressDialog = ({ max, progress, open, title, textToDisplay }) => (
  <>
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h4>{`${((progress / max) * 100).toFixed(0)}%`}</h4>
        </div>
        <LinearProgress variant="determinate" value={(progress / max) * 100} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Please do not close nor refresh this page till the upload will be
          finished.
        </div>
      </DialogContent>
    </Dialog>
  </>
);

export default ProgressDialog;
