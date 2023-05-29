import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FilmUpload.module.css";
import { quillFormats, quillModules } from "./Helpers/quillHelper";
import { Button, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import ConfirmationDialog from "./ConfirmationDialog";

const FilmEditor = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [description, setVideoDescription] = useState("");
  const [videoEditFinished, setVideoEditFinished] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    getMetadata();
  });
  const getMetadata = async () => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs/getMetadata?id=${params.id}`
    );
    const responseData = await response.json();
    setVideoTitle(responseData.name || "");
    setVideoDescription(responseData.description || "");
  };

  const videoTitleChangeHandler = (e) => {
    setVideoTitle(e.target.value);
  };

  const descriptionChangeHandler = (e) => {
    setVideoDescription(e);
  };

  const editVideoHandler = (e) => {
    console.log("edited!");
  };

  return (
    <>
      <div className={styles.container}>
        <h3 style={{ marginBottom: "5%" }}>Edit video metadata</h3>
        <div className={`row ${styles["row-margin"]}`}>
          <label htmlFor="title-input">Title</label>
          <Input
            id="title-input"
            type="text"
            value={videoTitle}
            onChange={videoTitleChangeHandler}
          />
        </div>
        <div className={`row ${styles["row-margin"]}`}>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={descriptionChangeHandler}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
        <Button
          variant="contained"
          endIcon={<EditIcon />}
          onClick={editVideoHandler}
          style={{ marginTop: "5%" }}
        >
          Edit
        </Button>
      </div>
      <ConfirmationDialog
        title="Success"
        message="Video has been edited succesfully"
        open={videoEditFinished}
        hasCancelOption={false}
        onConfirm={() => {
          setVideoEditFinished((prevState) => !prevState);
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default FilmEditor;
