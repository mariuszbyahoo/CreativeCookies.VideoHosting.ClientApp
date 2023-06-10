import { useNavigate, useParams } from "react-router-dom";
import styles from "./Player.module.css";
import "plyr-react/plyr.css";
import Plyr from "plyr-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Account/AuthContext";
import DOMPurify from "dompurify";

const Player = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef(null);
  const { accessToken, refreshTokens } = useAuth();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    fetchMetadataWithSAS();
  }, []);
  async function fetchMetadataWithSAS() {
    console.log("fetching SAS token");
    setLoading(true);
    // FROM HERE Encapsulate it to another function
    const apiResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/getMetadata?Id=${params.id}`
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

    setVideoTitle(blobResponseJson.name);
    const sanitizedHTML = DOMPurify.sanitize(blobResponseJson.description);
    setVideoDescription(sanitizedHTML);
    // TILL HERE
    const sasTokenResponse = await fetchSasToken();
    setVideoUrl(`${blobResponseJson.blobUrl}?${sasTokenResponse}`);
    setLoading(false);
  }

  async function fetchSasToken(retry = true, token = accessToken) {
    try {
      debugger;
      const response = await fetch(
        `https://${
          process.env.REACT_APP_API_ADDRESS
        }/api/sas/film/${params.id.toUpperCase()}.mp4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.sasToken;
      } else if (response.status == "401" && retry) {
        console.log("Refreshing an access token...");
        console.log(`Old token: ${token}`);
        const newAccessToken = await refreshTokens();
        console.log("Refreshed");
        console.log(`New accessToken: ${newAccessToken}`);
        return fetchSasToken(false, newAccessToken);
      } else {
        // HACK TODO Handle some other scenarios (like redirect to nice error page)
      }
    } catch (error) {
      console.log("error happened: ", error);
      console.log("JSON.stringinfy(error): ", JSON.stringify(error));
    }
  }

  const videoOptions = undefined;
  const plyrVideo = videoUrl && (
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
  );

  let content;

  if (loading) {
    content = <p>loading</p>;
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
