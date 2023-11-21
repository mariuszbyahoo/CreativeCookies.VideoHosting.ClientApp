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
import { useTranslation } from "react-i18next";

const AboutEditorComponent = (props) => {
  const [metadata, setMetadata] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [aboutPageEditFinished, setAboutPageEditFinished] = useState(false);
  const [confirmationDialogOpened, setConfirmationDialogOpened] =
    useState(false);
  const { refreshTokens } = useAuth();
  const { t } = useTranslation();

  const params = useParams();
  const navigate = useNavigate();
  const explanationRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
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
          <h3>{t("EditAboutPage")}</h3>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              type="submit"
              endIcon={<EditIcon />}
              style={{ marginTop: "1%", width: "25%" }}
            >
              {t("UpdateAboutPage")}
            </Button>
          )}
          <div className={`row ${styles["row-margin"]}`}>
            <Controller
              name="innerHTML"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  defaultValue=""
                  value={field.value}
                  onChange={(value) => {
                    setValue("innerHTML", value);
                  }}
                  modules={quillModules}
                  formats={quillFormats}
                />
              )}
            />
          </div>
        </div>
      </form>
      <ConfirmationDialog
        title={t("Success")}
        message={t("AboutPageEditedSuccessfully")}
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
