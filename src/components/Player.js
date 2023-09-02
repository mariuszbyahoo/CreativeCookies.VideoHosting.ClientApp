import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Player.module.css";
import "plyr-react/plyr.css";
import Plyr from "plyr-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Account/AuthContext";
import DOMPurify from "dompurify";
import { CircularProgress } from "@mui/material";

const allowedTo = "admin,ADMIN,subscriber,SUBSCRIBER";

const Player = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef(null);
  const { refreshTokens, userRole, isAuthenticated, login } = useAuth();
  const location = useLocation();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    fetchPlayerData();
  }, []);

  async function fetchPlayerData() {
    setLoading(true);
    const apiResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/blobs/getMetadata?Id=${params.id}`
    );

    const blobResponseJson = await apiResponse.json();
    setUploadDate(
      new Date(blobResponseJson.createdOn).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setThumbnailName(blobResponseJson.thumbnailName);
    setVideoTitle(blobResponseJson.name);
    const sanitizedHTML = DOMPurify.sanitize(blobResponseJson.description);
    setVideoDescription(sanitizedHTML);
    if (userRole && allowedTo.includes(userRole.toUpperCase())) {
      const sasTokenResponse = await fetchSasTokenForVideo();
      setVideoUrl(`${blobResponseJson.blobUrl}?${sasTokenResponse}`);
    } else {
      setThumbnailUrl(
        `https://${
          process.env.REACT_APP_STORAGE_ACCOUNT_NAME
        }.blob.core.windows.net/${
          process.env.REACT_APP_THUMBNAILS_CONTAINER_NAME
        }/${
          blobResponseJson.thumbnailName
        }?${await fetchSasTokenForThumbnail()}`
      );
    }
    setLoading(false);
  }

  const fetchSasTokenForThumbnail = async () => {
    const response = await fetch(
      `https://${
        process.env.REACT_APP_API_ADDRESS
      }/sas/thumbnail/${params.id.toUpperCase()}.jpg`
    );
    const data = await response.json();
    return data.sasToken;
  };

  async function fetchSasTokenForVideo(retry = true) {
    try {
      const response = await fetch(
        `https://${
          process.env.REACT_APP_API_ADDRESS
        }/sas/film/${params.id.toUpperCase()}.mp4`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.sasToken;
      } else if (response.status == "401" && retry) {
        var refreshResponse = await refreshTokens(false);
        if (refreshResponse == "LoginAgain") {
          navigate("/logout");
        } else {
          return fetchSasTokenForVideo(false);
        }
      } else {
        navigate("/logout");
      }
    } catch (error) {
      console.log("error happened: ", error);
      console.log("JSON.stringinfy(error): ", JSON.stringify(error));
    }
  }

  const videoOptions = undefined;
  const subscribeBox = (
    <div
      className={styles.subscribeBox}
      onClick={() =>
        isAuthenticated ? navigate("/subscribe") : login(location.pathname)
      }
      style={{ backgroundImage: `url(${thumbnailUrl})` }}
    ></div>
  );

  const plyrVideo = videoUrl ? (
    <>
      <Plyr
        ref={ref}
        source={{
          type: "video",
          sources: [
            {
              src: videoUrl,
              provider: "html5",
              type: "video/mp4",
            },
          ],
        }}
        options={videoOptions}
      />
    </>
  ) : (
    subscribeBox
  );

  let content;

  if (loading) {
    content = (
      <div className={styles.progress}>
        <CircularProgress size={200} />
      </div>
    );
  } else {
    content = plyrVideo;
  }

  let description = (
    <div className="ql-editor">
      <h3 className={styles.title}>{videoTitle}</h3>
      <p className={styles.creationDate}>{uploadDate}</p>
      {videoDescription && (
        <div dangerouslySetInnerHTML={{ __html: videoDescription }} />
      )}
    </div>
  );

  return (
    <>
      <div className={styles.videoPlayer}>{content}</div>
      {description}
    </>
  );
};
export default Player;
