import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RegulationsEditorComponent.module.css";
import { quillFormats, quillModules } from "../Helpers/quillHelper";
import { Button, CircularProgress, IconButton, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import ConfirmationDialog from "../ConfirmationDialog";
import { useAuth } from "../Account/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const RegulationsEditorComponent = (props) => {
  const [regulationsObj, setRegulationsObj] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [regulationsEditFinished, setRegulationsEditFinished] = useState(false);
  const { refreshTokens } = useAuth();

  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      htmlContent: "",
    },
  });

  const htmlContent = watch("htmlContent");

  useEffect(() => {
    getRegulations();
  }, [params.id]);

  const getRegulations = async () => {
    setIsLoading(true);
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/regulations`,
      {
        credentials: "include",
      }
    );
    if (response.ok && response.status === 200) {
      const responseData = await response.json();
      setRegulationsObj(responseData);
      setValue("htmlContent", responseData.htmlContent || "");
      setIsLoading(false);
    } else if (response.status === 204) {
      setValue("");
      setIsLoading(false);
    } else {
      navigate("/logout");
    }
  };

  const onSubmit = (data) => {
    editRegulationsHandler();
  };

  const editRegulationsHandler = (e) => {
    const updatedMetadata = {
      ...regulationsObj,
      htmlContent: watch("htmlContent"),
    };
    sendEditRequest(updatedMetadata);
  };

  const sendEditRequest = async (bodyContent, retry = true) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/regulations`,
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
      setRegulationsEditFinished(true);
      return true;
    } else if (
      (response.status == "401" || response.status == "400") &&
      retry
    ) {
      var refreshResponse = await refreshTokens(false);
      if (refreshResponse == "LoginAgain") {
        navigate("/logout");
      } else {
        return sendEditRequest(bodyContent, false);
      }
    } else {
      console.error(`Received unexpected API response: ${response.status}`);
      navigate("/logout");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h3>{t("EditRegulations")}</h3>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              type="submit"
              endIcon={<EditIcon />}
              style={{ marginTop: "1%", width: "25%" }}
            >
              {t("UpdateRegulations")}
            </Button>
          )}
          <div className={`row ${styles["row-margin"]}`}>
            <Controller
              name="htmlContent"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  defaultValue=""
                  value={field.value}
                  onChange={(value) => {
                    setValue("htmlContent", value);
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
        message={t("RegulationsEditedSuccesfully")}
        open={regulationsEditFinished}
        hasCancelOption={false}
        onConfirm={() => {
          navigate("/regulations");
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default RegulationsEditorComponent;
