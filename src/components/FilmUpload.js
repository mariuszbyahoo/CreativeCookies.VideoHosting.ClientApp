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
  const { accessToken } = useAuth();

  const titleChangeHandler = (e) => setTitle(e.target.value);
  const descriptionChangeHandler = (e) => setDescription(e.target.value);

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

  const uploadVideoHandler = () => {
    if (!video) {
      return;
    }
    const guid = v4();
    const videoBlobName = `${guid}.mp4`;
    const thumbnailName = `${guid}.jpg`;
    if (thumbnail) {
      uploadBlob(thumbnail, thumbnailName, false, accessToken)
        .then((res) => {
          setThumbnail(undefined);
        })
        .catch((error) => {
          console.log("Error while uploading thumbnail: ", error);
          setThumbnail(undefined);
        });
    }
    getVideoDuration(video)
      .then((videoDuration) => {
        uploadBlob(video, videoBlobName, true, accessToken)
          .then((res) => {
            setVideo(undefined);

            const metadata = {
              Id: guid,
              Name: title,
              Description: description,
              Length: videoDuration.toFixed(0),
              ThumbnailName: thumbnailName,
              BlobUrl: `https://${process.env.REACT_APP_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.REACT_APP_FILMS_CONTAINER_NAME}/${videoBlobName}`, // HACK TODO: this is just a stamp. It has to be pulled from Azure Blob Storage itself.
              CreatedOn: new Date(),
              VideoType: "Premium",
            };

            fetch(`https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(metadata),
            })
              .then((response) => {
                response.json();
                setTitle("");
                setDescription("");
              })
              .catch((error) => {
                console.log("Error while saving metadata: ", error);
                setTitle("");
                setDescription("");
              });
          })
          .catch((error) => {
            console.log("Error while uploading video: ", error);
            setVideo(undefined);
            setTitle("");
            setDescription("");
          });
      })
      .catch((error) => {
        console.log("Error while reading the video's length: ", error);
        setVideo(undefined);
        setTitle("");
        setDescription("");
      });
  };

  let videoInputDescription = video
    ? `Selected file: ${video.name}`
    : "No file selected";

  let thumbnailInputDescription = thumbnail
    ? `Selected file: ${thumbnail.name}`
    : "No file selected";

  return (
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
            <Input id="select-film" type="file" onChange={videoChangeHandler} />
          </div>
          <div className="col-6">
            <span className={styles.description}>{videoInputDescription}</span>
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
          <label htmlFor="description-input">Description</label>
          <Input
            id="description-input"
            type="text"
            value={description}
            onChange={descriptionChangeHandler}
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
  );
};

export default FilmUpload;
