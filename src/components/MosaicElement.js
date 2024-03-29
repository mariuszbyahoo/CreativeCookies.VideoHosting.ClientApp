import { Link } from "react-router-dom";
import styles from "./MosaicElement.module.css";
import { useEffect, useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button } from "@mui/material";
import { useAuth } from "./Account/AuthContext";

const fetchSasToken = async (id) => {
  const response = await fetch(
    `https://${process.env.REACT_APP_API_ADDRESS}/sas/thumbnail/${id}`
  );
  const data = await response.json();
  return data.sasToken;
};

const fetchBlob = async (blobName, sasToken) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.REACT_APP_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(
    process.env.REACT_APP_THUMBNAILS_CONTAINER_NAME
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const response = await blockBlobClient.download(0);
  const imageBlob = await response.blobBody;
  return imageBlob;
};

const MosaicElement = (props) => {
  const [blobImage, setBlobImage] = useState(undefined);
  const { userRole, isAuthenticated } = useAuth();

  useEffect(() => {
    if (
      props.thumbnail == null ||
      props.thumbnail == undefined ||
      (props.thumbnail && props.thumbnail.length == 0)
    ) {
      setBlobImage(`${process.env.PUBLIC_URL}/blank_thumbnail.jpg`); // Set the path to the default image
    } else {
      fetchSasToken(props.thumbnail).then((sasToken) => {
        const blob = fetchBlob(props.thumbnail, sasToken)
          .then((blob) => {
            setBlobImage(URL.createObjectURL(blob));
          })
          .catch((error) => {
            console.log(
              "error while fetching thumbnail for name: ",
              props.thumbnail
            );
            setBlobImage(`${process.env.PUBLIC_URL}/blank_thumbnail.jpg`);
          });
      });
    }
  }, [props.thumbnail]);

  const videoDurationToString = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Pad with leading zeros if necessary
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    let timeSpan = `${formattedMinutes}:${formattedSeconds}`;
    if (formattedHours > 0) {
      timeSpan = `${formattedHours}:${timeSpan}`;
    }
    return timeSpan;
  };

  const editDeleteButtons = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return (
        <>
          <Button
            className={styles.editButton}
            onClick={() => props.openEditorHandler(props.videoId)}
          >
            <BorderColorIcon className={styles.editButtonIcon} />
          </Button>
          <Button
            className={styles.closeButton}
            onClick={() => props.deleteVideoHandler(props.videoId)}
          >
            <DeleteForeverIcon className={styles.closeButtonIcon} />
          </Button>
        </>
      );
    }
  };

  const overlay = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return <div className={styles.overlay}></div>;
    }
  };

  return (
    <div className={styles.boxShadowCard}>
      {editDeleteButtons()}
      <Link to={"/player/" + props.videoId} className={styles.linkImage}>
        {overlay()}
        <div className={styles.imageContainer}>
          <img src={blobImage} alt="thumbnail" className={styles.thumbnail} />
          <div className={styles.badge}>
            {videoDurationToString(props.duration)}
          </div>
        </div>
        <p className={styles.videoTitle}>{props.film}</p>
      </Link>
    </div>
  );
};

export default MosaicElement;
