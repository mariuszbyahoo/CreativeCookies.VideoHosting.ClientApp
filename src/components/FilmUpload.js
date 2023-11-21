import {
  BlockBlobClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import styles from "./FilmUpload.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Base64 } from "js-base64";
import { Button, IconButton, Input } from "@mui/material";
import {
  Search,
  UploadFile,
  InsertPhoto,
  ArrowDownward,
} from "@mui/icons-material";
import { v4 } from "uuid";
import ReactQuill from "react-quill";
import ProgressDialog from "./ProgressDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import { quillModules, quillFormats } from "./Helpers/quillHelper";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "./Account/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FilmUpload = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [video, setVideo] = useState();
  const [thumbnail, setThumbnail] = useState();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxPackets, setMaxPackets] = useState(0);
  const [progressDialogTitle, setProgressDialogTitle] = useState("");
  const [isProgressDialogOpened, setIsProgressDialogOpened] = useState(false);

  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState("");
  const [confirmationDialogMessage, setConfirmationDialogMessage] =
    useState("");
  const [isConfirmationDialogOpened, setIsConfirmaitonDialogOpened] =
    useState(false);
  const { refreshTokens } = useAuth();
  const { t } = useTranslation();
  const explanationRef = useRef(null);
  const navigate = useNavigate();

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
  } = useForm();

  useEffect(() => {
    async function callRefreshTokens() {
      var res = await refreshTokens(false);
      if (res == "LoginAgain") {
        navigate("/logout");
      }
    }
    callRefreshTokens();
  }, [refreshTokens]);

  const description = watch("description");

  const videoGuid = v4();
  const videoBlobName = `${videoGuid.toUpperCase()}.mp4`;
  const thumbnailBlobName = `${videoGuid.toUpperCase()}.jpg`;
  const videoTitleChangeHandler = (e) => setVideoTitle(e.target.value);

  // function to get SAS token
  const getSASToken = async (blobName, isVideo, apiAddress) => {
    const fetchUrl = isVideo
      ? `https://${apiAddress}/SAS/film-upload/${blobName}`
      : `https://${apiAddress}/SAS/thumbnail-upload/${blobName}`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.sasToken;
    } else if (response.status == "401" || response.status == "400") {
      var refreshResponse = await refreshTokens(false);
      if (refreshResponse == "LoginAgain") {
        navigate("/logout");
      }
    } else {
      throw new Error("Failed to get SAS token");
    }
  };

  // function to create block IDs
  const createBlockIds = (fileSize, blockSize) => {
    const blockCount = Math.ceil(fileSize / blockSize);
    return Array.from({ length: blockCount }, (_, i) => {
      const id = ("0000" + i).slice(-5); // Create a 5-character zero-padded string
      const encoder = new TextEncoder();
      const idBytes = encoder.encode(id);
      return Base64.encode(idBytes);
    });
  };

  // function to stage blocks
  const stageBlocks = async (
    blobClient,
    blockIds,
    file,
    blockSize,
    setUploadProgress
  ) => {
    for (let i = 0; i < blockIds.length; i++) {
      setUploadProgress(i);
      const start = i * blockSize;
      const end = Math.min(start + blockSize, file.size);
      const chunk = file.slice(start, end);
      const chunkSize = end - start;
      await blobClient.stageBlock(blockIds[i], chunk, chunkSize);
    }
  };

  // Updated uploadBlob function
  const uploadBlob = async (
    file,
    blobName,
    isVideo,
    setUploadProgress,
    setMaxPackets,
    setDialogTitle
  ) => {
    const account = process.env.REACT_APP_STORAGE_ACCOUNT_NAME;
    const filmContainerName = process.env.REACT_APP_FILMS_CONTAINER_NAME;
    const thumbnailContainerName =
      process.env.REACT_APP_THUMBNAILS_CONTAINER_NAME;
    const apiAddress = process.env.REACT_APP_API_ADDRESS;

    const sasToken = await getSASToken(blobName, isVideo, apiAddress);

    const blockSize = 100 * 1024 * 1024; // 100MB
    const blockIds = createBlockIds(file.size, blockSize);
    setMaxPackets(blockIds.length);
    const blobURL = `https://${account}.blob.core.windows.net/${
      isVideo ? filmContainerName : thumbnailContainerName
    }/${encodeURIComponent(blobName)}?${sasToken}`;
    const pipeline = newPipeline(new AnonymousCredential());
    const blobClient = new BlockBlobClient(blobURL, pipeline);
    await stageBlocks(blobClient, blockIds, file, blockSize, setUploadProgress);
    await blobClient.commitBlockList(blockIds);

    if (isVideo) {
      const length = await getVideoDuration(file);

      const metadata = {
        length: length.toFixed(0), // length in seconds
      };

      await blobClient.setMetadata(metadata);
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);

      video.preload = "metadata";
      video.src = url;

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error loading video metadata"));
      };
    });
  };

  const scrollIntoExplanation = useCallback(() => {
    if (explanationRef.current !== null) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  const videoChangeHandler = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.name.includes(".mp4")) {
      setVideo(selectedFile);
    } else {
      setVideo(undefined);
      setConfirmationDialogTitle(t("ValidationError"));
      setConfirmationDialogMessage(t("OnlyMP4FilesAreAllowed"));
      setIsConfirmaitonDialogOpened(true);
    }
  };

  const thumbnailChangeHandler = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.name.includes(".jpg")) {
      setThumbnail(selectedFile);
    } else {
      setThumbnail(undefined);
      setConfirmationDialogTitle(t("ValidationError"));
      setConfirmationDialogMessage(t("OnlyJPGFilesAreAllowed"));
      setIsConfirmaitonDialogOpened(true);
    }
  };

  const uploadThumbnail = async (thumbnailName) => {
    await uploadBlob(
      thumbnail,
      thumbnailName,
      false,
      setUploadProgress,
      setMaxPackets,
      setProgressDialogTitle
    );
    setThumbnail(undefined);
  };

  const uploadVideo = async (videoName) => {
    await uploadBlob(
      video,
      videoName,
      true,
      setUploadProgress,
      setMaxPackets,
      setProgressDialogTitle
    );
    setVideo(undefined);
  };

  const postMetadata = async (videoGuid, videoName, videoDuration) => {
    setUploadProgress(0);
    setMaxPackets(1);
    const metadata = {
      Id: videoGuid,
      Name: videoTitle,
      Description: description,
      Length: videoDuration.toFixed(0),
      ThumbnailName: thumbnailBlobName,
      BlobUrl: `https://${process.env.REACT_APP_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.REACT_APP_FILMS_CONTAINER_NAME}/${videoName}`,
      CreatedOn: new Date(),
      VideoType: "Premium",
    };

    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Blobs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(metadata),
      }
    );

    const responseData = await response.json();
    setUploadProgress(1);
    return responseData;
  };
  const onSubmit = async (data) => {
    if (!video) {
      setConfirmationDialogTitle(t("Error"));
      setConfirmationDialogMessage(t("VideoFileIsRequiredToSelect"));
      setIsConfirmaitonDialogOpened(true);
      return;
    }
    if (!thumbnail) {
      setConfirmationDialogTitle(t("Error"));
      setConfirmationDialogMessage(t("ThumbnailImageIsRequiredToSelect"));
      setIsConfirmaitonDialogOpened(true);
      return;
    }
    uploadVideoHandler();
  };
  const uploadVideoHandler = async () => {
    try {
      setProgressDialogTitle(`${t("PreparingToUpload")}...`);
      setUploadProgress(0);
      setIsProgressDialogOpened(true);
      if (thumbnail) {
        await uploadThumbnail(thumbnailBlobName);
      }
      const videoDuration = await getVideoDuration(video);
      setProgressDialogTitle("Uploading video");
      await uploadVideo(videoBlobName);
      setUploadProgress(0);
      setProgressDialogTitle(t("SavingVideoMetadata"));
      await postMetadata(videoGuid, videoBlobName, videoDuration);
      setUploadProgress(1);
      setConfirmationDialogTitle(`${t("Success")}!`);
      setConfirmationDialogMessage(t("VideoUploadedSuccesfully"));
      setIsConfirmaitonDialogOpened(true);
      return true;
    } catch (error) {
      setConfirmationDialogTitle(t("Error"));
      setConfirmationDialogMessage(t("UnexpectedErrorOccured"));
      setIsConfirmaitonDialogOpened(true);
      console.error(error);
      return false;
    } finally {
      setIsProgressDialogOpened(false);
      setVideoTitle("");
      reset({ description: "" });
      setVideo(undefined);
      setThumbnail(undefined);
    }
  };

  let videoInputDescription = video
    ? `${t("SelectedFile")}: ${video.name}`
    : t("PleaseSelectVideo");

  let thumbnailInputDescription = thumbnail
    ? `${t("SelectedFile")}: ${thumbnail.name}`
    : t("PleaseSelectThumbnail");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h3 style={{ marginBottom: "5%" }}>{t("UploadANewVideo")}</h3>
          <Button
            variant="contained"
            endIcon={<UploadFile />}
            type="submit"
            style={{ marginBlock: "1%", width: "50%" }}
          >
            {t("Upload")}
          </Button>
          <div className={`row ${styles["row-margin"]}`}>
            <label htmlFor="title-input">{t("Title")}</label>
            <Input
              {...register("videoTitle", {
                required: t("TitleIsRequired"),
                minLength: {
                  value: 3,
                  message: t("TitleMustBeAtLeast3Characters"),
                },
                maxLength: {
                  value: 50,
                  message: t("TitleCannotExceed50Characters"),
                },
              })}
              id="title-input"
              type="text"
              value={videoTitle}
              onChange={videoTitleChangeHandler}
            />
            {errors.videoTitle && (
              <span style={{ color: "#b71c1c" }}>
                {errors.videoTitle.message}
              </span>
            )}
          </div>
          <div className={`row ${styles["row-margin"]}`}>
            <div className={`row ${styles["row-margin"]}`}>
              <div className="col-6">
                <label
                  htmlFor="select-film"
                  className={styles["custom-file-upload"]}
                >
                  <Search />
                  {t("SelectMP4File")}
                </label>
                <Input
                  id="select-film"
                  type="file"
                  onChange={videoChangeHandler}
                />
              </div>
              <div className="col-6">
                <span className={styles.description}>
                  {videoInputDescription}
                </span>
              </div>
            </div>
            <div className={`row ${styles["row-margin"]}`}>
              <span style={{ color: "#b71c1c" }}>
                {errors.video && errors.video.message}
              </span>
            </div>
            <div className={`row ${styles["row-margin"]}`}>
              <div className="col-6">
                <label
                  htmlFor="select-thumbnail"
                  className={styles["custom-file-upload"]}
                >
                  <InsertPhoto />
                  {t("SelectJPGFile")}
                </label>
                <Input
                  id="select-thumbnail"
                  type="file"
                  onChange={thumbnailChangeHandler}
                />
              </div>
              <div className="col-6">
                <span className={styles.description}>
                  {thumbnailInputDescription}
                </span>
              </div>
            </div>
            <div className={`row ${styles["row-margin"]}`}>
              <span style={{ color: "#b71c1c" }}>
                {errors.thumbnail && errors.thumbnail.message}
              </span>
            </div>
            <div className={`row ${styles["row-margin"]}`}>
              <p>
                {t("UsedDescriptionLength")}:{" "}
                {description ? description.length : "0"} / 5000{" "}
                {t("Characters")}
              </p>
              <div className={`row ${styles["row-margin"]}`}>
                {errors.description && (
                  <>
                    <span style={{ color: "#b71c1c" }}>
                      {t("DescriptionCannotExceed5000Characters")}.
                    </span>
                  </>
                )}
              </div>
              <p>
                {t("HowIsDescriptionCounted")}?
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
                    value={field.value}
                    onChange={(value) => {
                      if (value.trim().length > 5000) {
                        setError("description", {
                          type: "manual",
                          message: t("DescriptionCannotExceed5000Characters"),
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
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: "5%" }}>
        <h4 ref={explanationRef}>{t("DescriptionLengthExplanation")}</h4>
        <p>
          {t("DescriptionLengthExplanationTxt1")}
          <br />
          <strong> {t("DescriptionLengthExplanationTxt2")}</strong>
          <br />
          {t("DescriptionLengthExplanationTxt3")}:
        </p>
        {description && <p className={styles.code}>{description}</p>}
      </div>
      <ProgressDialog
        max={maxPackets}
        progress={uploadProgress}
        open={isProgressDialogOpened}
        title={progressDialogTitle}
      ></ProgressDialog>
      <ConfirmationDialog
        title={confirmationDialogTitle}
        message={confirmationDialogMessage}
        open={isConfirmationDialogOpened}
        hasCancelOption={false}
        onConfirm={() => {
          setIsConfirmaitonDialogOpened((prevState) => !prevState);
        }}
      ></ConfirmationDialog>
    </>
  );
};

export default FilmUpload;
