import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AboutEditorComponent.module.css";
import { Button, CircularProgress, IconButton, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import { Controller, useForm } from "react-hook-form";
import { ArrowDownward } from "@mui/icons-material";
import ConfirmationDialog from "../ConfirmationDialog";
import { useAuth } from "../Account/AuthContext";
import { quillFormats, quillModules } from "../Helpers/quillHelper";

const AboutEditorComponent = (props) => {
  const [metadata, setMetadata] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [aboutPageEditFinished, setAboutPageEditFinished] = useState(false);
  const [confirmationDialogOpened, setConfirmationDialogOpened] =
    useState(false);
  const { refreshTokens } = useAuth();

  const params = useParams();
  const navigate = useNavigate();
  const explanationRef = useRef(null);

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
      innerHTML: "",
    },
  });

  const innerHTML = watch("innerHTML");

  useEffect(() => {
    getMetadata();
  }, [params.id]);

  const getMetadata = async () => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/About`,
      {
        credentials: "include",
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setMetadata(responseData);
      setValue("innerHTML", responseData.innerHTML || "");
      setIsLoading(false);
    } else {
      console.log("API returned other response than 200");
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    editDescHandler();
  };

  const editDescHandler = (e) => {
    console.log(e);
    const updatedMetadata = {
      ...metadata,
      innerHTML: watch("innerHTML"),
    };
    sendEditRequest(updatedMetadata);
  };

  const sendEditRequest = async (bodyContent, retry = true) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/About`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyContent),
        credentials: "include",
      }
    );
    if (response.ok) {
      setAboutPageEditFinished(true);
      setConfirmationDialogOpened(true);
    } else {
      console.error(`Received unexpected API response: ${response.status}`);
    }
  };

  const scrollIntoExplanation = useCallback(() => {
    if (explanationRef.current !== null) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  const handleDialogConfirm = () => {
    setConfirmationDialogOpened(false);
    navigate("../");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h3>Edit your About page</h3>
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
            <p>
              Used description length: {innerHTML ? innerHTML.length : "0"} /
              5000 characters
            </p>
            <div className={`row ${styles["row-margin"]}`}>
              {errors.innerHTML && (
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
              name="innerHTML"
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
                      setError("innerHTML", {
                        type: "manual",
                        message: "About page cannot exceed 5000 characters",
                      });
                    } else {
                      clearErrors("innerHTML");
                    }
                    setValue("innerHTML", value, { shouldValidate: true }); // this will trigger validation
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
          {innerHTML && <p className={styles.code}>{innerHTML}</p>}
        </div>
      </form>
      <ConfirmationDialog
        title="Success"
        message="About page has been updated"
        open={confirmationDialogOpened}
        hasCancelOption={false}
        onConfirm={() => {
          handleDialogConfirm();
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default AboutEditorComponent;
