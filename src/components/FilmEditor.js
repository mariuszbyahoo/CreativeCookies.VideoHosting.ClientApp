import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FilmUpload.module.css";
import { quillFormats, quillModules } from "./Helpers/quillHelper";
import { Button, CircularProgress, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAuth } from "./Account/AuthContext";

const FilmEditor = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [metadata, setMetadata] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [videoEditFinished, setVideoEditFinished] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    getMetadata();
  }, [params.id]);
  const getMetadata = async () => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs/getMetadata?id=${params.id}`
    );
    if (response.ok) {
      const responseData = await response.json();
      setMetadata(responseData);
      setVideoTitle(responseData.name || "");
      setVideoDescription(responseData.description || "");
      setIsLoading(false);
    } else {
      alert("an error occured! Contact the software vendor");
      navigate("/films-list");
    }
  };

  const videoTitleChangeHandler = (e) => {
    setVideoTitle(e.target.value);
  };

  const descriptionChangeHandler = (e) => {
    setVideoDescription(e);
  };

  const editVideoHandler = (e) => {
    const updatedMetadata = {
      ...metadata,
      name: videoTitle,
      description: videoDescription,
    };
    sendEditRequest(updatedMetadata);
  };

  const sendEditRequest = async (bodyContent) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs/editMetadata`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyContent),
      }
    );

    if (response.ok) {
      setVideoEditFinished(true);
    } else {
      alert("an error occured! Contact the software vendor");
      navigate("/films-list");
    }
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
            value={videoDescription}
            onChange={descriptionChangeHandler}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            endIcon={<EditIcon />}
            onClick={editVideoHandler}
            style={{ marginTop: "5%" }}
          >
            Edit
          </Button>
        )}
      </div>
      <ConfirmationDialog
        title="Success"
        message="Video has been edited succesfully"
        open={videoEditFinished}
        hasCancelOption={false}
        onConfirm={() => {
          navigate(`/player/${params.id}`);
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default FilmEditor;
