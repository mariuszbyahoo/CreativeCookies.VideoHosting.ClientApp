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

// function to get SAS token
const getSASToken = async (blobName, isVideo, apiAddress) => {
  const fetchUrl = isVideo
    ? `https://${apiAddress}/api/SAS/film-upload/${blobName}`
    : `https://${apiAddress}/api/SAS/thumbnail-upload/${blobName}`;
  const response = await fetch(fetchUrl, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get SAS token");
  }

  const data = await response.json();
  return data.sasToken;
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
  } = useForm();

  const description = watch("description");

  const videoGuid = v4();
  const videoBlobName = `${videoGuid.toUpperCase()}.mp4`;
  const thumbnailBlobName = `${videoGuid.toUpperCase()}.jpg`;
  const videoTitleChangeHandler = (e) => setVideoTitle(e.target.value);

  const scrollIntoExplanation = useCallback(() => {
    if (explanationRef.current !== null) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  const videoChangeHandler = (e) => {
    if (e.target.files) {
      if (e.target.files && e.target.files[0].name.includes(".mp4")) {
        setVideo(e.target.files[0]);
      } else {
        setVideo(undefined);
        setConfirmationDialogTitle("Validation error");
        setConfirmationDialogMessage("Only .mp4 files are allowed");
        setIsConfirmaitonDialogOpened(true);
      }
    }
  };

  const thumbnailChangeHandler = (e) => {
    if (e.target.files) {
      if (e.target.files && e.target.files[0].name.includes(".jpg")) {
        setThumbnail(e.target.files[0]);
      } else {
        setThumbnail(undefined);
        setConfirmationDialogTitle("Validation error");
        setConfirmationDialogMessage("Only .jpg files are allowed");
        setIsConfirmaitonDialogOpened(true);
      }
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
      `https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs`,
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
      setConfirmationDialogTitle("Error");
      setConfirmationDialogMessage("Video is required to select");
      setIsConfirmaitonDialogOpened(true);
      return;
    }
    if (!thumbnail) {
      setConfirmationDialogTitle("Error");
      setConfirmationDialogMessage("Thumbnail image is required to select");
      setIsConfirmaitonDialogOpened(true);
      return;
    }
    uploadVideoHandler();
  };
  const uploadVideoHandler = async () => {
    try {
      setProgressDialogTitle("Preparing to upload...");
      setUploadProgress(0);
      setIsProgressDialogOpened(true);
      if (thumbnail) {
        await uploadThumbnail(thumbnailBlobName);
      }
      const videoDuration = await getVideoDuration(video);
      setProgressDialogTitle("Uploading video");
      await uploadVideo(videoBlobName);
      setUploadProgress(0);
      setProgressDialogTitle("Saving video metadata");
      await postMetadata(videoGuid, videoBlobName, videoDuration);
      setUploadProgress(1);
      setConfirmationDialogTitle("Success!");
      setConfirmationDialogMessage("Video uploaded successfully");
      setIsConfirmaitonDialogOpened(true);
      return true;
    } catch (error) {
      setConfirmationDialogTitle("Error!");
      setConfirmationDialogMessage(
        "Unexpected error occured, please contact support"
      );
      setIsConfirmaitonDialogOpened(true);
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
    ? `Selected file: ${video.name}`
    : "Please select video";

  let thumbnailInputDescription = thumbnail
    ? `Selected file: ${thumbnail.name}`
    : "Please select thumbnail";

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <h3 style={{ marginBottom: "5%" }}>Upload a new video</h3>
          <Button
            variant="contained"
            endIcon={<UploadFile />}
            type="submit"
            style={{ marginBlock: "1%", width: "50%" }}
          >
            Upload
          </Button>
          <div className={`row ${styles["row-margin"]}`}>
            <label htmlFor="title-input">Title</label>
            <Input
              {...register("videoTitle", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Title cannot exceed 50 characters",
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
                  Select mp4 file
                </label>
                <Input
                  // {...register("video", {
                  //   validate: (value) => !value && "Video is required",
                  // })}
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
                  Select thumbnail file
                </label>
                <Input
                  // {...register("thumbnail", {
                  //   validate: (value) => !value && "Thumbnail is required",
                  // })}
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
                Used description length:{" "}
                {description ? description.length : "0"} / 5000 characters
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
              {/* <ReactQuill
                theme="snow"
                value={description}
                onChange={descriptionChangeHandler}
                modules={quillModules}
                formats={quillFormats}
              /> */}
            </div>
          </div>
        </div>
      </form>
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
