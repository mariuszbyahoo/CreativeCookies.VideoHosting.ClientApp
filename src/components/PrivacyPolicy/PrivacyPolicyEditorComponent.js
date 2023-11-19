import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PrivacyPolicyEditorComponent.module.css";
import { quillFormats, quillModules } from "../Helpers/quillHelper";
import { Button, CircularProgress, IconButton, Input } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import ConfirmationDialog from "../ConfirmationDialog";
import { useAuth } from "../Account/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const PrivacyPolicyEditorComponent = (props) => {
  const [policyObj, setPolicyObj] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [policyEditFinished, setPolicyEditFinished] = useState(false);
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
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/privacyPolicy`,
      {
        credentials: "include",
      }
    );
    if (response.ok && response.status === 200) {
      const responseData = await response.json();
      setPolicyObj(responseData);
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
    console.log(data);
    editRegulationsHandler();
  };

  const editRegulationsHandler = (e) => {
    console.log(e);
    const updatedMetadata = {
      ...policyObj,
      htmlContent: watch("htmlContent"),
    };
    sendEditRequest(updatedMetadata);
  };

  const sendEditRequest = async (bodyContent, retry = true) => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/privacyPolicy`,
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
      setPolicyEditFinished(true);
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
          <h3>{t("EditPrivacyPolicy")}</h3>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              type="submit"
              endIcon={<EditIcon />}
              style={{ marginTop: "1%", width: "25%" }}
            >
              {t("UpdatePrivacyPolicy")}
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
        message={t("PrivacyPolicyEditedSuccesfully")}
        open={policyEditFinished}
        hasCancelOption={false}
        onConfirm={() => {
          navigate("/privacyPolicy");
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default PrivacyPolicyEditorComponent;
