import {
  BlockBlobClient,
  AnonymousCredential,
  newPipeline,
} from "@azure/storage-blob";
import styles from "./FilmUpload.module.css";
import { useState } from "react";
import { Base64 } from "js-base64";
import { Button, Input } from "@mui/material";
import { Search, UploadFile, InsertPhoto } from "@mui/icons-material";
import { useAuth } from "./Account/AuthContext";
import { v4 } from "uuid";
import ReactQuill from "react-quill";
import ProgressDialog from "./ProgressDialog";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button

    ["link", "image"], // link and image, video
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
  "font",
  "align",
  "direction",
  "size",
  "script",
];

// function to get SAS token
const getSASToken = async (blobName, isVideo, accessToken, apiAddress) => {
  const fetchUrl = isVideo
    ? `https://${apiAddress}/api/SAS/film-upload/${blobName}`
    : `https://${apiAddress}/api/SAS/thumbnail-upload/${blobName}`;
  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
const stageBlocks = async (blobClient, blockIds, file, blockSize) => {
  for (let i = 0; i < blockIds.length; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, file.size);
    const chunk = file.slice(start, end);
    const chunkSize = end - start;
    await blobClient.stageBlock(blockIds[i], chunk, chunkSize);
  }
};

// Updated uploadBlob function
const uploadBlob = async (file, blobName, isVideo, accessToken) => {
  const account = process.env.REACT_APP_STORAGE_ACCOUNT_NAME;
  const filmContainerName = process.env.REACT_APP_FILMS_CONTAINER_NAME;
  const thumbnailContainerName =
    process.env.REACT_APP_THUMBNAILS_CONTAINER_NAME;
  const apiAddress = process.env.REACT_APP_API_ADDRESS;

  const sasToken = await getSASToken(
    blobName,
    isVideo,
    accessToken,
    apiAddress
  );

  const blockSize = 100 * 1024 * 1024; // 100MB
  const blockIds = createBlockIds(file.size, blockSize);

  const blobURL = `https://${account}.blob.core.windows.net/${
    isVideo ? filmContainerName : thumbnailContainerName
  }/${encodeURIComponent(blobName)}?${sasToken}`;
  const pipeline = newPipeline(new AnonymousCredential());
  const blobClient = new BlockBlobClient(blobURL, pipeline);

  await stageBlocks(blobClient, blockIds, file, blockSize);

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxPackets, setMaxPackets] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const { accessToken } = useAuth();
  const videoGuid = v4();
  const videoBlobName = `${videoGuid.toUpperCase()}.mp4`;
  const thumbnailBlobName = `${videoGuid.toUpperCase()}.jpg`;
  const titleChangeHandler = (e) => setTitle(e.target.value);

  const descriptionChangeHandler = (e) => {
    setDescription(e); // ReactQuill sends an event which actually is generated HTML already
  };

  const videoChangeHandler = (e) => {
    if (e.target.files) {
      if (e.target.files[0].name.includes(".mp4")) {
        setVideo(e.target.files[0]);
      } else {
        setVideo(undefined);
        alert("Only mp4!");
      }
    }
  };

  const thumbnailChangeHandler = (e) => {
    if (e.target.files) {
      if (e.target.files[0].name.includes(".jpg")) {
        setThumbnail(e.target.files[0]);
      } else {
        setThumbnail(undefined);
        alert("Only jpg!");
      }
    }
  };

  const uploadThumbnail = async (thumbnailName) => {
    setUploadProgress(0);
    setMaxPackets(1);
    await uploadBlob(
      thumbnail,
      thumbnailName,
      false,
      accessToken,
      setUploadProgress,
      setMaxPackets
    );
    setThumbnail(undefined);
  };

  const getVideoDurationAndUpdateProgress = async () => {
    setUploadProgress(0);
    setMaxPackets(1);
    const videoDuration = await getVideoDuration(video);
    setUploadProgress(1);
    return videoDuration;
  };

  const uploadVideo = async (videoName) => {
    await uploadBlob(
      video,
      videoName,
      true,
      accessToken,
      setUploadProgress,
      setMaxPackets
    );
    setVideo(undefined);
  };

  const postMetadata = async (videoGuid, videoName, videoDuration) => {
    setUploadProgress(0);
    setMaxPackets(1);
    const metadata = {
      Id: videoGuid,
      Name: title,
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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(metadata),
      }
    );

    const responseData = await response.json();
    setUploadProgress(1);
    return responseData;
  };

  const uploadVideoHandler = async () => {
    try {
      setIsDialogOpened(true);
      if (thumbnail) {
        await uploadThumbnail(thumbnailBlobName);
      }
      const videoDuration = await getVideoDurationAndUpdateProgress();
      await uploadVideo(videoBlobName);
      await postMetadata(videoGuid, videoBlobName, videoDuration);
      setTitle("");
      setDescription("");
      setIsDialogOpened(false);
    } catch (error) {
      console.error("An error occurred during the upload process:", error);
      setTitle("");
      setDescription("");
      setIsDialogOpened(false);
    }
  };

  let videoInputDescription = video
    ? `Selected file: ${video.name}`
    : "No file selected";

  let thumbnailInputDescription = thumbnail
    ? `Selected file: ${thumbnail.name}`
    : "No file selected";

  return (
    <>
      <div className={styles.container}>
        <h3 style={{ marginBottom: "5%" }}>Upload a new video</h3>
        <div className={`row ${styles["row-margin"]}`}>
          <label htmlFor="title-input">Title</label>
          <Input
            id="title-input"
            type="text"
            value={title}
            onChange={titleChangeHandler}
          />
        </div>
        <div className={`row ${styles["row-margin"]}`}>
          <div className="row">
            <div className="col-6">
              <label
                htmlFor="select-film"
                className={styles["custom-file-upload"]}
              >
                <Search />
                Select mp4 file
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
          <div className="row">
            <div className="col-6">
              <label
                htmlFor="select-thumbnail"
                className={styles["custom-file-upload"]}
              >
                <InsertPhoto />
                Select thumbnail file
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
            endIcon={<UploadFile />}
            onClick={uploadVideoHandler}
            style={{ marginTop: "5%" }}
          >
            Upload
          </Button>
        </div>
      </div>
      <ProgressDialog
        max={maxPackets}
        progress={uploadProgress}
        open={isDialogOpened}
        title={dialogTitle}
      ></ProgressDialog>
    </>
  );
};

export default FilmUpload;
