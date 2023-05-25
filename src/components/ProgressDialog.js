import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";

const ProgressDialog = ({ max, progress, open, title }) => (
  <>
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <LinearProgress variant="determinate" value={(progress / max) * 100} />
      </DialogContent>
    </Dialog>
  </>
);

export default ProgressDialog;
