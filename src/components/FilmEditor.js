import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FilmUpload.module.css";
import { quillFormats, quillModules } from "./Helpers/quillHelper";
import { Button, CircularProgress, IconButton, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import ConfirmationDialog from "./ConfirmationDialog";
import { useAuth } from "./Account/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { ArrowDownward } from "@mui/icons-material";

const FilmEditor = (props) => {
  const [metadata, setMetadata] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [videoEditFinished, setVideoEditFinished] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const explanationRef = useRef(null);

  const { accessToken } = useAuth();
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
  } = useForm({
    defaultValues: {
      description: "",
      videoTitle: "",
    },
  });

  const description = watch("description");

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
      setValue("videoTitle", responseData.name || ""); // Update the form value here
      setValue("description", responseData.description || "");
      setIsLoading(false);
    } else {
      alert("an error occured! Contact the software vendor");
      navigate("/films-list");
    }
  };

  const onSubmit = (data) => {
    editVideoHandler();
  };

  const videoTitleChangeHandler = (e) => {
    setValue("videoTitle", e.target.value);
  };

  const editVideoHandler = (e) => {
    const updatedMetadata = {
      ...metadata,
      name: watch("videoTitle"),
      description: watch("description"),
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

  const scrollIntoExplanation = useCallback(() => {
    if (explanationRef.current !== null) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h3>Edit video metadata</h3>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              type="submit"
              endIcon={<EditIcon />}
              style={{ marginTop: "1%", width: "25%" }}
            >
              Edit
            </Button>
          )}
          <div className={`row ${styles["row-margin"]}`}>
            <label htmlFor="title-input">Title</label>
            <Input
              {...register("videoTitle", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title cannot be shorter than 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Title cannot be longer than 50 characters",
                },
              })}
              id="title-input"
              type="text"
              value={watch("videoTitle")}
              onChange={videoTitleChangeHandler}
            />
          </div>
          <div className={`row ${styles["row-margin"]}`}>
            {errors.videoTitle && (
              <>
                <span style={{ color: "#b71c1c" }}>
                  {errors.videoTitle.message}
                </span>
              </>
            )}
          </div>
          <div className={`row ${styles["row-margin"]}`}>
            <p>
              Used description length: {description ? description.length : "0"}{" "}
              / 5000 characters
            </p>
            <div className={`row ${styles["row-margin"]}`}>
              {errors.description && (
                <>
                  <span style={{ color: "#b71c1c" }}>
                    Description cannot exceed 5000 characters.
                  </span>
                </>
              )}
            </div>
            <p>
              How is description counted?
              <IconButton variant="contained" onClick={scrollIntoExplanation}>
                <ArrowDownward />
              </IconButton>
            </p>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ maxLength: 5000 }}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  defaultValue=""
                  value={field.value}
                  onChange={(value) => {
                    if (value.trim().length > 5000) {
                      setError("description", {
                        type: "manual",
                        message: "Description cannot exceed 5000 characters",
                      });
                    } else {
                      clearErrors("description");
                    }
                    setValue("description", value, { shouldValidate: true }); // this will trigger validation
                  }}
                  modules={quillModules}
                  formats={quillFormats}
                />
              )}
            />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "5%" }}>
          <h4 ref={explanationRef}>Description length's explanation</h4>
          <p>
            Description is being translated from the editor above into an HTML
            code, so any stylings will enlarge the amount of used characters.
            <br />
            <strong>Max length of a description is 5000 characters</strong>
            <br />
            Generated HTML code of your video's description looks like this:
          </p>
          {description && <p className={styles.code}>{description}</p>}
        </div>
      </form>
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
