import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";
import { quillFormats, quillModules } from "./Helpers/quillHelper";
import ReactQuill from "react-quill";

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
          <div style={{ marginBlock: 20 }}>
            <label htmlFor="title-input">Title:</label>
            <Input
              id="title-input"
              type="text"
              //   value={title}
              //   onChange={videoTitleChangeHandler}
            />
          </div>
          <ReactQuill
            theme="snow"
            value=""
            //   value={description}
            //   onChange={descriptionChangeHandler}
            modules={quillModules}
            formats={quillFormats}
          />
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
